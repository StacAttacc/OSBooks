using Microsoft.EntityFrameworkCore;
using OpenPayrun.Application.Interfaces;
using OpenPayrun.Domain.Entities;

namespace OpenPayrun.Infrastructure.Persistence;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options), IAppDbContext
{
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<PayRun> PayRuns => Set<PayRun>();
}
