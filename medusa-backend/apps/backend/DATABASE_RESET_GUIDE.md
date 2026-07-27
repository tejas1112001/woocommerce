# Medusa Database Reset Guide

This guide explains how to completely reset your Medusa PostgreSQL database while **preserving user login credentials**.

## 🎯 What This Does

- ✅ **KEEPS:** User accounts and login credentials (user table)
- ❌ **DELETES:** Everything else (products, orders, customers, inventory, etc.)
- 🔄 **RESETS:** All database sequences (except user ID sequence)

## 📋 Prerequisites

- PostgreSQL installed and running
- `psql` and `pg_dump` commands available in PATH
- Database credentials from `.env.local`:
  - Host: `localhost`
  - Port: `5432`
  - User: `postgres`
  - Password: `tejas`
  - Database: `medusa-medusa-backend`

## 🚀 Usage Options

### Option 1: Automated PowerShell Script (Recommended)

```powershell
# Navigate to backend directory
cd medusa-backend\apps\backend

# Dry run - see what would happen without making changes
.\run-database-reset.ps1 -DryRun

# Full reset with backup (safest)
.\run-database-reset.ps1

# Skip backup (faster, but risky)
.\run-database-reset.ps1 -SkipBackup

# Auto-confirm without prompts (use with caution!)
.\run-database-reset.ps1 -AutoConfirm
```

The PowerShell script will:
1. Test database connection
2. Show current database state
3. Create a timestamped backup
4. Ask for confirmation
5. Execute the reset
6. Show verification results

### Option 2: Manual SQL Execution

```bash
# Navigate to backend directory
cd medusa-backend/apps/backend

# Set password (Windows CMD)
set PGPASSWORD=tejas

# Set password (PowerShell)
$env:PGPASSWORD="tejas"

# 1. Verify current state BEFORE reset
psql -h localhost -U postgres -d medusa-medusa-backend -f verify-reset.sql

# 2. Optional: Create backup
pg_dump -h localhost -U postgres -d medusa-medusa-backend -f backup_before_reset.sql

# 3. Execute the reset
psql -h localhost -U postgres -d medusa-medusa-backend -f reset-database-keep-users.sql

# 4. Verify state AFTER reset
psql -h localhost -U postgres -d medusa-medusa-backend -f verify-reset.sql
```

## 📊 Verification

The `verify-reset.sql` script shows:
- Product and variant counts
- Order and cart counts
- Customer and address counts
- Payment and fulfillment counts
- Core config (stores, regions, currencies)
- **User accounts (should remain unchanged)**

Run this before and after the reset to confirm:
- All data is cleared
- Users are preserved

## 🔐 Protected Tables

These tables will **NOT** be truncated:
- `user` - User accounts and login credentials

## 🗑️ Tables That Will Be Cleared

All other Medusa tables will be truncated, including:

**Products & Inventory:**
- product, product_variant, product_option, product_collection
- inventory_item, inventory_level, stock_location

**Orders & Carts:**
- order, order_item, cart, line_item

**Customers:**
- customer, customer_group, address

**Payments:**
- payment, payment_collection, payment_session, refund

**Fulfillment:**
- fulfillment, shipping_option, shipping_profile

**Configuration:**
- store, region, country, currency, sales_channel

**And many more...**

## 🔄 After Reset

1. **Users can still log in** with their existing credentials
2. **Re-seed initial data** using your migration scripts:
   ```bash
   npm run seed
   ```
3. **Re-configure** your store settings, regions, and products

## ⚠️ Important Notes

### Transaction Safety
The SQL script runs in a transaction with:
- `BEGIN` - Starts the transaction
- `COMMIT` - Commits changes (default)
- `ROLLBACK` - If you want to test without changes

To test without making changes:
1. Edit `reset-database-keep-users.sql`
2. Comment out `COMMIT;`
3. Uncomment `ROLLBACK;`

### Backup Recommendation
**Always create a backup before running the reset!**

The PowerShell script creates automatic backups. If using manual SQL:
```bash
pg_dump -h localhost -U postgres -d medusa-medusa-backend -f backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore from Backup
If something goes wrong:
```bash
psql -h localhost -U postgres -d medusa-medusa-backend -f backup_filename.sql
```

## 🛠️ Troubleshooting

### Cannot connect to database
- Ensure PostgreSQL is running
- Verify credentials in `.env.local`
- Test connection: `psql -h localhost -U postgres -d medusa-medusa-backend -c "SELECT version();"`

### psql or pg_dump not found
- Add PostgreSQL bin directory to PATH
- Windows default: `C:\Program Files\PostgreSQL\16\bin`

### Permission denied errors
- Ensure you have proper database permissions
- Try running as database superuser

### Foreign key constraint errors
- The script uses `SET session_replication_role = 'replica'` to disable triggers
- If issues persist, check for custom constraints

## 📁 Files Included

1. **reset-database-keep-users.sql** - Main reset script
2. **verify-reset.sql** - Verification queries
3. **run-database-reset.ps1** - Automated PowerShell helper
4. **DATABASE_RESET_GUIDE.md** - This guide

## 🔍 Example Output

**Before Reset:**
```
 category  | products | variants | inventory_items
-----------+----------+----------+-----------------
 PRODUCTS  |    15    |    45    |      45
 
 category        | orders | carts
-----------------+--------+-------
 ORDERS & CARTS  |   23   |   8
 
 category | total_users | active_users
----------+-------------+--------------
 USERS    |      3      |      3
```

**After Reset:**
```
 category  | products | variants | inventory_items
-----------+----------+----------+-----------------
 PRODUCTS  |     0    |     0    |       0
 
 category        | orders | carts
-----------------+--------+-------
 ORDERS & CARTS  |    0   |   0
 
 category | total_users | active_users
----------+-------------+--------------
 USERS    |      3      |      3      ← PRESERVED!
```

## 💡 Tips

1. **Run during low traffic** - Avoid running during active use
2. **Test in development first** - Verify the process works
3. **Keep backups** - Store backups in a safe location
4. **Document changes** - Keep notes on what was reset and why
5. **Communicate with team** - Let others know before resetting

## 🆘 Support

If you encounter issues:
1. Check PostgreSQL logs
2. Review error messages from psql
3. Verify database connection settings
4. Ensure all files are in the correct directory
