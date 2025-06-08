export const securityConfig = {
  // Password requirements
  password: {
    minLength: 8,
    requireUppercase: false,
    requireLowercase: false,
    requireNumbers: false,
    requireSpecialChars: false,
  },

  // Session configuration
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // Rate limiting
  rateLimit: {
    max: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },

  // CORS configuration
  cors: {
    allowedOrigins: [
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    ],
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },

  // Security headers
  headers: {
    'X-DNS-Prefetch-Control': 'on',
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-XSS-Protection': '1; mode=block',
    'X-Frame-Options': 'SAMEORIGIN',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'",
  },

  // Database configuration
  database: {
    connectionLimit: 10,
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
      createTimeoutMillis: 30000,
      destroyTimeoutMillis: 5000,
      reapIntervalMillis: 1000,
      createRetryIntervalMillis: 100,
    },
  },

  // Backup configuration
  backup: {
    retentionDays: 7,
    schedule: '0 0 * * *', // Daily at midnight
  },
} 