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
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            services.RemoveAll(typeof(DbContextOptions<LabourLinkDbContext>));
            services.AddDbContext<LabourLinkDbContext>(options =>
                options.UseInMemoryDatabase($"labourlink-test-{Guid.NewGuid()}"));

            services.PostConfigure<JwtOptions>(options =>
            {
                options.Issuer = "LabourLink";
                options.Audience = "LabourLink";
                options.Key = "TestKey_ChangeMe_AtLeast32Characters";
                options.ExpiryMinutes = 60;
            });
        });
    }
}
