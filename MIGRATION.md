# SQLite to PostgreSQL Migration Guide

This guide covers the migration from SQLite to PostgreSQL for the KARTA COMMERCE GENERAL project.

## Migration Scripts

### 1. Export SQLite Data
```bash
# Export current SQLite data to JSON backup
npx tsx scripts/export-sqlite-data.ts
```

### 2. Import to PostgreSQL
```bash
# Import data from backup to PostgreSQL
npx tsx scripts/import-postgresql-data.ts
```

### 3. Complete Migration
```bash
# Run full migration (export + import)
npx tsx scripts/migrate-to-postgresql.ts
```

## Pre-Migration Setup

### 1. Update Environment Variables

**For Local Development:**
```env
# Comment out SQLite
# DATABASE_URL="file:./dev.db"

# Add PostgreSQL connection
POSTGRES_URL="postgresql://username:password@localhost:5432/karta_commerce"
POSTGRES_PRISMA_URL="postgresql://username:password@localhost:5432/karta_commerce?pgbouncer=true&connect_timeout=15"
```

**For Vercel Production:**
```env
# Vercel will auto-populate these when you add Postgres
POSTGRES_URL=""
POSTGRES_PRISMA_URL=""
POSTGRES_URL_NO_SSL=""
POSTGRES_URL_NON_POOLING=""
POSTGRES_USER=""
POSTGRES_HOST=""
POSTGRES_PASSWORD=""
POSTGRES_DATABASE=""
```

### 2. Update Prisma Schema

The schema has been updated for PostgreSQL with:
- Changed provider from `sqlite` to `postgresql`
- Updated Float fields to Decimal for precision
- Added PostgreSQL-specific database attributes
- Enhanced indexing for better performance
- Text fields for large content

### 3. Install PostgreSQL Locally (for testing)

**macOS:**
```bash
brew install postgresql
brew services start postgresql
createdb karta_commerce
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo -u postgres createdb karta_commerce
```

## Migration Process

### Step 1: Backup Current Data
```bash
# Create backup of current SQLite data
npx tsx scripts/export-sqlite-data.ts
```

### Step 2: Setup PostgreSQL Database
```bash
# Update .env with PostgreSQL connection
# Run Prisma migration
npx prisma db push
npx prisma generate
```

### Step 3: Import Data
```bash
# Import backed up data to PostgreSQL
npx tsx scripts/import-postgresql-data.ts
```

### Step 4: Verify Migration
```bash
# Start the application and test
npm run dev

# Check admin panel and referral system
# Visit: http://localhost:3000/admin
# Test referral tracking functionality
```

## Vercel Deployment

### 1. Add Postgres to Vercel Project
1. Go to your Vercel dashboard
2. Select your project
3. Go to Storage tab
4. Add Postgres database
5. Vercel will auto-populate environment variables

### 2. Deploy with New Schema
```bash
# Push schema to Vercel Postgres
npx prisma db push

# Deploy application
vercel --prod
```

### 3. Import Data to Production
```bash
# Set production environment variables locally
# Run import script against production database
POSTGRES_URL="your-vercel-postgres-url" npx tsx scripts/import-postgresql-data.ts
```

## Data Model Changes

### SQLite → PostgreSQL Optimizations

1. **Decimal Fields**: Float → Decimal for financial precision
   - `commission`: Decimal(5,2) - up to 999.99%
   - `totalEarnings`: Decimal(10,2) - up to 99,999,999.99
   - `amount`: Decimal(10,2) - conversion amounts

2. **Text Fields**: String → Text for large content
   - `message`: @db.Text
   - `notes`: @db.Text

3. **Enhanced Indexing**:
   - Referrer: status, code
   - Visits: sessionId, timestamp
   - Contacts: timestamp, email
   - Conversions: status, timestamp

4. **Performance Optimizations**:
   - Connection pooling with pgbouncer
   - Proper index strategies
   - Optimized query patterns

## Rollback Strategy

If migration fails or issues arise:

### 1. Restore SQLite
```bash
# Revert .env to use SQLite
DATABASE_URL="file:./dev.db"

# Regenerate Prisma client
npx prisma generate
```

### 2. Restore Schema
```bash
# Revert prisma/schema.prisma provider
git checkout prisma/schema.prisma
```

### 3. Restart Application
```bash
npm run dev
```

## Verification Checklist

After migration, verify:

- [ ] Admin login works
- [ ] Product management functional
- [ ] Referral system operational
- [ ] New referrer creation
- [ ] Referral tracking
- [ ] Contact form with referral attribution
- [ ] Admin analytics dashboard
- [ ] All existing data preserved

## Performance Considerations

### PostgreSQL vs SQLite Benefits

1. **Concurrency**: Multiple simultaneous connections
2. **Scalability**: Better performance with large datasets
3. **Data Integrity**: ACID compliance with complex transactions
4. **Advanced Features**: JSON fields, full-text search, custom functions
5. **Production Ready**: Battle-tested for high-traffic applications

### Expected Improvements

- Faster referral analytics queries
- Better concurrent admin access
- Improved data consistency
- Enhanced query performance with proper indexing

## Troubleshooting

### Common Issues

1. **Connection Errors**:
   - Verify POSTGRES_URL format
   - Check database permissions
   - Ensure PostgreSQL is running

2. **Migration Failures**:
   - Check backup file exists in `/backup` folder
   - Verify schema is properly updated
   - Run `npx prisma db push` first

3. **Data Type Errors**:
   - Ensure Decimal fields are properly handled
   - Check date/time conversions
   - Verify string/text field mappings

### Debug Commands

```bash
# Check database connection
npx prisma db push --preview-feature

# View database in browser
npx prisma studio

# Reset database (caution!)
npx prisma db push --reset

# Generate fresh client
npx prisma generate --force-remove
```

## Support

For migration issues:
1. Check the backup files in `/backup` directory
2. Review Prisma logs for connection issues
3. Verify environment variables are correctly set
4. Test with a fresh local PostgreSQL instance first