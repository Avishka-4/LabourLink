using LabourLinkAPI.Data.Configurations;
using LabourLinkAPI.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace LabourLinkAPI.Data;

public class LabourLinkDbContext : DbContext
{
    public LabourLinkDbContext(DbContextOptions<LabourLinkDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Worker> Workers => Set<Worker>();
    public DbSet<JobSeeker> JobSeekers => Set<JobSeeker>();
    public DbSet<RecruitmentAgency> RecruitmentAgencies => Set<RecruitmentAgency>();
    public DbSet<JobPosting> JobPostings => Set<JobPosting>();
    public DbSet<JobApplication> JobApplications => Set<JobApplication>();
    public DbSet<WorkerComplaint> WorkerComplaints => Set<WorkerComplaint>();
    public DbSet<News> News => Set<News>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<PasswordResetToken> PasswordResetTokens => Set<PasswordResetToken>();
    public DbSet<SavedJob> SavedJobs => Set<SavedJob>();
    public DbSet<LookupValue> LookupValues => Set<LookupValue>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(LabourLinkDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyAuditTimestamps();
        return await base.SaveChangesAsync(cancellationToken);
    }

    private void ApplyAuditTimestamps()
    {
        var entries = ChangeTracker.Entries();
        var utcNow = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State is EntityState.Added or EntityState.Modified)
            {
                var updatedAtProperty = entry.Metadata.FindProperty("UpdatedAt");
                if (updatedAtProperty != null)
                {
                    entry.CurrentValues["UpdatedAt"] = utcNow;
                }

                if (entry.State == EntityState.Added)
                {
                    var createdAtProperty = entry.Metadata.FindProperty("CreatedAt");
                    if (createdAtProperty != null && entry.CurrentValues["CreatedAt"] is DateTime createdAt && createdAt == default)
                    {
                        entry.CurrentValues["CreatedAt"] = utcNow;
                    }
                }
            }
        }
    }
}
