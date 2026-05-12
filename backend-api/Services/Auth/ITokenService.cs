using LabourLinkAPI.Models.Entities;

namespace LabourLinkAPI.Services.Auth;

public interface ITokenService
{
    (string Token, int ExpiresInSeconds) CreateAccessToken(User user);
    string CreateRefreshToken();
}
