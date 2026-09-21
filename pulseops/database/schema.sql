-- ==============================================================================
-- PulseOps B2B Operational Intelligence Platform - Relational Database Schema
-- Optimized for PostgreSQL 15+ with Analytical Window Functions & Materialized Views
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. ENUMS (Strict domain definitions)
-- ==============================================================================

CREATE TYPE user_role AS ENUM ('SuperAdmin', 'OperationsLead', 'Analyst');
CREATE TYPE incident_priority AS ENUM ('P1_CRITICAL', 'P2_HIGH', 'P3_MEDIUM', 'P4_LOW');
CREATE TYPE incident_status AS ENUM ('OPEN', 'INVESTIGATING', 'MITIGATING', 'RESOLVED', 'CLOSED');
CREATE TYPE shift_type AS ENUM ('MORNING', 'EVENING', 'NIGHT', 'WEEKEND');
CREATE TYPE metric_category AS ENUM ('SLA_COMPLIANCE', 'TICKET_VOLUME', 'MTTR_MINUTES', 'SHIFT_CONCURRENCY');

-- ==============================================================================
-- 2. TABLES
-- ==============================================================================

-- Teams / Operational Squads
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE, -- e.g., 'SRE-CORE', 'L2-OPS'
    target_sla_percentage NUMERIC(5, 2) NOT NULL DEFAULT 99.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users with RBAC
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'Analyst',
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Shifts Schedule Definition
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    type shift_type NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Incidents / Tickets
CREATE TABLE incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) NOT NULL UNIQUE, -- e.g., 'INC-2026-9041'
    title VARCHAR(255) NOT NULL,
    priority incident_priority NOT NULL DEFAULT 'P3_MEDIUM',
    status incident_status NOT NULL DEFAULT 'OPEN',
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE RESTRICT,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
    
    -- SLA Metrics (in minutes)
    sla_target_minutes INT NOT NULL DEFAULT 60,
    time_to_first_response_minutes INT,
    time_to_resolve_minutes INT,
    sla_breached BOOLEAN NOT NULL DEFAULT FALSE,
    
    opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Raw High-Throughput Metric Events (Time-Series Table)
CREATE TABLE metric_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE SET NULL,
    metric_type metric_category NOT NULL,
    metric_value NUMERIC(12, 4) NOT NULL,
    dimensions JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-THROUGHPUT REAL-TIME AGGREGATIONS
-- ==============================================================================

-- Index for Fast Lookups on Users & RBAC
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_team_role ON users(team_id, role);

-- Composite Index on Incidents for Real-time SLA Dashboards
CREATE INDEX idx_incidents_team_status_priority ON incidents(team_id, status, priority);
CREATE INDEX idx_incidents_opened_at ON incidents(opened_at DESC);
CREATE INDEX idx_incidents_sla_breach ON incidents(sla_breached, opened_at DESC);

-- BRIN & B-Tree Indexes on Metric Events for High-Volume Time-Series Range Queries
CREATE INDEX idx_metric_events_timestamp_team ON metric_events(timestamp DESC, team_id, metric_type);
CREATE INDEX idx_metric_events_dimensions_gin ON metric_events USING GIN (dimensions);

-- ==============================================================================
-- 4. MATERIALIZED VIEW FOR REAL-TIME HOURLY OPS INTELLIGENCE
-- ==============================================================================

CREATE MATERIALIZED VIEW mv_hourly_shift_performance AS
SELECT 
    DATE_TRUNC('hour', i.opened_at) AS metric_hour,
    i.team_id,
    t.name AS team_name,
    COUNT(i.id) AS total_tickets,
    COUNT(CASE WHEN i.status = 'RESOLVED' OR i.status = 'CLOSED' THEN 1 END) AS resolved_tickets,
    COUNT(CASE WHEN i.sla_breached = TRUE THEN 1 END) AS sla_breaches,
    ROUND(
        (1.0 - (COUNT(CASE WHEN i.sla_breached = TRUE THEN 1 END)::NUMERIC / NULLIF(COUNT(i.id), 0))) * 100, 
        2
    ) AS sla_compliance_rate,
    ROUND(AVG(i.time_to_resolve_minutes)::NUMERIC, 1) AS avg_resolution_minutes,
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY COALESCE(i.time_to_resolve_minutes, 0)) AS p95_resolution_minutes
FROM incidents i
JOIN teams t ON t.id = i.team_id
WHERE i.opened_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('hour', i.opened_at), i.team_id, t.name
WITH DATA;

-- Unique Index to allow concurrent non-blocking refreshes
CREATE UNIQUE INDEX idx_mv_hourly_shift_perf_hour_team 
ON mv_hourly_shift_performance(metric_hour, team_id);

-- ==============================================================================
-- 5. ANALYTICAL QUERY EXAMPLES (Window Functions)
-- ==============================================================================

-- 7-Day Moving Average SLA Compliance and Trend Acceleration
-- SELECT 
--     metric_hour,
--     team_name,
--     sla_compliance_rate,
--     AVG(sla_compliance_rate) OVER (
--         PARTITION BY team_id 
--         ORDER BY metric_hour 
--         ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
--     ) AS moving_avg_24h_sla,
--     LAG(sla_compliance_rate, 1) OVER (
--         PARTITION BY team_id 
--         ORDER BY metric_hour
--     ) AS previous_hour_sla
-- FROM mv_hourly_shift_performance
-- ORDER BY metric_hour DESC;
