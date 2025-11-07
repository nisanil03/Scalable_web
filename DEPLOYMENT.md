# Deployment Checklist

## Required Environment Variables

Make sure these environment variables are set in your deployment environment:

- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT token signing
- `CORS_ORIGIN`: Allowed origins (comma-separated) for CORS
- `NODE_ENV`: Set to 'production' in deployment
- `PORT`: Port for the server (defaults to 5000)

## Common Deployment Issues & Solutions

1. **CORS Errors**
   - Ensure `CORS_ORIGIN` includes your frontend domain
   - Example: `https://your-frontend-domain.com` or multiple origins: `https://domain1.com,https://domain2.com`

2. **MongoDB Connection Issues**
   - Check if MongoDB URI is correct
   - Verify IP whitelist in MongoDB Atlas
   - Check if database user has correct permissions

3. **JWT Authentication Errors**
   - Verify `JWT_SECRET` is set
   - Check if frontend is sending token correctly
   - Ensure token is not expired

4. **Rate Limiting Issues**
   - Default rate limit is applied to `/api` routes
   - Adjust limits in `middleware/rateLimit.js` if needed

## Pre-deployment Checklist

1. Set all required environment variables
2. Enable production mode with `NODE_ENV=production`
3. Update CORS settings for production domains
4. Set proper MongoDB connection options
5. Configure error logging (currently logs to console)
6. Test all API endpoints with production configuration

## Monitoring & Debug Tips

1. Check server logs for error details
2. Use health check endpoint: `GET /api/health`
3. Monitor MongoDB connection status
4. Watch for rate limit errors
5. Check CORS errors in browser console

## Platform-specific Notes

### General
- Enable production mode
- Configure proper error handling
- Set up monitoring and logging
- Configure SSL/TLS if needed

### MongoDB
- Use connection pooling
- Enable SSL for database connections
- Set proper timeout values
- Monitor connection pool size

## Security Notes

1. Production environment hides error details from responses
2. JWT secrets must be kept secure
3. CORS origins should be strictly configured
4. Rate limiting is enabled by default
5. Helmet middleware is configured for security headers