using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Rejestracja SQLite jako bazy danych
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite("Data Source=RealTimeSystem.db"));

// Rejestracja SignalR
builder.Services.AddSignalR();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Rejestracja CORS, aby React mógł łączyć się z API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy.WithOrigins("http://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()); // Obsługa połączeń SignalR
});

var app = builder.Build();

// Swagger do dokumentacji API (tylko w środowisku developerskim)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

// Mapowanie huba SignalR
app.MapHub<NotificationHub>("/notificationHub");

app.Run();
