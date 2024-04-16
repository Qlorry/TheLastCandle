using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TheLastCandle.ErrorHandlers;
using TheLastCandle.Hubs;
using TheLastCandle.Services;
using TheLastCandle.Services.Presenters;
using TheLastCandle.Services.Providers;
using TheLastCandle.Services.Providers.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Handlers
builder.Services.AddExceptionHandler<BadRequestExceptionHandler>();
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();

// Auth
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
 {
     options.Authority = $"https://{builder.Configuration["Auth0:Domain"]}/";
     options.Audience = builder.Configuration["Auth0:Audience"];

     options.TokenValidationParameters = new TokenValidationParameters { };
 });

// Add Controllers.
builder.Services.AddControllers();
builder.Services.AddSignalR();

// Add swagger
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "My API",
        Version = "v1"
    });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please insert JWT with Bearer into field",
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement {
   {
     new OpenApiSecurityScheme
     {
       Reference = new OpenApiReference
       {
         Type = ReferenceType.SecurityScheme,
         Id = "Bearer"
       }
      },
      new string[] { }
        }
  });
});

// My services
var section = builder.Configuration.GetSection("PresenterConfig");
builder.Services.Configure<PresenterConfig>(section);

builder.Services.AddSingleton<ISessionProvider, FsSessionProvider>();
builder.Services.AddSingleton<IUserProvider, FsUserProvider>();
builder.Services.AddSingleton<IPlayerProvider, FsPlayerProvider>();
builder.Services.AddSingleton<IBoardProvider, FsBoardProvider>();

builder.Services.AddSingleton<SessionManager, SessionManager>();
builder.Services.AddTransient<ISessionPresenter, GameBasePresenter>();
builder.Services.AddTransient<IServerEventTransmitter, SessionEventTransmitter>();

// Configure the HTTP request pipeline.
var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler(opt => { });

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<GameHub>("api/hubs/game");

app.Run();
