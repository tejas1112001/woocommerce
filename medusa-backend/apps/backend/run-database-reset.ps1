# =====================================================
# PowerShell Script to Reset Medusa Database
# =====================================================
# This script helps you safely reset your database
# while preserving user login data
# =====================================================

param(
    [switch]$DryRun,
    [switch]$SkipBackup,
    [switch]$AutoConfirm
)

# Colors for output
function Write-Success { param($msg) Write-Host $msg -ForegroundColor Green }
function Write-Warning { param($msg) Write-Host $msg -ForegroundColor Yellow }
function Write-Error { param($msg) Write-Host $msg -ForegroundColor Red }
function Write-Info { param($msg) Write-Host $msg -ForegroundColor Cyan }

# Database connection details from .env.local
$DB_URL = "postgres://postgres:tejas@localhost/medusa-medusa-backend"
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_USER = "postgres"
$DB_PASSWORD = "tejas"
$DB_NAME = "medusa-medusa-backend"

Write-Info "================================================"
Write-Info "   MEDUSA DATABASE RESET UTILITY"
Write-Info "================================================"
Write-Info ""

# Set PGPASSWORD environment variable for psql
$env:PGPASSWORD = $DB_PASSWORD

# Step 1: Verify connection
Write-Info "Step 1: Testing database connection..."
$testConnection = & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT version();" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Error "❌ Cannot connect to database!"
    Write-Error "Make sure PostgreSQL is running and credentials are correct."
    exit 1
}
Write-Success "✓ Database connection successful"
Write-Info ""

# Step 2: Show current state
Write-Info "Step 2: Checking current database state..."
Write-Info ""
& psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "verify-reset.sql"
Write-Info ""

# Step 3: Create backup (unless skipped)
if (-not $SkipBackup) {
    $timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
    $backupFile = "backup_before_reset_$timestamp.sql"
    
    Write-Info "Step 3: Creating backup..."
    Write-Warning "Backup file: $backupFile"
    
    & pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $backupFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "✓ Backup created successfully"
    } else {
        Write-Error "❌ Backup failed!"
        $continue = Read-Host "Continue without backup? (yes/no)"
        if ($continue -ne "yes") {
            exit 1
        }
    }
    Write-Info ""
} else {
    Write-Warning "⚠ Skipping backup (--SkipBackup flag used)"
    Write-Info ""
}

# Step 4: Confirm reset
if (-not $AutoConfirm -and -not $DryRun) {
    Write-Warning "================================================"
    Write-Warning "   ⚠️  WARNING: DESTRUCTIVE OPERATION  ⚠️"
    Write-Warning "================================================"
    Write-Warning ""
    Write-Warning "This will DELETE ALL DATA except user accounts!"
    Write-Warning ""
    Write-Warning "Protected tables (will NOT be deleted):"
    Write-Warning "  - user"
    Write-Warning ""
    Write-Warning "Everything else will be permanently deleted:"
    Write-Warning "  - Products, Variants, Inventory"
    Write-Warning "  - Orders, Carts, Line Items"
    Write-Warning "  - Customers, Addresses"
    Write-Warning "  - Payments, Fulfillments"
    Write-Warning "  - Regions, Stores, Sales Channels"
    Write-Warning "  - And all other data..."
    Write-Warning ""
    
    $confirmation = Read-Host "Type 'RESET' to proceed"
    
    if ($confirmation -ne "RESET") {
        Write-Info "Reset cancelled."
        exit 0
    }
}

# Step 5: Execute reset
if ($DryRun) {
    Write-Info "Step 4: DRY RUN - Showing what would be executed..."
    Get-Content "reset-database-keep-users.sql" | Write-Host -ForegroundColor Gray
    Write-Info ""
    Write-Warning "⚠ Dry run complete. No changes were made."
    Write-Info "Run without --DryRun flag to execute the reset."
} else {
    Write-Info "Step 4: Executing database reset..."
    Write-Info ""
    
    & psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "reset-database-keep-users.sql"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success ""
        Write-Success "================================================"
        Write-Success "   ✓ DATABASE RESET COMPLETED SUCCESSFULLY"
        Write-Success "================================================"
        Write-Success ""
        Write-Success "Next steps:"
        Write-Success "1. Users can still log in with existing credentials"
        Write-Success "2. Run your seed scripts to populate initial data"
        Write-Success "3. Re-configure regions, stores, and products as needed"
        Write-Success ""
    } else {
        Write-Error ""
        Write-Error "❌ Database reset failed!"
        Write-Error "Check the error messages above for details."
        exit 1
    }
}

# Cleanup
Remove-Item env:PGPASSWORD

Write-Info ""
Write-Info "Script completed."
