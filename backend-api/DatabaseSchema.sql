CREATE TABLE IF NOT EXISTS `__EFMigrationsHistory` (
    `MigrationId` varchar(150) NOT NULL,
    `ProductVersion` varchar(32) NOT NULL,
    PRIMARY KEY (`MigrationId`)
);

START TRANSACTION;

CREATE TABLE `users` (
    `UserId` char(36) NOT NULL,
    `Email` varchar(255) NOT NULL,
    `PasswordHash` varchar(500) NOT NULL,
    `PhoneNumber` varchar(20) NULL,
    `FirstName` varchar(100) NOT NULL,
    `LastName` varchar(100) NOT NULL,
    `Role` int NOT NULL,
    `IsEmailVerified` tinyint(1) NOT NULL DEFAULT FALSE,
    `IsPhoneVerified` tinyint(1) NOT NULL DEFAULT FALSE,
    `Status` int NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `LastLoginAt` datetime(6) NULL,
    `ProfileImageUrl` varchar(500) NULL,
    PRIMARY KEY (`UserId`)
);

CREATE TABLE `audit_logs` (
    `LogId` bigint NOT NULL AUTO_INCREMENT,
    `UserId` char(36) NOT NULL,
    `Action` varchar(255) NOT NULL,
    `EntityType` varchar(100) NULL,
    `EntityId` varchar(100) NULL,
    `OldValues` json NULL,
    `NewValues` json NULL,
    `IpAddress` varchar(50) NULL,
    `UserAgent` varchar(500) NULL,
    `CreatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`LogId`),
    CONSTRAINT `FK_audit_logs_users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`) ON DELETE CASCADE
);

CREATE TABLE `job_seekers` (
    `JobSeekerId` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `EducationLevel` int NOT NULL,
    `Qualification` longtext NOT NULL,
    `DesiredJobRole` varchar(255) NOT NULL,
    `DesiredLocation` varchar(255) NOT NULL,
    `ExpectedSalary` decimal(10,2) NULL,
    `IsAvailable` tinyint(1) NOT NULL,
    `AvailabilityDate` date NULL,
    `Languages` json NOT NULL,
    `Certifications` json NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`JobSeekerId`),
    CONSTRAINT `FK_job_seekers_users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`) ON DELETE CASCADE
);

CREATE TABLE `news` (
    `NewsId` char(36) NOT NULL,
    `CreatedByAdminId` char(36) NOT NULL,
    `Title` varchar(255) NOT NULL,
    `Content` longtext NOT NULL,
    `Category` int NOT NULL,
    `Priority` int NOT NULL,
    `FeaturedImageUrl` varchar(500) NULL,
    `IsPublished` tinyint(1) NOT NULL,
    `PublishedAt` datetime(6) NULL,
    `ExpiresAt` datetime(6) NULL,
    `ViewCount` int NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`NewsId`),
    CONSTRAINT `FK_news_users_CreatedByAdminId` FOREIGN KEY (`CreatedByAdminId`) REFERENCES `users` (`UserId`) ON DELETE CASCADE
);

CREATE TABLE `recruitment_agencies` (
    `AgencyId` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `CompanyName` varchar(255) NOT NULL,
    `CompanyRegistrationNumber` varchar(50) NOT NULL,
    `LicenseNumber` varchar(100) NOT NULL,
    `VerificationStatus` int NOT NULL,
    `VerifiedAt` datetime(6) NULL,
    `VerifiedBy` char(36) NULL,
    `BusinessAddress` varchar(500) NOT NULL,
    `WebsiteUrl` varchar(500) NULL,
    `NumberOfEmployees` int NULL,
    `EstablishedYear` int NULL,
    `TaxId` varchar(50) NOT NULL,
    `BankAccount` varchar(50) NOT NULL,
    `OperatingCountries` json NOT NULL,
    `Certifications` json NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`AgencyId`),
    CONSTRAINT `FK_recruitment_agencies_users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`) ON DELETE CASCADE,
    CONSTRAINT `FK_recruitment_agencies_users_VerifiedBy` FOREIGN KEY (`VerifiedBy`) REFERENCES `users` (`UserId`) ON DELETE SET NULL
);

CREATE TABLE `refresh_tokens` (
    `TokenId` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `Token` varchar(1000) NOT NULL,
    `ExpiryDate` datetime(6) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `RevokedAt` datetime(6) NULL,
    PRIMARY KEY (`TokenId`),
    CONSTRAINT `FK_refresh_tokens_users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`) ON DELETE CASCADE
);

CREATE TABLE `workers` (
    `WorkerId` char(36) NOT NULL,
    `UserId` char(36) NOT NULL,
    `WorkerRegistrationNumber` varchar(50) NOT NULL,
    `Nationality` varchar(100) NOT NULL,
    `PassportNumber` varchar(50) NOT NULL,
    `DateOfBirth` date NOT NULL,
    `Gender` int NOT NULL,
    `CurrentLocation` varchar(255) NOT NULL,
    `DesiredLocation` varchar(255) NULL,
    `YearsOfExperience` int NOT NULL,
    `Skills` json NOT NULL,
    `VerificationStatus` int NOT NULL,
    `VerifiedAt` datetime(6) NULL,
    `VerifiedBy` char(36) NULL,
    `EmergencyContactName` varchar(100) NOT NULL,
    `EmergencyContactPhone` varchar(20) NOT NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`WorkerId`),
    CONSTRAINT `FK_workers_users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`UserId`) ON DELETE CASCADE,
    CONSTRAINT `FK_workers_users_VerifiedBy` FOREIGN KEY (`VerifiedBy`) REFERENCES `users` (`UserId`) ON DELETE SET NULL
);

