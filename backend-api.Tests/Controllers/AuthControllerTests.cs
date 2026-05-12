using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using LabourLinkAPI.Contracts.Auth;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Entities;
using LabourLinkAPI.Models.Enums;
using LabourLinkAPI.Services.Auth;
using LabourLinkAPI.Tests.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace LabourLinkAPI.Tests.Controllers;

public class AuthControllerTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly CustomWebApplicationFactory _factory;

    public AuthControllerTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Login_returns_ok_for_valid_credentials()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<LabourLinkDbContext>();
        var passwordHashService = new PasswordHashService();

        var user = new User
        {
            UserId = Guid.NewGuid(),
            Email = "login@test.com",
            PasswordHash = passwordHashService.Hash("Password123"),
            FirstName = "Test",
            LastName = "User",
            Role = UserRole.Worker,
            Status = UserStatus.Active,
        };

        db.Users.Add(user);
        await db.SaveChangesAsync();

        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/login", new LoginRequest
        {
            Email = "login@test.com",
            Password = "Password123",
        });

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var payload = await response.Content.ReadFromJsonAsync<LoginResponse>();
        payload.Should().NotBeNull();
        payload!.Token.Should().NotBeNullOrWhiteSpace();
    }

    [Fact]
    public async Task Register_creates_user()
    {
        var client = _factory.CreateClient();
        var response = await client.PostAsJsonAsync("/api/auth/register", new RegisterRequest
        {
            Email = "register@test.com",
            Password = "Password123",
            ConfirmPassword = "Password123",
            FullName = "Test User",
            Role = UserRole.JobSeeker,
        });

        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }
}
