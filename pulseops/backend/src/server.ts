import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { authenticate, requireRoles, AuthenticatedUser } from './middleware/auth.middleware';
import { setupWebSocketServer } from './websocket/socket.handler';

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5050;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';
const JWT_SECRET = process.env.JWT_SECRET || 'pulseops-hyper-secure-jwt-secret-key-2026';

// ==============================================================================
// 1. SECURITY HEADERS & HARDENING (OWASP Standards)
// ==============================================================================

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", CLIENT_ORIGIN, 'ws:', 'wss:'],
      },
    },
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    frameguard: { action: 'deny' },
    noSniff: true,
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

// Rate Limiting to prevent DoS & brute-force
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'TOO_MANY_REQUESTS',
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta en 15 minutos.',
  },
});

app.use('/api/', apiLimiter);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// ==============================================================================
// 2. WEBSOCKET SETUP
// ==============================================================================

const io = new SocketIOServer(server, {
  cors: {
    origin: CLIENT_ORIGIN,
    credentials: true,
  },
});

setupWebSocketServer(io);

// ==============================================================================
// 3. REST API ENDPOINTS
// ==============================================================================

/**
 * POST /api/v1/auth/login
 * Sets secure httpOnly cookie with JWT and SameSite=Strict
 */
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  // In production, compare with bcrypt.hash against database
  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email y contraseña requeridos.' });
    return;
  }

  const userPayload: AuthenticatedUser = {
    id: 'usr_f89382b1-0982-411f-8239',
    email,
    role: email.includes('admin') ? 'SuperAdmin' : 'OperationsLead',
    teamId: 'team_sre_core',
  };

  const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '8h' });

  // Store in secure httpOnly cookie
  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
  });

  res.json({
    success: true,
    user: userPayload,
    message: 'Sesión autenticada exitosamente con cookie segura httpOnly.',
  });
});

/**
 * GET /api/v1/metrics/kpis
 * Returns current 4 KPIs with trend comparators and sparkline arrays
 */
app.get('/api/v1/metrics/kpis', authenticate, (req: Request, res: Response) => {
  const kpis = [
    {
      id: 'sla_compliance',
      title: 'SLA Compliance Rate',
      value: '99.4%',
      rawValue: 99.4,
      trend: '+1.8%',
      isPositive: true,
      comparisonText: 'vs semana anterior',
      status: 'healthy', // healthy | warning | critical
      sparkline: [97.2, 97.8, 98.4, 98.1, 98.9, 99.1, 99.4],
    },
    {
      id: 'active_tickets',
      title: 'Incident Volume',
      value: '42',
      rawValue: 42,
      trend: '-14.2%',
      isPositive: true, // fewer tickets is positive
      comparisonText: 'backlog en curso',
      status: 'healthy',
      sparkline: [64, 58, 52, 49, 45, 43, 42],
    },
    {
      id: 'mttr_minutes',
      title: 'Mean Time to Resolve',
      value: '18.4m',
      rawValue: 18.4,
      trend: '-22.5%',
      isPositive: true, // lower MTTR is positive
      comparisonText: 'vs objetivo SLA (60m)',
      status: 'healthy',
      sparkline: [26.2, 24.0, 22.5, 21.0, 19.8, 19.0, 18.4],
    },
    {
      id: 'shift_concurrency',
      title: 'Shift Concurrency',
      value: '94.2%',
      rawValue: 94.2,
      trend: '+5.1%',
      isPositive: true,
      comparisonText: 'capacidad operativa',
      status: 'healthy',
      sparkline: [88.0, 89.5, 91.0, 92.4, 93.1, 93.8, 94.2],
    },
  ];

  res.json({ success: true, data: kpis });
});

/**
 * GET /api/v1/metrics/time-series
 * Analytical Time-Series with hourly breakdown
 */
app.get('/api/v1/metrics/time-series', authenticate, (req: Request, res: Response) => {
  const timeSeries = [
    { time: '08:00', sla: 99.8, volume: 18, mttr: 14.2, shift: 'Morning' },
    { time: '09:00', sla: 99.4, volume: 32, mttr: 16.5, shift: 'Morning' },
    { time: '10:00', sla: 98.9, volume: 45, mttr: 18.1, shift: 'Morning' },
    { time: '11:00', sla: 99.1, volume: 38, mttr: 17.0, shift: 'Morning' },
    { time: '12:00', sla: 98.7, volume: 29, mttr: 19.2, shift: 'Morning' },
    { time: '13:00', sla: 99.5, volume: 22, mttr: 15.4, shift: 'Morning' },
    { time: '14:00', sla: 99.2, volume: 34, mttr: 16.8, shift: 'Evening' },
    { time: '15:00', sla: 99.6, volume: 41, mttr: 17.5, shift: 'Evening' },
    { time: '16:00', sla: 98.5, volume: 48, mttr: 21.0, shift: 'Evening' },
    { time: '17:00', sla: 99.0, volume: 39, mttr: 18.4, shift: 'Evening' },
    { time: '18:00', sla: 99.7, volume: 26, mttr: 14.9, shift: 'Evening' },
    { time: '19:00', sla: 99.9, volume: 21, mttr: 13.8, shift: 'Evening' },
  ];

  res.json({ success: true, data: timeSeries });
});

// Start Server
server.listen(PORT, () => {
  console.log(`⚡ [PulseOps API] Real-time engine running on port ${PORT}`);
  console.log(`🔒 [PulseOps Security] Helmet active, Rate Limiting active, Secure Cookies configured.`);
});

