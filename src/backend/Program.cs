using System.Text;
using BoraLaBackend.Infrastructure.Database;
using BoraLaBackend.Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
// configuring OpenAPI (Swegger)
builder.Services.AddOpenApi();

// Configure MongoDB
builder.Services.Configure<MongoSettings>(
    builder.Configuration.GetSection("MongoSettings")
);

builder.Services.AddSingleton(sp =>
{
    var settings = builder.Configuration.GetSection("MongoSettings").Get<MongoSettings>();
    return new MongoClient(settings?.ConnectionString);
});

// Inject dependencies
builder.Services.AddScoped<IJwtService, JwtService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    var serverSecret = builder.Configuration["Auth:ServerSecret"];
    var key = Encoding.ASCII.GetBytes(serverSecret ?? "");

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        ValidateIssuer = false,
        ValidateAudience = false,

        ClockSkew = TimeSpan.Zero
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}
app.MapControllers();

// Direciona qualquer requisição que não seja um dos controllers para 404 
app.MapFallback(() => Results.NotFound());

app.Run();
