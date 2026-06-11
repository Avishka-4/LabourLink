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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("WorkerOnly", policy => policy.RequireRole(nameof(UserRole.Worker)));
    options.AddPolicy("JobSeekerOnly", policy => policy.RequireRole(nameof(UserRole.JobSeeker)));
    options.AddPolicy("AgencyOnly", policy => policy.RequireRole(nameof(UserRole.RecruitmentAgency)));
    options.AddPolicy("AdminOnly", policy => policy.RequireRole(nameof(UserRole.Administrator)));
});

var corsOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();
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
try { await SeedMockDataAsync(app); } catch (Exception ex) { app.Logger.LogWarning("Mock data seed skipped: {Message}", ex.Message); }

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

        db.Users.Add(new LabourLinkAPI.Models.Entities.User
        {
            UserId          = Guid.NewGuid(),
            Email           = demo.Email,
            PasswordHash    = hasher.Hash(demo.Password),
            FirstName       = demo.Name.Item1,
            LastName        = demo.Name.Item2,
            Role            = demo.Role,
            Status          = LabourLinkAPI.Models.Enums.UserStatus.Active,
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
    // Drop unique constraints that block auto-created agencies with empty placeholder values.
    // Wrapped in try/catch because the index may already be gone on subsequent restarts.
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE recruitment_agencies DROP INDEX IX_recruitment_agencies_CompanyRegistrationNumber;"); } catch { /* already dropped */ }
    try { await db.Database.ExecuteSqlRawAsync("ALTER TABLE recruitment_agencies DROP INDEX IX_recruitment_agencies_LicenseNumber;"); } catch { /* already dropped */ }
}

static async Task SeedMockDataAsync(WebApplication app)
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<LabourLinkDbContext>();
    var hasher = scope.ServiceProvider.GetRequiredService<IPasswordHashService>();

    if (await db.Users.AnyAsync(u => u.Email == "gulftech@labourlink.demo")) return;

    var now = DateTime.UtcNow;
    var adminUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "admin@labourlink.demo");
    var adminId = adminUser?.UserId ?? Guid.NewGuid();
    var demoAgencyUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "agency@labourlink.demo");
    var demoWorkerUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "worker@labourlink.demo");
    var demoJobSeekerUser = await db.Users.FirstOrDefaultAsync(u => u.Email == "jobseeker@labourlink.demo");

    // ── Agency users ──────────────────────────────────────────────────────────
    var aUser1 = new User { UserId = Guid.NewGuid(), Email = "gulftech@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Gulf", LastName = "Tech", Role = UserRole.RecruitmentAgency, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-90), UpdatedAt = now };
    var aUser2 = new User { UserId = Guid.NewGuid(), Email = "slintl@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "SL", LastName = "International", Role = UserRole.RecruitmentAgency, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-75), UpdatedAt = now };
    var aUser3 = new User { UserId = Guid.NewGuid(), Email = "prostaff@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "ProStaff", LastName = "Lanka", Role = UserRole.RecruitmentAgency, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-60), UpdatedAt = now };

    // ── Job seeker users ──────────────────────────────────────────────────────
    var jsUser1 = new User { UserId = Guid.NewGuid(), Email = "maleesha@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Maleesha", LastName = "Perera", Role = UserRole.JobSeeker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-50), UpdatedAt = now };
    var jsUser2 = new User { UserId = Guid.NewGuid(), Email = "kasun@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Kasun", LastName = "Fernando", Role = UserRole.JobSeeker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-45), UpdatedAt = now };
    var jsUser3 = new User { UserId = Guid.NewGuid(), Email = "sachini@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Sachini", LastName = "Jayawardena", Role = UserRole.JobSeeker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-40), UpdatedAt = now };
    var jsUser4 = new User { UserId = Guid.NewGuid(), Email = "dilshan@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Dilshan", LastName = "Wickramasinghe", Role = UserRole.JobSeeker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-35), UpdatedAt = now };
    var jsUser5 = new User { UserId = Guid.NewGuid(), Email = "nishani@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Nishani", LastName = "Dissanayake", Role = UserRole.JobSeeker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-30), UpdatedAt = now };

    // ── Worker users ──────────────────────────────────────────────────────────
    var wUser1 = new User { UserId = Guid.NewGuid(), Email = "sampath@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Sampath", LastName = "Bandara", Role = UserRole.Worker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-80), UpdatedAt = now };
    var wUser2 = new User { UserId = Guid.NewGuid(), Email = "kumari@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Kumari", LastName = "Herath", Role = UserRole.Worker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-70), UpdatedAt = now };
    var wUser3 = new User { UserId = Guid.NewGuid(), Email = "chatura@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Chatura", LastName = "Wijesinghe", Role = UserRole.Worker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-65), UpdatedAt = now };
    var wUser4 = new User { UserId = Guid.NewGuid(), Email = "ranji@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Ranji", LastName = "Senanayake", Role = UserRole.Worker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-55), UpdatedAt = now };
    var wUser5 = new User { UserId = Guid.NewGuid(), Email = "priya@labourlink.demo", PasswordHash = hasher.Hash("Mock@123456"), FirstName = "Priya", LastName = "Thambipillai", Role = UserRole.Worker, Status = UserStatus.Active, IsEmailVerified = true, IsPhoneVerified = false, CreatedAt = now.AddDays(-48), UpdatedAt = now };

    db.Users.AddRange(aUser1, aUser2, aUser3, jsUser1, jsUser2, jsUser3, jsUser4, jsUser5, wUser1, wUser2, wUser3, wUser4, wUser5);
    await db.SaveChangesAsync();

    // ── Agency profiles ───────────────────────────────────────────────────────
    var ag1Id = Guid.NewGuid();
    var ag2Id = Guid.NewGuid();
    var ag3Id = Guid.NewGuid();
    var agencyList = new List<RecruitmentAgency>
    {
        new() { AgencyId = ag1Id, UserId = aUser1.UserId, CompanyName = "Gulf Tech Recruitment", CompanyRegistrationNumber = "PV-00112-GT", LicenseNumber = "SL-REC-2019-0045", VerificationStatus = VerificationStatus.Verified, VerifiedAt = now.AddDays(-85), VerifiedBy = adminId, BusinessAddress = "No. 45, Galle Rd, Colombo 03", WebsiteUrl = "https://gulftech.example.com", NumberOfEmployees = 48, EstablishedYear = 2015, TaxId = "TAX-GT-44123", BankAccount = "BOC-0045122390", OperatingCountries = new() { "UAE", "Saudi Arabia", "Qatar" }, Certifications = new() { "ISO 9001", "SLBFE Licensed" }, CreatedAt = now.AddDays(-90), UpdatedAt = now },
        new() { AgencyId = ag2Id, UserId = aUser2.UserId, CompanyName = "SL International Manpower", CompanyRegistrationNumber = "PV-00234-SL", LicenseNumber = "SL-REC-2020-0078", VerificationStatus = VerificationStatus.Verified, VerifiedAt = now.AddDays(-70), VerifiedBy = adminId, BusinessAddress = "37, D.S. Senanayake Mw, Kandy", WebsiteUrl = "https://slintl.example.com", NumberOfEmployees = 32, EstablishedYear = 2018, TaxId = "TAX-SL-55234", BankAccount = "HNB-0032890012", OperatingCountries = new() { "Saudi Arabia", "Kuwait", "Bahrain" }, Certifications = new() { "SLBFE Licensed" }, CreatedAt = now.AddDays(-75), UpdatedAt = now },
        new() { AgencyId = ag3Id, UserId = aUser3.UserId, CompanyName = "ProStaff Lanka", CompanyRegistrationNumber = "PV-00345-PS", LicenseNumber = "SL-REC-2021-0112", VerificationStatus = VerificationStatus.Pending, BusinessAddress = "12, Baseline Rd, Rajagiriya", NumberOfEmployees = 15, EstablishedYear = 2020, TaxId = "TAX-PS-66345", BankAccount = "SAMPATH-0015340090", OperatingCountries = new() { "Malaysia", "Singapore" }, Certifications = new List<string>(), CreatedAt = now.AddDays(-60), UpdatedAt = now },
    };

    Guid demoAgId = Guid.Empty;
    if (demoAgencyUser != null)
    {
        var existingDemoAg = await db.RecruitmentAgencies.FirstOrDefaultAsync(a => a.UserId == demoAgencyUser.UserId);
        if (existingDemoAg == null)
        {
            demoAgId = Guid.NewGuid();
            agencyList.Add(new() { AgencyId = demoAgId, UserId = demoAgencyUser.UserId, CompanyName = "Demo Recruitment Co.", CompanyRegistrationNumber = "PV-00001-DM", LicenseNumber = "SL-REC-2024-0001", VerificationStatus = VerificationStatus.Verified, VerifiedAt = now.AddDays(-30), VerifiedBy = adminId, BusinessAddress = "1 Demo Lane, Colombo 01", TaxId = "TAX-DM-00001", BankAccount = "BOC-0000000001", OperatingCountries = new() { "Sri Lanka", "UAE" }, Certifications = new() { "SLBFE Licensed" }, CreatedAt = now.AddDays(-45), UpdatedAt = now });
        }
        else
        {
            demoAgId = existingDemoAg.AgencyId;
        }
    }

    db.RecruitmentAgencies.AddRange(agencyList);
    await db.SaveChangesAsync();

    // ── Job seeker profiles ───────────────────────────────────────────────────
    var jsProf1 = new JobSeeker { JobSeekerId = Guid.NewGuid(), UserId = jsUser1.UserId, EducationLevel = EducationLevel.Degree, Qualification = "BSc Computer Science", DesiredJobRole = "Software Engineer", DesiredLocation = "Dubai, UAE", ExpectedSalary = 120000, IsAvailable = true, Languages = new() { "Sinhala", "English", "Tamil" }, Certifications = new() { "AWS Cloud Practitioner", "Scrum Master" }, CreatedAt = jsUser1.CreatedAt, UpdatedAt = now };
    var jsProf2 = new JobSeeker { JobSeekerId = Guid.NewGuid(), UserId = jsUser2.UserId, EducationLevel = EducationLevel.Degree, Qualification = "BCom Accounting", DesiredJobRole = "Accountant", DesiredLocation = "Saudi Arabia", ExpectedSalary = 95000, IsAvailable = true, Languages = new() { "Sinhala", "English" }, Certifications = new() { "CIMA Part-Qualified" }, CreatedAt = jsUser2.CreatedAt, UpdatedAt = now };
    var jsProf3 = new JobSeeker { JobSeekerId = Guid.NewGuid(), UserId = jsUser3.UserId, EducationLevel = EducationLevel.Degree, Qualification = "BA Marketing", DesiredJobRole = "Marketing Executive", DesiredLocation = "UAE", ExpectedSalary = 85000, IsAvailable = true, Languages = new() { "Sinhala", "English", "Hindi" }, Certifications = new() { "Google Analytics" }, CreatedAt = jsUser3.CreatedAt, UpdatedAt = now };
    var jsProf4 = new JobSeeker { JobSeekerId = Guid.NewGuid(), UserId = jsUser4.UserId, EducationLevel = EducationLevel.Diploma, Qualification = "Diploma in Civil Engineering", DesiredJobRole = "Civil Engineer", DesiredLocation = "Qatar", ExpectedSalary = 110000, IsAvailable = true, Languages = new() { "Sinhala", "English" }, Certifications = new List<string>(), CreatedAt = jsUser4.CreatedAt, UpdatedAt = now };
    var jsProf5 = new JobSeeker { JobSeekerId = Guid.NewGuid(), UserId = jsUser5.UserId, EducationLevel = EducationLevel.Degree, Qualification = "BSc Nursing", DesiredJobRole = "Registered Nurse", DesiredLocation = "UK", ExpectedSalary = 150000, IsAvailable = true, Languages = new() { "Sinhala", "English" }, Certifications = new() { "BLS Certified" }, CreatedAt = jsUser5.CreatedAt, UpdatedAt = now };

    var jsProfileList = new List<JobSeeker> { jsProf1, jsProf2, jsProf3, jsProf4, jsProf5 };
    if (demoJobSeekerUser != null && !await db.JobSeekers.AnyAsync(j => j.UserId == demoJobSeekerUser.UserId))
        jsProfileList.Add(new() { JobSeekerId = Guid.NewGuid(), UserId = demoJobSeekerUser.UserId, EducationLevel = EducationLevel.Degree, Qualification = "BCom Business Administration", DesiredJobRole = "Administrative Officer", DesiredLocation = "Colombo, Sri Lanka", ExpectedSalary = 75000, IsAvailable = true, Languages = new() { "Sinhala", "English" }, Certifications = new() { "MS Office Certified" }, CreatedAt = now.AddDays(-30), UpdatedAt = now });

    db.JobSeekers.AddRange(jsProfileList);
    await db.SaveChangesAsync();

    // ── Worker profiles ───────────────────────────────────────────────────────
    var wkProf1 = new Worker { WorkerId = Guid.NewGuid(), UserId = wUser1.UserId, WorkerRegistrationNumber = "W-2021-00123", Nationality = "Sri Lankan", PassportNumber = "N1234567", DateOfBirth = new DateOnly(1985, 3, 15), Gender = Gender.Male, CurrentLocation = "Dubai, UAE", DesiredLocation = "Sri Lanka (Returning)", YearsOfExperience = 8, Skills = new() { "Concrete Work", "Steel Fixing", "Scaffolding", "Safety" }, VerificationStatus = VerificationStatus.Verified, VerifiedAt = now.AddDays(-40), VerifiedBy = adminId, EmergencyContactName = "Kamala Bandara", EmergencyContactPhone = "+94771234567", CreatedAt = wUser1.CreatedAt, UpdatedAt = now };
    var wkProf2 = new Worker { WorkerId = Guid.NewGuid(), UserId = wUser2.UserId, WorkerRegistrationNumber = "W-2020-00456", Nationality = "Sri Lankan", PassportNumber = "N7654321", DateOfBirth = new DateOnly(1990, 7, 22), Gender = Gender.Female, CurrentLocation = "Riyadh, Saudi Arabia", DesiredLocation = "Sri Lanka (Returning)", YearsOfExperience = 5, Skills = new() { "Cooking", "Cleaning", "Child Care", "Elderly Care" }, VerificationStatus = VerificationStatus.Verified, VerifiedAt = now.AddDays(-38), VerifiedBy = adminId, EmergencyContactName = "Saman Herath", EmergencyContactPhone = "+94772345678", CreatedAt = wUser2.CreatedAt, UpdatedAt = now };
    var wkProf3 = new Worker { WorkerId = Guid.NewGuid(), UserId = wUser3.UserId, WorkerRegistrationNumber = "W-2022-00789", Nationality = "Sri Lankan", PassportNumber = "N9876543", DateOfBirth = new DateOnly(1988, 11, 8), Gender = Gender.Male, CurrentLocation = "Kuala Lumpur, Malaysia", DesiredLocation = "Sri Lanka (Returning)", YearsOfExperience = 6, Skills = new() { "CNC Operation", "Quality Inspection", "Assembly", "Welding" }, VerificationStatus = VerificationStatus.Verified, VerifiedAt = now.AddDays(-35), VerifiedBy = adminId, EmergencyContactName = "Piyumi Wijesinghe", EmergencyContactPhone = "+94773456789", CreatedAt = wUser3.CreatedAt, UpdatedAt = now };
    var wkProf4 = new Worker { WorkerId = Guid.NewGuid(), UserId = wUser4.UserId, WorkerRegistrationNumber = "W-2021-01012", Nationality = "Sri Lankan", PassportNumber = "N2468135", DateOfBirth = new DateOnly(1982, 5, 30), Gender = Gender.Male, CurrentLocation = "Muscat, Oman", DesiredLocation = "Sri Lanka (Returning)", YearsOfExperience = 12, Skills = new() { "Security Patrol", "CCTV Monitoring", "First Aid", "Access Control" }, VerificationStatus = VerificationStatus.Verified, VerifiedAt = now.AddDays(-42), VerifiedBy = adminId, EmergencyContactName = "Anoma Senanayake", EmergencyContactPhone = "+94774567890", CreatedAt = wUser4.CreatedAt, UpdatedAt = now };
    var wkProf5 = new Worker { WorkerId = Guid.NewGuid(), UserId = wUser5.UserId, WorkerRegistrationNumber = "W-2023-00234", Nationality = "Sri Lankan", PassportNumber = "N1357924", DateOfBirth = new DateOnly(1992, 9, 14), Gender = Gender.Female, CurrentLocation = "Penang, Malaysia", DesiredLocation = "Sri Lanka (Returning)", YearsOfExperience = 4, Skills = new() { "Food Service", "Housekeeping", "Reception", "Customer Service" }, VerificationStatus = VerificationStatus.Verified, VerifiedAt = now.AddDays(-30), VerifiedBy = adminId, EmergencyContactName = "Dinesh Thambipillai", EmergencyContactPhone = "+94775678901", CreatedAt = wUser5.CreatedAt, UpdatedAt = now };

    var wkProfileList = new List<Worker> { wkProf1, wkProf2, wkProf3, wkProf4, wkProf5 };
    if (demoWorkerUser != null && !await db.Workers.AnyAsync(w => w.UserId == demoWorkerUser.UserId))
        wkProfileList.Add(new() { WorkerId = Guid.NewGuid(), UserId = demoWorkerUser.UserId, WorkerRegistrationNumber = "W-2024-00001", Nationality = "Sri Lankan", PassportNumber = "N0000001", DateOfBirth = new DateOnly(1990, 1, 1), Gender = Gender.Male, CurrentLocation = "Colombo, Sri Lanka", YearsOfExperience = 3, Skills = new() { "General Labour", "Driving" }, VerificationStatus = VerificationStatus.Pending, EmergencyContactName = "Demo Contact", EmergencyContactPhone = "+94700000001", CreatedAt = now.AddDays(-30), UpdatedAt = now });

    db.Workers.AddRange(wkProfileList);
    await db.SaveChangesAsync();

    // ── Job postings ──────────────────────────────────────────────────────────
    var job1Id = Guid.NewGuid(); var job2Id = Guid.NewGuid(); var job3Id = Guid.NewGuid();
    var job4Id = Guid.NewGuid(); var job5Id = Guid.NewGuid();
    var job6Id = Guid.NewGuid(); var job7Id = Guid.NewGuid(); var job8Id = Guid.NewGuid(); var job9Id = Guid.NewGuid();
    var job10Id = Guid.NewGuid(); var job11Id = Guid.NewGuid(); var job12Id = Guid.NewGuid();

    var jobList = new List<JobPosting>
    {
        // Gulf Tech Recruitment
        new() { JobId = job1Id, AgencyId = ag1Id, JobTitle = "Senior Software Engineer", JobDescription = "We are looking for an experienced Senior Software Engineer to join our client's tech team in Dubai. Design and build high-performance backend systems using .NET and cloud technologies.", JobCategory = "Information Technology", EmploymentType = EmploymentType.FullTime, Location = "Dubai, UAE", Country = "UAE", SalaryMin = 8000, SalaryMax = 12000, SalaryCurrency = "AED", Requirements = new() { "5+ years .NET/C#", "Cloud experience (Azure/AWS)", "Strong English" }, Benefits = new() { "Annual flight ticket", "Medical insurance", "Housing allowance", "30-day annual leave" }, RequiredExperience = 5, EducationRequired = "Degree", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(30)), Status = JobStatus.Published, ViewCount = 342, ApplyCount = 28, IsFeatured = true, PostedAt = now.AddDays(-20), CreatedAt = now.AddDays(-20), UpdatedAt = now },
        new() { JobId = job2Id, AgencyId = ag1Id, JobTitle = "IT Support Specialist", JobDescription = "Provide first and second-line IT support to a growing company in Dubai. Troubleshoot hardware/software issues, manage user accounts, and maintain network infrastructure.", JobCategory = "Information Technology", EmploymentType = EmploymentType.FullTime, Location = "Dubai, UAE", Country = "UAE", SalaryMin = 4500, SalaryMax = 6500, SalaryCurrency = "AED", Requirements = new() { "2+ years IT support", "CCNA or CompTIA A+", "Windows Server knowledge" }, Benefits = new() { "Medical insurance", "Annual flight ticket", "Transport allowance" }, RequiredExperience = 2, EducationRequired = "Diploma", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(25)), Status = JobStatus.Published, ViewCount = 215, ApplyCount = 19, PostedAt = now.AddDays(-15), CreatedAt = now.AddDays(-15), UpdatedAt = now },
        new() { JobId = job3Id, AgencyId = ag1Id, JobTitle = "Project Manager – Construction", JobDescription = "Oversee large-scale construction projects in Abu Dhabi. Coordinate with engineers, contractors, and clients to deliver projects on time and within budget.", JobCategory = "Engineering", EmploymentType = EmploymentType.FullTime, Location = "Abu Dhabi, UAE", Country = "UAE", SalaryMin = 10000, SalaryMax = 15000, SalaryCurrency = "AED", Requirements = new() { "PMP Certification", "8+ years construction PM" }, Benefits = new() { "Housing allowance", "Family visa", "Medical for family", "Annual flight x2" }, RequiredExperience = 8, EducationRequired = "Degree", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(45)), Status = JobStatus.Published, ViewCount = 178, ApplyCount = 12, PostedAt = now.AddDays(-10), CreatedAt = now.AddDays(-10), UpdatedAt = now },
        new() { JobId = job4Id, AgencyId = ag1Id, JobTitle = "Data Analyst", JobDescription = "Analyse large datasets to extract meaningful business insights. Work with BI tools and create dashboards for management.", JobCategory = "Information Technology", EmploymentType = EmploymentType.Contract, Location = "Dubai, UAE", Country = "UAE", SalaryMin = 6000, SalaryMax = 9000, SalaryCurrency = "AED", Requirements = new() { "Python/SQL skills", "Power BI or Tableau", "Statistics background" }, Benefits = new() { "Performance bonus", "Medical insurance" }, RequiredExperience = 3, EducationRequired = "Degree", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(20)), Status = JobStatus.Draft, ViewCount = 0, ApplyCount = 0, PostedAt = now.AddDays(-2), CreatedAt = now.AddDays(-2), UpdatedAt = now },
        new() { JobId = job5Id, AgencyId = ag1Id, JobTitle = "Network Engineer", JobDescription = "Design and implement enterprise network infrastructure for a leading telecom company in Qatar. CCNP/CCIE preferred.", JobCategory = "Information Technology", EmploymentType = EmploymentType.FullTime, Location = "Doha, Qatar", Country = "Qatar", SalaryMin = 7500, SalaryMax = 11000, SalaryCurrency = "QAR", Requirements = new() { "CCNP certified", "Cisco/Juniper experience", "5+ years networking" }, Benefits = new() { "Accommodation provided", "Medical insurance", "30 days annual leave" }, RequiredExperience = 5, EducationRequired = "Degree", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(-5)), Status = JobStatus.Closed, ViewCount = 523, ApplyCount = 41, PostedAt = now.AddDays(-60), CreatedAt = now.AddDays(-60), UpdatedAt = now.AddDays(-5) },
        // SL International Manpower
        new() { JobId = job6Id, AgencyId = ag2Id, JobTitle = "Machine Operator – Plastic Factory", JobDescription = "Operate plastic injection moulding machines in a modern factory in Riyadh. Full training provided. Safe and clean working environment.", JobCategory = "Manufacturing", EmploymentType = EmploymentType.FullTime, Location = "Riyadh, Saudi Arabia", Country = "Saudi Arabia", SalaryMin = 1800, SalaryMax = 2400, SalaryCurrency = "SAR", Requirements = new() { "Basic mechanical aptitude", "Physically fit", "Willing to work shifts" }, Benefits = new() { "Accommodation", "3 meals daily", "Medical insurance", "Annual flight" }, RequiredExperience = 0, EducationRequired = "Secondary", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(40)), Status = JobStatus.Published, ViewCount = 487, ApplyCount = 55, PostedAt = now.AddDays(-25), CreatedAt = now.AddDays(-25), UpdatedAt = now },
        new() { JobId = job7Id, AgencyId = ag2Id, JobTitle = "Quality Control Inspector", JobDescription = "Inspect finished products in a food processing plant in Jeddah. Ensure all products meet quality standards and regulatory requirements.", JobCategory = "Manufacturing", EmploymentType = EmploymentType.FullTime, Location = "Jeddah, Saudi Arabia", Country = "Saudi Arabia", SalaryMin = 2500, SalaryMax = 3500, SalaryCurrency = "SAR", Requirements = new() { "QC experience preferred", "Attention to detail", "Food safety knowledge" }, Benefits = new() { "Accommodation", "2 meals daily", "Medical", "Annual flight" }, RequiredExperience = 1, EducationRequired = "Diploma", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(30)), Status = JobStatus.Published, ViewCount = 298, ApplyCount = 33, PostedAt = now.AddDays(-18), CreatedAt = now.AddDays(-18), UpdatedAt = now },
        new() { JobId = job8Id, AgencyId = ag2Id, JobTitle = "Warehouse Supervisor", JobDescription = "Manage day-to-day warehouse operations in Dammam including stock management, team supervision, and logistics coordination.", JobCategory = "Logistics", EmploymentType = EmploymentType.FullTime, Location = "Dammam, Saudi Arabia", Country = "Saudi Arabia", SalaryMin = 3500, SalaryMax = 5000, SalaryCurrency = "SAR", Requirements = new() { "3+ years warehouse supervisory", "WMS software experience", "Driving licence" }, Benefits = new() { "Company vehicle", "Medical insurance", "Annual bonus" }, RequiredExperience = 3, EducationRequired = "Diploma", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(35)), Status = JobStatus.Published, ViewCount = 156, ApplyCount = 18, PostedAt = now.AddDays(-12), CreatedAt = now.AddDays(-12), UpdatedAt = now },
        new() { JobId = job9Id, AgencyId = ag2Id, JobTitle = "HVAC Technician", JobDescription = "Install, maintain, and repair air conditioning and refrigeration systems for a building services company in Kuwait.", JobCategory = "Engineering", EmploymentType = EmploymentType.FullTime, Location = "Kuwait City, Kuwait", Country = "Kuwait", SalaryMin = 3000, SalaryMax = 4500, SalaryCurrency = "KWD", Requirements = new() { "HVAC certification", "3+ years experience", "Refrigerant handling" }, Benefits = new() { "Accommodation", "Medical", "Annual flight" }, RequiredExperience = 3, EducationRequired = "Diploma", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(-10)), Status = JobStatus.Closed, ViewCount = 334, ApplyCount = 29, PostedAt = now.AddDays(-50), CreatedAt = now.AddDays(-50), UpdatedAt = now.AddDays(-10) },
        // ProStaff Lanka
        new() { JobId = job10Id, AgencyId = ag3Id, JobTitle = "Construction Worker – General", JobDescription = "General construction work for a large infrastructure project in Kuala Lumpur. Various roles including formwork, concreting, and finishing.", JobCategory = "Construction", EmploymentType = EmploymentType.FullTime, Location = "Kuala Lumpur, Malaysia", Country = "Malaysia", SalaryMin = 1500, SalaryMax = 2200, SalaryCurrency = "MYR", Requirements = new() { "Physically fit", "Construction experience preferred" }, Benefits = new() { "Accommodation", "Daily allowance", "Medical insurance" }, RequiredExperience = 0, EducationRequired = "Primary", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(50)), Status = JobStatus.Published, ViewCount = 621, ApplyCount = 72, PostedAt = now.AddDays(-30), CreatedAt = now.AddDays(-30), UpdatedAt = now },
        new() { JobId = job11Id, AgencyId = ag3Id, JobTitle = "Security Guard", JobDescription = "Provide security services at commercial premises in Selangor. Various shifts available. SSAIB licensing will be provided.", JobCategory = "Security", EmploymentType = EmploymentType.FullTime, Location = "Selangor, Malaysia", Country = "Malaysia", SalaryMin = 1400, SalaryMax = 1800, SalaryCurrency = "MYR", Requirements = new() { "Strong English", "Medical fitness clearance", "Clean record" }, Benefits = new() { "Uniform provided", "Medical", "Overtime pay" }, RequiredExperience = 0, EducationRequired = "Secondary", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(40)), Status = JobStatus.Published, ViewCount = 412, ApplyCount = 48, PostedAt = now.AddDays(-22), CreatedAt = now.AddDays(-22), UpdatedAt = now },
        new() { JobId = job12Id, AgencyId = ag3Id, JobTitle = "Hotel Housekeeping Staff", JobDescription = "Join a 5-star hotel team in Penang as housekeeping staff. Comprehensive training provided. Excellent growth opportunities.", JobCategory = "Hospitality", EmploymentType = EmploymentType.FullTime, Location = "Penang, Malaysia", Country = "Malaysia", SalaryMin = 1600, SalaryMax = 2000, SalaryCurrency = "MYR", Requirements = new() { "Good hygiene habits", "Detail oriented", "Service attitude" }, Benefits = new() { "Meals during shift", "Accommodation", "Medical", "Annual bonus" }, RequiredExperience = 0, EducationRequired = "Secondary", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(28)), Status = JobStatus.Draft, ViewCount = 0, ApplyCount = 0, PostedAt = now.AddDays(-1), CreatedAt = now.AddDays(-1), UpdatedAt = now },
    };

    // Demo agency jobs (only if demo agency profile exists)
    var job13Id = Guid.Empty; var job14Id = Guid.Empty;
    if (demoAgId != Guid.Empty)
    {
        job13Id = Guid.NewGuid(); job14Id = Guid.NewGuid();
        jobList.AddRange(new[]
        {
            new JobPosting { JobId = job13Id, AgencyId = demoAgId, JobTitle = "Administrative Assistant", JobDescription = "Support the management team with daily admin tasks, scheduling, correspondence, and document management.", JobCategory = "Administration", EmploymentType = EmploymentType.FullTime, Location = "Colombo, Sri Lanka", Country = "Sri Lanka", SalaryMin = 60000, SalaryMax = 85000, SalaryCurrency = "LKR", Requirements = new() { "MS Office proficiency", "Fluent English", "2+ years admin experience" }, Benefits = new() { "EPF/ETF", "Medical insurance", "Annual bonus" }, RequiredExperience = 2, EducationRequired = "Diploma", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(20)), Status = JobStatus.Published, ViewCount = 89, ApplyCount = 11, PostedAt = now.AddDays(-8), CreatedAt = now.AddDays(-8), UpdatedAt = now },
            new JobPosting { JobId = job14Id, AgencyId = demoAgId, JobTitle = "Customer Service Representative", JobDescription = "Handle inbound customer inquiries via phone and email. Resolve issues efficiently and maintain high satisfaction scores.", JobCategory = "Customer Service", EmploymentType = EmploymentType.PartTime, Location = "Colombo, Sri Lanka", Country = "Sri Lanka", SalaryMin = 40000, SalaryMax = 55000, SalaryCurrency = "LKR", Requirements = new() { "Excellent communication", "Patient and empathetic" }, Benefits = new() { "Flexible hours", "EPF/ETF" }, RequiredExperience = 1, EducationRequired = "Secondary", ApplicationDeadline = DateOnly.FromDateTime(now.AddDays(15)), Status = JobStatus.Published, ViewCount = 64, ApplyCount = 7, PostedAt = now.AddDays(-5), CreatedAt = now.AddDays(-5), UpdatedAt = now },
        });
    }

    db.JobPostings.AddRange(jobList);
    await db.SaveChangesAsync();

    // ── Applications ──────────────────────────────────────────────────────────
    var appList = new List<JobApplication>
    {
        new() { ApplicationId = Guid.NewGuid(), JobId = job1Id, JobSeekerId = jsProf1.JobSeekerId, Status = ApplicationStatus.Shortlisted, CoverLetter = "I have 6 years of .NET experience and am eager to contribute to your team in Dubai.", ResumeUrl = "/uploads/mock/maleesha_cv.pdf", AppliedAt = now.AddDays(-18), ReviewedAt = now.AddDays(-15), CreatedAt = now.AddDays(-18), UpdatedAt = now.AddDays(-15) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job1Id, JobSeekerId = jsProf4.JobSeekerId, Status = ApplicationStatus.Pending, CoverLetter = "I am a civil/IT hybrid professional looking to transition into software engineering.", ResumeUrl = "/uploads/mock/dilshan_cv.pdf", AppliedAt = now.AddDays(-14), CreatedAt = now.AddDays(-14), UpdatedAt = now.AddDays(-14) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job2Id, JobSeekerId = jsProf1.JobSeekerId, Status = ApplicationStatus.Accepted, CoverLetter = "I have strong IT support skills and have worked in enterprise environments.", ResumeUrl = "/uploads/mock/maleesha_cv.pdf", AppliedAt = now.AddDays(-13), ReviewedAt = now.AddDays(-10), CreatedAt = now.AddDays(-13), UpdatedAt = now.AddDays(-10) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job2Id, JobSeekerId = jsProf2.JobSeekerId, Status = ApplicationStatus.Rejected, CoverLetter = "I have done IT support alongside my accounting work.", ResumeUrl = "/uploads/mock/kasun_cv.pdf", AppliedAt = now.AddDays(-12), ReviewedAt = now.AddDays(-9), RejectionReason = "No dedicated IT support experience", CreatedAt = now.AddDays(-12), UpdatedAt = now.AddDays(-9) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job3Id, JobSeekerId = jsProf4.JobSeekerId, Status = ApplicationStatus.UnderReview, CoverLetter = "I am a civil engineer with 8 years of project management experience.", ResumeUrl = "/uploads/mock/dilshan_cv.pdf", AppliedAt = now.AddDays(-8), CreatedAt = now.AddDays(-8), UpdatedAt = now.AddDays(-8) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job6Id, JobSeekerId = jsProf2.JobSeekerId, Status = ApplicationStatus.Pending, CoverLetter = "I am looking for manufacturing work in Saudi Arabia to support my family.", ResumeUrl = "/uploads/mock/kasun_cv.pdf", AppliedAt = now.AddDays(-20), CreatedAt = now.AddDays(-20), UpdatedAt = now.AddDays(-20) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job6Id, JobSeekerId = jsProf4.JobSeekerId, Status = ApplicationStatus.Shortlisted, CoverLetter = "I have experience operating heavy machinery.", ResumeUrl = "/uploads/mock/dilshan_cv.pdf", AppliedAt = now.AddDays(-19), ReviewedAt = now.AddDays(-16), CreatedAt = now.AddDays(-19), UpdatedAt = now.AddDays(-16) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job7Id, JobSeekerId = jsProf3.JobSeekerId, Status = ApplicationStatus.Pending, CoverLetter = "My marketing background includes quality assessments and process documentation.", ResumeUrl = "/uploads/mock/sachini_cv.pdf", AppliedAt = now.AddDays(-16), CreatedAt = now.AddDays(-16), UpdatedAt = now.AddDays(-16) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job8Id, JobSeekerId = jsProf2.JobSeekerId, Status = ApplicationStatus.UnderReview, CoverLetter = "I have logistics coordination experience from my previous role.", ResumeUrl = "/uploads/mock/kasun_cv.pdf", AppliedAt = now.AddDays(-10), ReviewedAt = now.AddDays(-7), CreatedAt = now.AddDays(-10), UpdatedAt = now.AddDays(-7) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job10Id, JobSeekerId = jsProf4.JobSeekerId, Status = ApplicationStatus.Accepted, CoverLetter = "I have construction experience and would like to work in Malaysia.", ResumeUrl = "/uploads/mock/dilshan_cv.pdf", AppliedAt = now.AddDays(-28), ReviewedAt = now.AddDays(-25), CreatedAt = now.AddDays(-28), UpdatedAt = now.AddDays(-25) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job10Id, JobSeekerId = jsProf2.JobSeekerId, Status = ApplicationStatus.Pending, CoverLetter = "I am hardworking and ready to relocate.", ResumeUrl = "/uploads/mock/kasun_cv.pdf", AppliedAt = now.AddDays(-27), CreatedAt = now.AddDays(-27), UpdatedAt = now.AddDays(-27) },
        new() { ApplicationId = Guid.NewGuid(), JobId = job11Id, JobSeekerId = jsProf5.JobSeekerId, Status = ApplicationStatus.UnderReview, CoverLetter = "I am interested in the security position in Selangor.", ResumeUrl = "/uploads/mock/nishani_cv.pdf", AppliedAt = now.AddDays(-18), ReviewedAt = now.AddDays(-15), CreatedAt = now.AddDays(-18), UpdatedAt = now.AddDays(-15) },
    };

    if (job13Id != Guid.Empty)
    {
        appList.AddRange(new[]
        {
            new JobApplication { ApplicationId = Guid.NewGuid(), JobId = job13Id, JobSeekerId = jsProf3.JobSeekerId, Status = ApplicationStatus.Pending, CoverLetter = "I have excellent administrative skills and would be an asset to your team.", ResumeUrl = "/uploads/mock/sachini_cv.pdf", AppliedAt = now.AddDays(-6), CreatedAt = now.AddDays(-6), UpdatedAt = now.AddDays(-6) },
            new JobApplication { ApplicationId = Guid.NewGuid(), JobId = job13Id, JobSeekerId = jsProf2.JobSeekerId, Status = ApplicationStatus.UnderReview, CoverLetter = "My accounting background gives strong administrative foundations.", ResumeUrl = "/uploads/mock/kasun_cv.pdf", AppliedAt = now.AddDays(-5), ReviewedAt = now.AddDays(-3), CreatedAt = now.AddDays(-5), UpdatedAt = now.AddDays(-3) },
            new JobApplication { ApplicationId = Guid.NewGuid(), JobId = job14Id, JobSeekerId = jsProf3.JobSeekerId, Status = ApplicationStatus.Shortlisted, CoverLetter = "I am passionate about customer service and have strong communication skills.", ResumeUrl = "/uploads/mock/sachini_cv.pdf", AppliedAt = now.AddDays(-4), ReviewedAt = now.AddDays(-2), CreatedAt = now.AddDays(-4), UpdatedAt = now.AddDays(-2) },
        });
    }

    // Applications for the demo job seeker
    var demoJsProfile = jsProfileList.FirstOrDefault(j => demoJobSeekerUser != null && j.UserId == demoJobSeekerUser.UserId);
    if (demoJsProfile == null && demoJobSeekerUser != null)
        demoJsProfile = await db.JobSeekers.FirstOrDefaultAsync(j => j.UserId == demoJobSeekerUser.UserId);
    if (demoJsProfile != null)
    {
        appList.AddRange(new[]
        {
            new JobApplication { ApplicationId = Guid.NewGuid(), JobId = job1Id, JobSeekerId = demoJsProfile.JobSeekerId, Status = ApplicationStatus.Pending, CoverLetter = "I am the demo job seeker applying to this position.", AppliedAt = now.AddDays(-5), CreatedAt = now.AddDays(-5), UpdatedAt = now.AddDays(-5) },
            new JobApplication { ApplicationId = Guid.NewGuid(), JobId = job6Id, JobSeekerId = demoJsProfile.JobSeekerId, Status = ApplicationStatus.UnderReview, CoverLetter = "Demo application for machine operator role.", AppliedAt = now.AddDays(-10), ReviewedAt = now.AddDays(-8), CreatedAt = now.AddDays(-10), UpdatedAt = now.AddDays(-8) },
            new JobApplication { ApplicationId = Guid.NewGuid(), JobId = job11Id, JobSeekerId = demoJsProfile.JobSeekerId, Status = ApplicationStatus.Rejected, CoverLetter = "Demo application for security guard.", AppliedAt = now.AddDays(-15), ReviewedAt = now.AddDays(-12), RejectionReason = "Insufficient experience", CreatedAt = now.AddDays(-15), UpdatedAt = now.AddDays(-12) },
        });
    }

    db.JobApplications.AddRange(appList);
    await db.SaveChangesAsync();

    // ── Saved jobs ────────────────────────────────────────────────────────────
    var savedList = new List<SavedJob>
    {
        new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf1.JobSeekerId, JobId = job3Id, CreatedAt = now.AddDays(-8) },
        new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf1.JobSeekerId, JobId = job5Id, CreatedAt = now.AddDays(-7) },
        new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf2.JobSeekerId, JobId = job6Id, CreatedAt = now.AddDays(-24) },
        new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf2.JobSeekerId, JobId = job8Id, CreatedAt = now.AddDays(-15) },
        new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf3.JobSeekerId, JobId = job7Id, CreatedAt = now.AddDays(-16) },
        new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf4.JobSeekerId, JobId = job10Id, CreatedAt = now.AddDays(-29) },
        new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf5.JobSeekerId, JobId = job11Id, CreatedAt = now.AddDays(-20) },
        new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf5.JobSeekerId, JobId = job12Id, CreatedAt = now.AddDays(-1) },
    };
    if (job13Id != Guid.Empty)
        savedList.Add(new() { SavedJobId = Guid.NewGuid(), JobSeekerId = jsProf3.JobSeekerId, JobId = job13Id, CreatedAt = now.AddDays(-5) });
    if (demoJsProfile != null)
    {
        savedList.Add(new SavedJob { SavedJobId = Guid.NewGuid(), JobSeekerId = demoJsProfile.JobSeekerId, JobId = job1Id, CreatedAt = now.AddDays(-3) });
        savedList.Add(new SavedJob { SavedJobId = Guid.NewGuid(), JobSeekerId = demoJsProfile.JobSeekerId, JobId = job2Id, CreatedAt = now.AddDays(-2) });
    }
    db.SavedJobs.AddRange(savedList);
    await db.SaveChangesAsync();

    // ── Worker complaints ─────────────────────────────────────────────────────
    var complaintList = new List<WorkerComplaint>
    {
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf1.WorkerId, ComplaintType = ComplaintType.SalaryDispute, Title = "Salary delayed for 3 months", Description = "My employer has not paid my salary for the past 3 months despite repeated requests. I am owed approximately AED 12,000. I have copies of my contract and bank statements.", Status = ComplaintStatus.UnderReview, Priority = Priority.Critical, SubmittedAt = now.AddDays(-30), ReviewedAt = now.AddDays(-25), AssignedToAdminId = adminId, CreatedAt = now.AddDays(-30), UpdatedAt = now.AddDays(-25) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf1.WorkerId, ComplaintType = ComplaintType.UnsafeConditions, Title = "No safety equipment on construction site", Description = "The construction site does not provide helmets, safety harnesses, or protective footwear. Two workers have already been injured this month. I have photos as evidence.", Status = ComplaintStatus.InProgress, Priority = Priority.High, SubmittedAt = now.AddDays(-15), ReviewedAt = now.AddDays(-12), AssignedToAdminId = adminId, CreatedAt = now.AddDays(-15), UpdatedAt = now.AddDays(-12) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf2.WorkerId, ComplaintType = ComplaintType.Harassment, Title = "Verbal harassment by employer", Description = "The employer frequently uses abusive language and threatens deportation if I do not comply with extra unpaid duties. I work from 5am to midnight with no rest day.", Status = ComplaintStatus.Resolved, Priority = Priority.Critical, SubmittedAt = now.AddDays(-45), ReviewedAt = now.AddDays(-40), ResolvedAt = now.AddDays(-20), ResolutionNotes = "Worker transferred to new employer via SLBFE. New employment contract signed. Case closed.", AssignedToAdminId = adminId, CreatedAt = now.AddDays(-45), UpdatedAt = now.AddDays(-20) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf2.WorkerId, ComplaintType = ComplaintType.LivingFacilities, Title = "Inadequate living conditions", Description = "I share a room with 8 people. No proper ventilation, cockroach infestation, and unreliable water supply causing health issues.", Status = ComplaintStatus.Submitted, Priority = Priority.Medium, SubmittedAt = now.AddDays(-5), CreatedAt = now.AddDays(-5), UpdatedAt = now.AddDays(-5) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf3.WorkerId, ComplaintType = ComplaintType.SalaryDispute, Title = "Overtime hours not compensated", Description = "I work 12-14 hour shifts regularly but only paid for 8 hours. Approximately 80 hours overtime monthly not compensated as per Malaysian Employment Act.", Status = ComplaintStatus.UnderReview, Priority = Priority.High, SubmittedAt = now.AddDays(-22), ReviewedAt = now.AddDays(-18), AssignedToAdminId = adminId, CreatedAt = now.AddDays(-22), UpdatedAt = now.AddDays(-18) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf3.WorkerId, ComplaintType = ComplaintType.HealthConcern, Title = "Exposed to chemical fumes without protection", Description = "We handle chemical solvents daily without proper masks or ventilation. Several colleagues have reported respiratory issues. The factory has no safety officer.", Status = ComplaintStatus.InProgress, Priority = Priority.Critical, SubmittedAt = now.AddDays(-10), ReviewedAt = now.AddDays(-8), AssignedToAdminId = adminId, CreatedAt = now.AddDays(-10), UpdatedAt = now.AddDays(-8) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf4.WorkerId, ComplaintType = ComplaintType.Other, Title = "Contract terms changed without notice", Description = "My employer unilaterally changed my work location to a remote desert site without additional compensation and without amending my contract.", Status = ComplaintStatus.Submitted, Priority = Priority.Medium, SubmittedAt = now.AddDays(-8), CreatedAt = now.AddDays(-8), UpdatedAt = now.AddDays(-8) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf4.WorkerId, ComplaintType = ComplaintType.SalaryDispute, Title = "Illegal deductions from salary for accommodation", Description = "Employer deducting MYR 300/month for accommodation stated as free in my contract. Over 8 months that is MYR 2,400 deducted illegally.", Status = ComplaintStatus.Resolved, Priority = Priority.Medium, SubmittedAt = now.AddDays(-60), ReviewedAt = now.AddDays(-55), ResolvedAt = now.AddDays(-40), ResolutionNotes = "Employer agreed to reimburse all deducted amounts. Payment plan established and confirmed.", AssignedToAdminId = adminId, CreatedAt = now.AddDays(-60), UpdatedAt = now.AddDays(-40) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf5.WorkerId, ComplaintType = ComplaintType.Harassment, Title = "Workplace bullying by supervisor", Description = "My supervisor constantly belittles my work in front of colleagues and makes discriminatory comments about Sri Lankan workers.", Status = ComplaintStatus.UnderReview, Priority = Priority.High, SubmittedAt = now.AddDays(-18), ReviewedAt = now.AddDays(-14), AssignedToAdminId = adminId, CreatedAt = now.AddDays(-18), UpdatedAt = now.AddDays(-14) },
        new() { ComplaintId = Guid.NewGuid(), WorkerId = wkProf5.WorkerId, ComplaintType = ComplaintType.LivingFacilities, Title = "Passport confiscated by employer", Description = "Upon arrival the employer took my passport for safekeeping. It has been 3 months and I cannot retrieve it. This is illegal under Malaysian law.", Status = ComplaintStatus.InProgress, Priority = Priority.Critical, SubmittedAt = now.AddDays(-12), ReviewedAt = now.AddDays(-10), AssignedToAdminId = adminId, CreatedAt = now.AddDays(-12), UpdatedAt = now.AddDays(-10) },
    };

    var demoWkProfile = wkProfileList.FirstOrDefault(w => demoWorkerUser != null && w.UserId == demoWorkerUser.UserId);
    if (demoWkProfile == null && demoWorkerUser != null)
        demoWkProfile = await db.Workers.FirstOrDefaultAsync(w => w.UserId == demoWorkerUser.UserId);
    if (demoWkProfile != null)
    {
        complaintList.AddRange(new[]
        {
            new WorkerComplaint { ComplaintId = Guid.NewGuid(), WorkerId = demoWkProfile.WorkerId, ComplaintType = ComplaintType.SalaryDispute, Title = "Unpaid wages – demo account", Description = "This is a demo complaint about unpaid wages for the demo worker account.", Status = ComplaintStatus.Submitted, Priority = Priority.Medium, SubmittedAt = now.AddDays(-7), CreatedAt = now.AddDays(-7), UpdatedAt = now.AddDays(-7) },
            new WorkerComplaint { ComplaintId = Guid.NewGuid(), WorkerId = demoWkProfile.WorkerId, ComplaintType = ComplaintType.UnsafeConditions, Title = "Unsafe working conditions – demo account", Description = "Demo complaint about unsafe working conditions on site.", Status = ComplaintStatus.UnderReview, Priority = Priority.High, SubmittedAt = now.AddDays(-14), ReviewedAt = now.AddDays(-11), AssignedToAdminId = adminId, CreatedAt = now.AddDays(-14), UpdatedAt = now.AddDays(-11) },
        });
    }
    db.WorkerComplaints.AddRange(complaintList);
    await db.SaveChangesAsync();

    // ── News articles ─────────────────────────────────────────────────────────
    db.News.AddRange(
        new News { NewsId = Guid.NewGuid(), CreatedByAdminId = adminId, Title = "New SLBFE Regulations for Overseas Workers Effective June 2026", Content = "The Sri Lanka Bureau of Foreign Employment (SLBFE) has announced important updates to regulations governing Sri Lankan workers abroad. Key changes include mandatory pre-departure orientation for all workers, enhanced welfare fund contributions, and stricter agency compliance requirements. All registered recruitment agencies must update their documentation by 1st June 2026.", Category = NewsCategory.Regulation, Priority = Priority.High, IsPublished = true, PublishedAt = now.AddDays(-5), ViewCount = 1243, CreatedAt = now.AddDays(-5), UpdatedAt = now.AddDays(-5) },
        new News { NewsId = Guid.NewGuid(), CreatedByAdminId = adminId, Title = "Emergency Helpline Expansion: 24/7 Support Now Available", Content = "LabourLink is pleased to announce the expansion of our worker support helpline to 24-hour, 7-day-a-week operation. Workers in any country can reach our multilingual support team at +94742330023 or email support@labourlink.gov.lk. The new service includes legal guidance, emergency assistance coordination, and embassy referrals.", Category = NewsCategory.Alert, Priority = Priority.Critical, IsPublished = true, PublishedAt = now.AddDays(-10), ViewCount = 876, CreatedAt = now.AddDays(-10), UpdatedAt = now.AddDays(-10) },
        new News { NewsId = Guid.NewGuid(), CreatedByAdminId = adminId, Title = "250 New IT Positions Available in UAE — Applications Open", Content = "A major recruitment drive has opened 250 positions in the UAE's growing technology sector. Roles include software developers, system administrators, network engineers, and data analysts. Positions are with verified partner companies and offer competitive packages including accommodation, health insurance, and annual flight tickets. Applications close 30th June 2026.", Category = NewsCategory.Opportunity, Priority = Priority.Medium, IsPublished = true, PublishedAt = now.AddDays(-3), ViewCount = 2156, CreatedAt = now.AddDays(-3), UpdatedAt = now.AddDays(-3) },
        new News { NewsId = Guid.NewGuid(), CreatedByAdminId = adminId, Title = "Platform Maintenance Notice: 2nd June 2026", Content = "The LabourLink platform will undergo scheduled maintenance on 2nd June 2026 from 2:00 AM to 6:00 AM (Sri Lanka Time). During this window, the portal and API will be unavailable. All pending applications and complaints submitted before 1st June will be processed after maintenance.", Category = NewsCategory.Update, Priority = Priority.Low, IsPublished = true, PublishedAt = now.AddDays(-1), ViewCount = 432, CreatedAt = now.AddDays(-1), UpdatedAt = now.AddDays(-1) },
        new News { NewsId = Guid.NewGuid(), CreatedByAdminId = adminId, Title = "Know Your Rights: Guide for Sri Lankan Workers in Malaysia", Content = "This guide covers essential legal rights under the Malaysian Employment Act 1955. Topics: minimum wage (RM1,500/month), overtime (1.5x rate), rest days (1 per week), annual leave (8-16 days), sick leave, and termination procedures. Workers whose passports have been confiscated should contact the Sri Lankan High Commission in KL at +60 3-2148 8007.", Category = NewsCategory.Alert, Priority = Priority.High, IsPublished = true, PublishedAt = now.AddDays(-7), ViewCount = 1087, CreatedAt = now.AddDays(-7), UpdatedAt = now.AddDays(-7) }
    );
    await db.SaveChangesAsync();
}

public partial class Program { }