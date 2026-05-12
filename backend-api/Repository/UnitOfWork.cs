using Microsoft.EntityFrameworkCore.Storage;
using LabourLinkAPI.Data;
using LabourLinkAPI.Models.Entities;

namespace LabourLinkAPI.Repository;

public class UnitOfWork : IUnitOfWork
{
    private readonly LabourLinkDbContext _context;
    private IDbContextTransaction? _transaction;

    private IRepository<User>? _users;
    private IRepository<Worker>? _workers;
    private IRepository<JobSeeker>? _jobSeekers;
    private IRepository<RecruitmentAgency>? _recruitmentAgencies;
    private IRepository<JobPosting>? _jobPostings;
    private IRepository<JobApplication>? _jobApplications;
    private IRepository<WorkerComplaint>? _workerComplaints;
    private IRepository<RefreshToken>? _refreshTokens;
    private IRepository<PasswordResetToken>? _passwordResetTokens;
    private IRepository<News>? _news;
    private IRepository<AuditLog>? _auditLogs;
    private IRepository<LookupValue>? _lookupValues;

    public UnitOfWork(LabourLinkDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));
    }

    public IRepository<User> Users => _users ??= new Repository<User>(_context);
    public IRepository<Worker> Workers => _workers ??= new Repository<Worker>(_context);
    public IRepository<JobSeeker> JobSeekers => _jobSeekers ??= new Repository<JobSeeker>(_context);
    public IRepository<RecruitmentAgency> RecruitmentAgencies => _recruitmentAgencies ??= new Repository<RecruitmentAgency>(_context);
    public IRepository<JobPosting> JobPostings => _jobPostings ??= new Repository<JobPosting>(_context);
    public IRepository<JobApplication> JobApplications => _jobApplications ??= new Repository<JobApplication>(_context);
    public IRepository<WorkerComplaint> WorkerComplaints => _workerComplaints ??= new Repository<WorkerComplaint>(_context);
    public IRepository<RefreshToken> RefreshTokens => _refreshTokens ??= new Repository<RefreshToken>(_context);
    public IRepository<PasswordResetToken> PasswordResetTokens => _passwordResetTokens ??= new Repository<PasswordResetToken>(_context);
    public IRepository<News> News => _news ??= new Repository<News>(_context);
    public IRepository<AuditLog> AuditLogs => _auditLogs ??= new Repository<AuditLog>(_context);
    public IRepository<LookupValue> LookupValues => _lookupValues ??= new Repository<LookupValue>(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        => await _context.SaveChangesAsync(cancellationToken);

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
        => _transaction = await _context.Database.BeginTransactionAsync(cancellationToken);

    public async Task CommitAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await SaveChangesAsync(cancellationToken);
            await _transaction?.CommitAsync(cancellationToken)!;
        }
        catch
        {
            await RollbackAsync(cancellationToken);
            throw;
        }
        finally
        {
            if (_transaction != null)
                await _transaction.DisposeAsync();
        }
    }

    public async Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            await _transaction?.RollbackAsync(cancellationToken)!;
        }
        finally
        {
            if (_transaction != null)
                await _transaction.DisposeAsync();
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_transaction != null)
            await _transaction.DisposeAsync();
        await _context.DisposeAsync();
    }
}
