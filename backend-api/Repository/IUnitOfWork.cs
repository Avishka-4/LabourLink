using LabourLinkAPI.Models.Entities;

namespace LabourLinkAPI.Repository;

public interface IUnitOfWork : IAsyncDisposable
{
    IRepository<User> Users { get; }
    IRepository<Worker> Workers { get; }
    IRepository<JobSeeker> JobSeekers { get; }
    IRepository<RecruitmentAgency> RecruitmentAgencies { get; }
    IRepository<JobPosting> JobPostings { get; }
    IRepository<JobApplication> JobApplications { get; }
    IRepository<WorkerComplaint> WorkerComplaints { get; }
    IRepository<RefreshToken> RefreshTokens { get; }
    IRepository<PasswordResetToken> PasswordResetTokens { get; }
    IRepository<News> News { get; }
    IRepository<AuditLog> AuditLogs { get; }
    IRepository<LookupValue> LookupValues { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);
    Task CommitAsync(CancellationToken cancellationToken = default);
    Task RollbackAsync(CancellationToken cancellationToken = default);
}
