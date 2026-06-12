using System.Text;
using FluentValidation;
using FluentValidation.AspNetCore;
using LabourLinkAPI.Data;
using LabourLinkAPI.GraphQL;
using LabourLinkAPI.GraphQL.Types;
using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using LabourLinkAPI.Repository;
using LabourLinkAPI.Services.Auth;
using LabourLinkAPI.Services.Common;
using LabourLinkAPI.Services.Email;
using LabourLinkAPI.Validators.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(
            new System.Text.Json.Serialization.JsonStringEnumConverter());
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var problem = new ValidationProblemDetails(context.ModelState)
            {
                Status = StatusCodes.Status400BadRequest,
                Title = "Validation failed",
                Instance = context.HttpContext.Request.Path,
            };

            return new BadRequestObjectResult(problem);
        };
    });

builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();

builder.Services.AddDbContext<LabourLinkDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    options.UseMySQL(connectionString ?? string.Empty);
});

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

var jwtOptions = builder.Configuration.GetSection("Jwt").Get<JwtOptions>() ?? new JwtOptions();
var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Key));

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidateLifetime = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = signingKey,
            ClockSkew = TimeSpan.FromMinutes(1),
        };
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("WorkerOnly", policy => policy.RequireRole(nameof(UserRole.Worker)))
    .AddPolicy("JobSeekerOnly", policy => policy.RequireRole(nameof(UserRole.JobSeeker)))
    .AddPolicy("AgencyOnly", policy => policy.RequireRole(nameof(UserRole.RecruitmentAgency)))
    .AddPolicy("AdminOnly", policy => policy.RequireRole(nameof(UserRole.Administrator)));

var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options =>
{
    options.AddPolicy("Frontend", policy =>
    {
        if (corsOrigins.Length > 0)
        {
            policy.WithOrigins(corsOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials();
        }
        else
        {
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "LabourLink API",
        Version = "v1",
    });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer",
                },
            },
            Array.Empty<string>()
        },
    });
});

builder.Services.Configure<SesOptions>(builder.Configuration.GetSection("Ses"));
builder.Services.AddScoped<IEmailService, EmailService>();

builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IPasswordHashService, PasswordHashService>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>()
    .AddType<JobType>()
    .AddType<NewsType>();

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("Frontend");

app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapGraphQL();

try { await SeedDemoUsersAsync(app); } catch (Exception ex) { app.Logger.LogWarning("Seed skipped (DB unavailable?): {Message}", ex.Message); }
try { await EnsureSchemaColumnsAsync(app); } catch (Exception ex) { app.Logger.LogWarning("Schema migration skipped: {Message}", ex.Message); }

app.Run();

static async Task SeedDemoUsersAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<LabourLinkDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHashService>();

    var demoUsers = new[]
    {
        new { Email = "admin@labourlink.demo",     Password = "Admin@123456",  Role = UserRole.Administrator,     Name = ("Admin", "User") },
        new { Email = "worker@labourlink.demo",    Password = "Worker@123456", Role = UserRole.Worker,            Name = ("Demo", "Worker") },
        new { Email = "jobseeker@labourlink.demo", Password = "Seeker@123456", Role = UserRole.JobSeeker,         Name = ("Demo", "Seeker") },
        new { Email = "agency@labourlink.demo",    Password = "Agency@123456", Role = UserRole.RecruitmentAgency, Name = ("Demo", "Agency") },
    };

    foreach (var demo in demoUsers)
    {
        var exists = await db.Users.AnyAsync(u => u.Email == demo.Email);
        if (exists) continue;

        db.Users.Add(new User
        {
            UserId          = Guid.NewGuid(),
            Email           = demo.Email,
            PasswordHash    = hasher.Hash(demo.Password),
            FirstName       = demo.Name.Item1,
            LastName        = demo.Name.Item2,
            Role            = demo.Role,
            Status          = UserStatus.Active,
            IsEmailVerified = true,
            IsPhoneVerified = false,
            CreatedAt       = DateTime.UtcNow,
            UpdatedAt       = DateTime.UtcNow,
        });
    }

    await db.SaveChangesAsync();
}

static async Task EnsureSchemaColumnsAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<LabourLinkDbContext>();
    await db.Database.ExecuteSqlRawAsync(
        "ALTER TABLE job_postings ADD COLUMN IF NOT EXISTS Benefits json DEFAULT (JSON_ARRAY());"
    );
    await db.Database.ExecuteSqlRawAsync(
        "ALTER TABLE worker_complaints ADD COLUMN IF NOT EXISTS TargetAgencyName varchar(255) NULL;"
    );
    await db.Database.ExecuteSqlRawAsync(
        "ALTER TABLE worker_complaints ADD COLUMN IF NOT EXISTS WorkerRating int NULL;"
    );
    await db.Database.ExecuteSqlRawAsync(
        "ALTER TABLE job_applications MODIFY COLUMN JobSeekerId char(36) NULL;"
    );
    // Drop unique constraints that block auto-created agencies with placeholder values.
    // Use raw ADO.NET so EF Core's command logger doesn't emit fail-level noise on repeat runs.
    var conn = db.Database.GetDbConnection();
    await conn.OpenAsync();
    try
    {
        foreach (var idx in new[] { "IX_recruitment_agencies_CompanyRegistrationNumber", "IX_recruitment_agencies_LicenseNumber" })
        {
            try
            {
                using var cmd = conn.CreateCommand();
                cmd.CommandText = $"ALTER TABLE recruitment_agencies DROP INDEX `{idx}`";
                await cmd.ExecuteNonQueryAsync();
            }
            catch { /* index already dropped — safe to ignore */ }
        }
    }
    finally
    {
        conn.Close();
    }
}

public partial class Program { }
