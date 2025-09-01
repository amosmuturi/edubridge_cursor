# Deployment Troubleshooting Guide

This guide helps resolve common deployment issues on Render, particularly the 502 Bad Gateway error.

## Common Issues and Solutions

### 1. 502 Bad Gateway Error

**Symptoms:**
- Application shows "502 Bad Gateway" error
- Application appears to be running but requests fail
- No specific error messages in logs

**Causes:**
- Application crashes during startup
- Memory issues (especially with ML models)
- Database connection failures
- Missing environment variables
- Port binding issues

**Solutions:**

#### A. Check Application Logs
1. Go to your Render dashboard
2. Click on your service
3. Go to "Logs" tab
4. Look for error messages during startup

#### B. Test Health Endpoint
After deployment, test the health check endpoint:
```
https://your-app-name.onrender.com/health
```

This should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2025-01-01T00:00:00"
}
```

#### C. Memory Issues
If you see memory-related errors:
- The app now uses lazy loading for ML models
- Heavy dependencies have been removed from requirements.txt
- Database is configured to use `/tmp` directory on Render

### 2. Database Connection Issues

**Symptoms:**
- "no such column" errors
- Database file not found
- Permission denied errors

**Solutions:**
- Database now automatically uses `/tmp` directory on Render
- Migrations run automatically during build
- Health endpoint tests database connectivity

### 3. Environment Variable Issues

**Symptoms:**
- Application crashes with "KeyError"
- Missing configuration values

**Solutions:**
- `RENDER=true` is automatically set
- `SECRET_KEY` is auto-generated
- Check that IntaSend keys are set in Render dashboard

## Debugging Steps

### Step 1: Check Build Logs
1. Go to Render dashboard
2. Click on your service
3. Go to "Events" tab
4. Look for build failures

### Step 2: Check Runtime Logs
1. Go to "Logs" tab
2. Look for error messages
3. Check if application started successfully

### Step 3: Test Health Endpoint
```bash
curl https://your-app-name.onrender.com/health
```

### Step 4: Check Environment Variables
Ensure these are set in Render:
- `RENDER=true` (auto-set)
- `SECRET_KEY` (auto-generated)
- `INTASEND_PUBLISHABLE_KEY`
- `INTASEND_SECRET_KEY`
- `INTASEND_API_URL`

## Recent Fixes Applied

### 1. Database Configuration
- Fixed duplicate database path configuration
- Added Render-specific database path (`/tmp/edubridge.db`)
- Added automatic migration during build

### 2. Memory Optimization
- Removed heavy ML dependencies from requirements.txt
- Added lazy loading for sentence transformers
- Added error handling for ML model loading

### 3. Error Handling
- Added proper error handlers
- Added health check endpoint
- Improved logging for production

### 4. Build Process
- Updated render.yaml with migration step
- Added RENDER environment variable
- Auto-generated SECRET_KEY

## Testing Locally

Before deploying, test locally:

```bash
# Install dependencies
pip install -r requirements.txt

# Test the app
python app.py

# Test health endpoint
curl http://localhost:5000/health
```

## Deployment Checklist

- [ ] All changes committed to Git
- [ ] Requirements.txt updated
- [ ] render.yaml updated
- [ ] Environment variables set in Render
- [ ] Local testing completed
- [ ] Health endpoint working locally

## If Problems Persist

1. **Check Render Status**: Visit [status.render.com](https://status.render.com)
2. **Review Logs**: Look for specific error messages
3. **Test Health Endpoint**: Verify database connectivity
4. **Check Dependencies**: Ensure all packages are compatible
5. **Contact Support**: Use Render's support if needed

## Quick Recovery

If deployment fails completely:

1. **Revert to Previous Version**:
   ```bash
   git log --oneline
   git reset --hard <previous-commit>
   git push --force
   ```

2. **Clean Deploy**:
   - Delete service on Render
   - Recreate from GitHub
   - Ensure all environment variables are set

3. **Use Health Endpoint**:
   - Monitor `/health` endpoint
   - Check database connectivity
   - Verify all services are running
