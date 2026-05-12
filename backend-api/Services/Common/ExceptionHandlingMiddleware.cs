using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace LabourLinkAPI.Services.Common;

public sealed class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");

            var (statusCode, title, message) = ex switch
            {
                ApiException apiEx => ((int)apiEx.StatusCode, apiEx.StatusCode.ToString(), apiEx.Message),
                UnauthorizedAccessException => ((int)HttpStatusCode.Unauthorized, "Unauthorized", ex.Message),
                InvalidOperationException => ((int)HttpStatusCode.BadRequest, "Bad Request", ex.Message),
                _ => ((int)HttpStatusCode.InternalServerError, "Internal Server Error", "An unexpected error occurred"),
            };

            context.Response.StatusCode = statusCode;
            context.Response.ContentType = "application/json";

            var problem = new ProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = message,
                Instance = context.Request.Path,
            };

            problem.Extensions["traceId"] = context.TraceIdentifier;

            var body = JsonSerializer.Serialize(problem, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            });

            await context.Response.WriteAsync(body);
        }
    }
}
