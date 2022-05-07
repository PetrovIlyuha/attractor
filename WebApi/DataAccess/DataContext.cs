﻿using Microsoft.EntityFrameworkCore;
using WebApi.Entities;

namespace WebApi.DataAccess
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<AppUser> Users { get; set; }
    }
}