CREATE TABLE `job_postings` (
    `JobId` char(36) NOT NULL,
    `AgencyId` char(36) NOT NULL,
    `JobTitle` varchar(255) NOT NULL,
    `JobDescription` longtext NOT NULL,
    `JobCategory` varchar(100) NULL,
    `EmploymentType` int NOT NULL,
    `Location` varchar(255) NOT NULL,
    `Country` varchar(100) NULL,
    `SalaryMin` decimal(10,2) NULL,
    `SalaryMax` decimal(10,2) NULL,
    `SalaryCurrency` varchar(10) NULL,
    `Requirements` json NOT NULL,
    `RequiredExperience` int NULL,
    `EducationRequired` varchar(100) NULL,
    `ApplicationDeadline` date NULL,
    `Status` int NOT NULL,
    `ViewCount` int NOT NULL,
    `ApplyCount` int NOT NULL,
    `IsFeatured` tinyint(1) NOT NULL,
    `FeaturedUntil` datetime(6) NULL,
    `PostedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `ExpiresAt` datetime(6) NULL,
    `CreatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`JobId`),
    CONSTRAINT `FK_job_postings_recruitment_agencies_AgencyId` FOREIGN KEY (`AgencyId`) REFERENCES `recruitment_agencies` (`AgencyId`) ON DELETE CASCADE
);

CREATE TABLE `worker_complaints` (
    `ComplaintId` char(36) NOT NULL,
    `WorkerId` char(36) NOT NULL,
    `ComplaintType` int NOT NULL,
    `Title` varchar(255) NOT NULL,
    `Description` longtext NOT NULL,
    `AttachmentUrl` varchar(500) NULL,
    `Status` int NOT NULL,
    `Priority` int NOT NULL,
    `AssignedToAdminId` char(36) NULL,
    `ResolutionNotes` longtext NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    `SubmittedAt` datetime(6) NOT NULL,
    `ReviewedAt` datetime(6) NULL,
    `ResolvedAt` datetime(6) NULL,
    PRIMARY KEY (`ComplaintId`),
    CONSTRAINT `FK_worker_complaints_users_AssignedToAdminId` FOREIGN KEY (`AssignedToAdminId`) REFERENCES `users` (`UserId`) ON DELETE SET NULL,
    CONSTRAINT `FK_worker_complaints_workers_WorkerId` FOREIGN KEY (`WorkerId`) REFERENCES `workers` (`WorkerId`) ON DELETE CASCADE
);

