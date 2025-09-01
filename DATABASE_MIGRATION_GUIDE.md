# Database Migration Guide for EduBridge

This guide explains how to manage database migrations in the EduBridge project using Flask-Migrate.

## Overview

Flask-Migrate is a Flask extension that handles SQLAlchemy database migrations using Alembic. It allows you to:
- Track database schema changes
- Apply migrations safely
- Rollback changes if needed
- Keep database schema in sync across environments

## Current Migration Status

✅ **Migration Setup Complete**
- Flask-Migrate initialized
- First migration created: `939e7c02ba86_add_phone_column_to_user_table`
- Database updated with new User model columns

## Migration Files

The following files were created:
- `migrations/` - Main migrations directory
- `migrations/alembic.ini` - Alembic configuration
- `migrations/env.py` - Migration environment setup
- `migrations/script.py.mako` - Migration template
- `migrations/versions/939e7c02ba86_add_phone_column_to_user_table.py` - First migration

## Commands

### Local Development

1. **Initialize migrations** (first time only):
   ```bash
   python -m flask db init
   ```

2. **Create a new migration**:
   ```bash
   python -m flask db migrate -m "Description of changes"
   ```

3. **Apply migrations**:
   ```bash
   python -m flask db upgrade
   ```

4. **Check migration status**:
   ```bash
   python -m flask db current
   python -m flask db history
   ```

5. **Rollback migration**:
   ```bash
   python -m flask db downgrade
   ```

### Using the Helper Script

We've created a helper script `migrate_db.py` for easier migration management:

1. **Initialize migrations**:
   ```bash
   python migrate_db.py init
   ```

2. **Run all migrations**:
   ```bash
   python migrate_db.py migrate
   ```

## Deployment

### Render Deployment

The `render.yaml` file has been updated to automatically run migrations during deployment:

```yaml
buildCommand: |
  pip install -r requirements.txt
  python migrate_db.py migrate
```

This ensures that:
1. Dependencies are installed
2. Database migrations are applied
3. The application starts with the correct schema

### Manual Deployment

If you need to run migrations manually on Render:

1. Go to your Render dashboard
2. Navigate to your service
3. Open the shell/terminal
4. Run: `python migrate_db.py migrate`

## Database Schema Changes

### User Model Updates

The following columns were added to the `user` table:
- `phone` (String, 15 chars, NOT NULL)
- `county` (String, 50 chars, NOT NULL)
- `sub_county` (String, 50 chars, NOT NULL)
- `constituency` (String, 50 chars, NOT NULL)
- `location` (String, 100 chars, NOT NULL)

### New Tables Created

- `payment` - Stores payment information
- `session` - Tracks tutoring sessions

## Troubleshooting

### Common Issues

1. **"no such column" error**:
   - This means the database schema is out of sync
   - Run: `python -m flask db upgrade`

2. **Migration conflicts**:
   - Check migration history: `python -m flask db history`
   - Ensure all team members have the latest migrations

3. **Deployment failures**:
   - Check if migrations folder is committed to Git
   - Verify `render.yaml` includes migration step

### Reset Database (Development Only)

⚠️ **Warning: This will delete all data!**

```bash
# Delete the database file
rm edubridge.db

# Recreate tables
python -c "from app import app, db; app.app_context().push(); db.create_all()"

# Reinitialize migrations
rm -rf migrations/
python -m flask db init
python -m flask db migrate -m "Initial migration"
python -m flask db upgrade
```

## Best Practices

1. **Always create migrations for schema changes**
2. **Test migrations locally before deploying**
3. **Commit migration files to Git**
4. **Use descriptive migration messages**
5. **Backup database before major migrations**

## Next Steps

When you make changes to your models:

1. Update the model in `app.py`
2. Create a migration: `python -m flask db migrate -m "Description"`
3. Test locally: `python -m flask db upgrade`
4. Commit and push changes
5. Deploy - migrations will run automatically

## Support

If you encounter issues:
1. Check the migration logs
2. Verify database connection
3. Ensure all dependencies are installed
4. Check if migrations are in the correct order
