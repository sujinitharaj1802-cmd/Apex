export type UserRole = 'operator' | 'sp' | 'admin';

export interface RoleConfig {
  id: UserRole;
  title: string;
  badge: string;
  badgeColor: string;
  subtitle: string;
  districtFocus: string;
  description: string;
  primaryFocus: string;
  permissions: string[];
}

export type CameraStatus = 'online' | 'degraded' | 'offline';
export type CameraVendor = 'CP Plus' | 'Hikvision' | 'Dahua' | 'Bosch' | 'Axis';

export interface Camera {
  id: string;
  name: string;
  district: string;
  locationName: string;
  dept: 'Traffic Police' | 'Law & Order' | 'Smart City Command' | 'Highway Patrol' | 'Ports & Coastal';
  vendor: CameraVendor;
  lat: number;
  lng: number;
  status: CameraStatus;
  resolution: string;
  ipAddress: string;
  firmware: string;
  lastHeartbeat: string;
  uptime30d: number;
  healthScore: number;
  failureRisk: 'low' | 'medium' | 'high';
  failureReason?: string;
  currentAlert?: string;
}

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AlertType = 'ANPR' | 'FaceWatchlist' | 'CrowdAnomaly' | 'PerimeterBreach' | 'AbandonedObject' | 'SpeedViolation';
export type AlertStatus = 'Detected' | 'AI Analysis' | 'Acknowledged' | 'Dispatched' | 'Resolved';

export interface AlertTimelineEvent {
  status: AlertStatus;
  timestamp: string;
  actor: string;
  note: string;
}

export interface RelatedInfo {
  relatedCameraId: string;
  nearbyCameras: string[];
  previousSimulatedEvents: string[];
  crossDistrictObservations: string[];
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  type: AlertType;
  title: string;
  district: string;
  locationName: string;
  cameraId: string;
  confidence: number;
  timestamp: string;
  status: AlertStatus;
  details: {
    targetId?: string;
    plateNumber?: string;
    watchlistCategory?: string;
    crowdDensity?: number;
    perimeterZone?: string;
    speedEstimate?: string;
    vehicleModel?: string;
    matchVectorScore?: number;
    notes?: string;
  };
  timeline: AlertTimelineEvent[];
  relatedInfo: RelatedInfo;
}

export interface WorkOrder {
  id: string;
  cameraId: string;
  district: string;
  issue: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Open' | 'Assigned' | 'In-Progress' | 'Resolved';
  createdAt: string;
  technicianVendor: string;
}

export interface TrackingWaypoint {
  order: number;
  cameraId: string;
  district: string;
  locationName: string;
  lat: number;
  lng: number;
  timestamp: string;
  speedKmh?: number;
  confidence: number;
}

export interface TrackingScenario {
  id: string;
  targetLabel: string;
  targetType: 'Vehicle' | 'Suspect';
  plateOrId: string;
  description: string;
  riskCategory: 'High' | 'Medium' | 'Critical';
  summaryStats: {
    observationsCount: number;
    locationsCount: number;
    districtsCount: number;
    durationMinutes: number;
  };
  waypoints: TrackingWaypoint[];
}

export interface AuditBlock {
  index: number;
  timestamp: string;
  actorRole: string;
  actorId: string;
  action: 'ALERT_DISPATCH' | 'EVIDENCE_EXPORT' | 'CAMERA_CONFIG_UPDATE' | 'WORK_ORDER_ISSUED' | 'ROLE_SESSION_START' | 'SYSTEM_INITIALIZATION';
  details: string;
  payloadHash: string;
  prevHash: string;
  blockHash: string;
  verified?: boolean;
}

export interface DepartmentNode {
  id: string;
  name: string;
  sector: 'Law Enforcement' | 'Municipal & Smart City' | 'Transport & Corridors' | 'Critical Infrastructure' | 'External Proposed Database';
  status: 'SIMULATED CONNECTED' | 'PENDING' | 'NOT ONBOARDED';
  protocol: 'REST / JSON' | 'MQTT Stream' | 'RTSP Proxy' | 'gRPC Ledger' | 'Secure Gov Gateway (Simulated)';
  cameraCount: number;
  throughputRps: number;
  latencyMs: number;
  lastSync: string;
  contactDept: string;
  purpose: string;
  dataCategory: string;
}

export interface AiModuleSpec {
  id: string;
  title: string;
  category: string;
  status: 'SIMULATED' | 'DEMO MODULE';
  description: string;
  syntheticConfidence: number;
  sampleInput: string;
  sampleOutput: string;
  latencyTarget: string;
  edgeOrCentral: 'Edge Embedded' | 'Central GPU Cluster';
}
