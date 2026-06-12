using System;
using LabourLinkAPI.Data;
using LabourLinkAPI.Services.Auth;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;

namespace LabourLinkAPI.Tests.Infrastructure;

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = $"labourlink-test-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<LabourLinkDbContext>));
            services.AddDbContext<LabourLinkDbContext>(options =>
                options.UseInMemoryDatabase(_dbName));

            services.RemoveAll(typeof(IOptions<JwtOptions>));
            services.AddSingleton(Options.Create(new JwtOptions
            {
                Issuer = "LabourLink",
                Audience = "LabourLink",
                Key = "TestKey_ChangeMe_AtLeast32Characters",
                ExpiryMinutes = 60,
            }));
        });
    }
}
