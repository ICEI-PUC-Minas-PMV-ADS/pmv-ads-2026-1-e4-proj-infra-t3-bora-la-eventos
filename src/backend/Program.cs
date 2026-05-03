using System.Text;
using BoraLaBackend.Feature.Events.Repository;
using BoraLaBackend.Feature.Events.Services;
using BoraLaBackend.Feature.Authentication.Repositories;
using BoraLaBackend.Feature.Authentication.Services;
using BoraLaBackend.Feature.Authentication.Services.Interfaces;
using BoraLaBackend.Feature.Users.Repository;
using BoraLaBackend.Feature.Users.Services;
using BoraLaBackend.Shared.Database;
using BoraLaBackend.Shared.Security;
using BoraLaBackend.Shared.Utils;
using BoraLaBackend.Shared.Utils.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using BoraLaBackend.Feature.Comments.Repositories;
using BoraLaBackend.Feature.Comments.Services;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configurando Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "BoraLaBackend", Version = "v1" });

    c.TagActionsBy(api =>
    {
        if (api.ActionDescriptor is Microsoft.AspNetCore.Mvc.Controllers.ControllerActionDescriptor desc)
        {
            if (desc.ControllerName == "Users" && desc.ActionName == "Register")
                return new[] { "Auth" };
            return new[] { desc.ControllerName };
        }
        return new[] { api.GroupName ?? "default" };
    });

    c.DocumentFilter<TagOrderDocumentFilter>();

    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Cole o token aqui (sem o prefixo 'Bearer')"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Configure MongoDB
builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings")
);

builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = builder.Configuration.GetSection("MongoSettings").Get<MongoSettings>();
    var mongoClientSettings = MongoClientSettings.FromConnectionString(settings?.ConnectionString);

    return new MongoClient(settings?.ConnectionString);
});

// Repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IBlackListRepository, BlackListRepository>();
builder.Services.AddScoped<ICommentsRepository, CommentsRepository>();

// Services
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IEventsService, EventsService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IEventLikeRepository, EventLikeRepository>();

// Helpers
builder.Services.AddScoped<IPasswordService, PasswordService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IEnumHelper, EnumHelper>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var serverSecret = builder.Configuration["Auth:ServerSecret"];
    var key = Encoding.ASCII.GetBytes(serverSecret ?? "");

    options.MapInboundClaims = false;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        ValidateIssuer = false,
        ValidateAudience = false,

        ClockSkew = TimeSpan.Zero
    };

    options.Events = new JwtBearerEvents
    {
        OnTokenValidated = async context =>
        {
            var userRepository = context.HttpContext.RequestServices.GetRequiredService<IUserRepository>();

            var emailClaim = context.Principal?.Claims.FirstOrDefault(c => c.Type == "email")?.Value;

            var tokenVersionClaim = context.Principal?.Claims.FirstOrDefault(c => c.Type == "token_version")?.Value;

            if (!string.IsNullOrEmpty(emailClaim) && int.TryParse(tokenVersionClaim, out int tokenVersion))
            {
                var user = await userRepository.GetByEmailAsync(emailClaim);

                if (user == null || user.TokenVersion != tokenVersion)
                {
                    context.Fail("Token version is invalid or expired.");
                }
            }
        }
    };
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BoraLaBackend v1"));

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Direciona qualquer requisição que não seja um dos controllers para 404 
app.MapFallback(() => Results.NotFound());

app.Run();

public class TagOrderDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        swaggerDoc.Tags = new List<OpenApiTag>
        {
            new OpenApiTag { Name = "Auth" },
            new OpenApiTag { Name = "Users" },
            new OpenApiTag { Name = "Events" },
            new OpenApiTag { Name = "Comments" },
            new OpenApiTag { Name = "Health" }
        };
    }
}
