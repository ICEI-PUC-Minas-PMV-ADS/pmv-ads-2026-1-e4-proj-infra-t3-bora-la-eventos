using MongoDB.Driver;
using MongoDBSettings;

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
app.MapControllers();
app.Run();
