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
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configurando Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);

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

// Services
builder.Services.AddScoped<IUsersService, UsersService>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IEventsService, EventsService>();
builder.Services.AddScoped<IAuthService, AuthService>();
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

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

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
