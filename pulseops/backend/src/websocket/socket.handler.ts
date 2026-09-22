import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AuthenticatedUser } from '../middleware/auth.middleware';

const JWT_SECRET = process.env.JWT_SECRET || 'pulseops-hyper-secure-jwt-secret-key-2026';

export const setupWebSocketServer = (io: Server) => {
  // 1. Handshake Authentication Middleware
  io.use((socket: Socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.cookie
        ?.split('; ')
        .find((row) => row.startsWith('access_token='))
        ?.split('=')[1];

    if (!token) {
      // In development, allow anonymous guest analyst or require auth
      socket.data.user = {
        id: 'anon-guest-user',
        email: 'ops-analyst@pulseops.internal',
        role: 'Analyst',
      };
      return next();
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication failed: Invalid WebSocket handshake token.'));
    }
  });

  // 2. Connection Lifecycle
  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as AuthenticatedUser;
    console.log(`[PulseOps WS] Client connected: ${socket.id} (${user.email} - ${user.role})`);

    // Join default broadcast rooms
    socket.join('ops:global');
    if (user.teamId) {
      socket.join(`team:${user.teamId}`);
    }

    // Client requests specific team/shift subscriptions
    socket.on('subscribe:team', (teamId: string) => {
      socket.join(`team:${teamId}`);
      console.log(`[PulseOps WS] Socket ${socket.id} subscribed to team:${teamId}`);
    });

    socket.on('disconnect', () => {
      console.log(`[PulseOps WS] Client disconnected: ${socket.id}`);
    });
  });

  // 3. Periodic High-Frequency Real-time Metric Pusher (Simulates Incident & SLA events)
  setInterval(() => {
    const now = new Date();
    const livePulse = {
      timestamp: now.toISOString(),
      activeIncidents: Math.floor(38 + Math.random() * 8), // between 38 and 46
      slaComplianceRate: Number((98.8 + Math.random() * 0.9).toFixed(2)), // 98.8% - 99.7%
      mttrMinutes: Number((16.5 + Math.random() * 3.5).toFixed(1)), // 16.5m - 20.0m
      shiftConcurrency: Number((92 + Math.random() * 6).toFixed(1)), // 92% - 98%
      latestEvent: {
        ticketNumber: `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: 'API Gateway Latency Spike > 120ms (P2)',
        priority: 'P2_HIGH',
        status: 'INVESTIGATING',
        timeAgo: 'Just now',
      },
    };

    io.to('ops:global').emit('metrics:live_pulse', livePulse);
  }, 4000); // Emits every 4 seconds
};

