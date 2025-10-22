# Security Checklist

## Before Going Live

- Review all authentication logic in auth_routes.py
- Verify JWT token expiration is set properly
- Check password hashing with bcrypt is implemented
- Ensure environment variables are not hardcoded anywhere
- Remove all console.log and debug prints from production code
- Test login/signup with invalid inputs

## Database Security

- MongoDB user has minimal required permissions
- IP whitelist is configured on MongoDB Atlas
- Database backups are enabled
- Connection string uses TLS
- Consider enabling IP access list restrictions

## API Security

- All sensitive routes require authentication
- CORS is configured for frontend domain only
- Rate limiting is implemented on auth endpoints
- Input validation on all POST requests
- SQL/NoSQL injection protection in place

## Deployment Security

- Use environment variables for all secrets
- Never commit .env files
- All dependencies are from trusted sources
- Consider using Docker for consistent environments
- Keep production logs separate from code

## Regular Maintenance

- Review dependencies for security updates monthly
- Rotate JWT secret key periodically
- Monitor failed login attempts
- Check server logs for suspicious activity
- Update MongoDB Atlas cluster security settings