CREATE TABLE `job_applications` (
    `ApplicationId` char(36) NOT NULL,
    `JobId` char(36) NOT NULL,
    `JobSeekerId` char(36) NOT NULL,
    `WorkerId` char(36) NULL,
    `Status` int NOT NULL,
    `CoverLetter` longtext NULL,
    `ResumeUrl` varchar(500) NULL,
    `AppliedAt` datetime(6) NOT NULL,
    `ReviewedAt` datetime(6) NULL,
    `ReviewedBy` char(36) NULL,
    `RejectionReason` varchar(500) NULL,
    `Rating` int NULL,
    `Comments` longtext NULL,
    `InterviewDate` datetime(6) NULL,
    `InterviewLocation` varchar(255) NULL,
    `CreatedAt` datetime(6) NOT NULL,
    `UpdatedAt` datetime(6) NOT NULL,
    PRIMARY KEY (`ApplicationId`),
    CONSTRAINT `FK_job_applications_job_postings_JobId` FOREIGN KEY (`JobId`) REFERENCES `job_postings` (`JobId`) ON DELETE CASCADE,
    CONSTRAINT `FK_job_applications_job_seekers_JobSeekerId` FOREIGN KEY (`JobSeekerId`) REFERENCES `job_seekers` (`JobSeekerId`) ON DELETE CASCADE,
    CONSTRAINT `FK_job_applications_users_ReviewedBy` FOREIGN KEY (`ReviewedBy`) REFERENCES `users` (`UserId`) ON DELETE SET NULL,
    CONSTRAINT `FK_job_applications_workers_WorkerId` FOREIGN KEY (`WorkerId`) REFERENCES `workers` (`WorkerId`) ON DELETE SET NULL
);

CREATE INDEX `IX_audit_logs_CreatedAt` ON `audit_logs` (`CreatedAt`);

CREATE INDEX `IX_audit_logs_UserId` ON `audit_logs` (`UserId`);

CREATE INDEX `IX_job_applications_JobId` ON `job_applications` (`JobId`);

CREATE INDEX `IX_job_applications_JobSeekerId` ON `job_applications` (`JobSeekerId`);

CREATE INDEX `IX_job_applications_ReviewedBy` ON `job_applications` (`ReviewedBy`);

CREATE INDEX `IX_job_applications_Status` ON `job_applications` (`Status`);

CREATE INDEX `IX_job_applications_WorkerId` ON `job_applications` (`WorkerId`);

CREATE INDEX `IX_job_postings_AgencyId` ON `job_postings` (`AgencyId`);

CREATE INDEX `IX_job_postings_Location` ON `job_postings` (`Location`);

CREATE INDEX `IX_job_postings_Status` ON `job_postings` (`Status`);

CREATE UNIQUE INDEX `IX_job_seekers_UserId` ON `job_seekers` (`UserId`);

CREATE INDEX `IX_news_Category` ON `news` (`Category`);

CREATE INDEX `IX_news_CreatedByAdminId` ON `news` (`CreatedByAdminId`);

CREATE INDEX `IX_news_IsPublished` ON `news` (`IsPublished`);

CREATE UNIQUE INDEX `IX_recruitment_agencies_CompanyRegistrationNumber` ON `recruitment_agencies` (`CompanyRegistrationNumber`);

CREATE UNIQUE INDEX `IX_recruitment_agencies_LicenseNumber` ON `recruitment_agencies` (`LicenseNumber`);

CREATE UNIQUE INDEX `IX_recruitment_agencies_UserId` ON `recruitment_agencies` (`UserId`);

CREATE INDEX `IX_recruitment_agencies_VerifiedBy` ON `recruitment_agencies` (`VerifiedBy`);

CREATE UNIQUE INDEX `IX_refresh_tokens_Token` ON `refresh_tokens` (`Token`);

CREATE INDEX `IX_refresh_tokens_UserId` ON `refresh_tokens` (`UserId`);

CREATE UNIQUE INDEX `IX_users_Email` ON `users` (`Email`);

CREATE INDEX `IX_worker_complaints_AssignedToAdminId` ON `worker_complaints` (`AssignedToAdminId`);

CREATE INDEX `IX_worker_complaints_Priority` ON `worker_complaints` (`Priority`);

CREATE INDEX `IX_worker_complaints_Status` ON `worker_complaints` (`Status`);

CREATE INDEX `IX_worker_complaints_WorkerId` ON `worker_complaints` (`WorkerId`);

CREATE UNIQUE INDEX `IX_workers_PassportNumber` ON `workers` (`PassportNumber`);

CREATE UNIQUE INDEX `IX_workers_UserId` ON `workers` (`UserId`);

CREATE INDEX `IX_workers_VerifiedBy` ON `workers` (`VerifiedBy`);

CREATE UNIQUE INDEX `IX_workers_WorkerRegistrationNumber` ON `workers` (`WorkerRegistrationNumber`);

INSERT INTO `__EFMigrationsHistory` (`MigrationId`, `ProductVersion`)
VALUES ('20260508072749_InitializeDatabase', '8.0.6');

COMMIT;

