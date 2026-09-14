import { Camera, Alert, WorkOrder, TrackingScenario, DepartmentNode, UserRole, AiModuleSpec } from '../types';

// Global Project Metrics (Strictly consistent with Apex proposal specifications)
export const STATEWIDE_METRICS = {
  totalCameras: '80,000+',
  camerasOnlinePercent: '96%+',
  camerasOnlineCount: '~76,800+',
  activeAlerts: 45,
  avgResponseTime: '< 30 sec',
  departmentsCount: 26,
  districtsCount: 33,
  representativeCamerasCount: 405,
};

export const DISTRICT_CENTROIDS = [
  { district: 'Ahmedabad', lat: 23.0225, lng: 72.5714, cameraBase: 70 },
  { district: 'Surat', lat: 21.1702, lng: 72.8311, cameraBase: 55 },
  { district: 'Vadodara', lat: 22.3072, lng: 73.1812, cameraBase: 45 },
  { district: 'Rajkot', lat: 22.3039, lng: 70.8022, cameraBase: 40 },
  { district: 'Gandhinagar', lat: 23.2156, lng: 72.6369, cameraBase: 35 },
  { district: 'Bhavnagar', lat: 21.7645, lng: 72.1519, cameraBase: 25 },
  { district: 'Jamnagar', lat: 22.4707, lng: 70.0577, cameraBase: 25 },
  { district: 'Junagadh', lat: 21.5222, lng: 70.4579, cameraBase: 20 },
  { district: 'Kutch', lat: 23.2420, lng: 69.6669, cameraBase: 25 },
  { district: 'Mehsana', lat: 23.5880, lng: 72.3693, cameraBase: 25 },
  { district: 'Anand', lat: 22.5645, lng: 72.9289, cameraBase: 20 },
  { district: 'Bharuch', lat: 21.7051, lng: 72.9959, cameraBase: 20 },
];

const VENDORS = ['CP Plus', 'Hikvision', 'Dahua', 'Bosch', 'Axis'] as const;
const DEPTS = ['Traffic Police', 'Law & Order', 'Smart City Command', 'Highway Patrol', 'Ports & Coastal'] as const;

const LANDMARKS: Record<string, string[]> = {
  Ahmedabad: ['SG Highway', 'Ashram Road Circle', 'Kalupur Junction', 'Ellis Bridge Post', 'Science City Road', 'SP Ring Road Toll 2', 'C.G. Road Cross', 'Prahlad Nagar Square'],
  Surat: ['Ring Road', 'Dumas Road Chowk', 'Athwa Gate Junction', 'Varachha Main Road', 'Katargam Circle', 'Hazira Port Corridor', 'Adajan Chhar Rasta'],
  Vadodara: ['Alkapuri Underpass', 'Sayaji Baug Gate 3', 'Makarpura GIDC Cross', 'Fatehgunj Circle', 'Waghodia Road Toll', 'Akota Dandia Bazaar Bridge'],
  Rajkot: ['Yagnik Road Chowk', 'Kalawad Road Cross', 'Kuvadva Road Highway Point', 'Gondal Road Overbridge', '150 Feet Ring Road Circle'],
  Gandhinagar: ['Sector 10 Secretariat Gate', 'CHH Road Circle', 'Infocity Outer Loop', 'GIFT City North Gate', 'Mahatma Mandir Perimeter', 'Kudasan Cross'],
  Bhavnagar: ['Ghogha Circle', 'Nilambag Palace Road', 'Victoria Park North', 'Chitra GIDC Crossing', 'Alang Port Access Point'],
  Jamnagar: ['Digjam Circle', 'Lakhota Lake Promenade', 'Reliance Greens Checkpost', 'Bedi Port Road', 'Gulabnagar Cross'],
  Junagadh: ['Girnar Foothill Gate', 'Zanzarda Road Bypass', 'Moti Baug Cross', 'Majevadi Gate Circle'],
  Kutch: ['Bhuj Jubliee Ground Cross', 'Mundra Port Security Hub', 'Kandla Expressway Toll', 'Gandhidham Station Road', 'Anjar Bypass Point'],
  Mehsana: ['Modhera Road Cross', 'Radhanpur Road Highway Post', 'ONGC Colony Outer Check', 'Mehsana Bypass Toll'],
  Anand: ['Amul Dairy Road Circle', 'Vidyanagar Town Hall Cross', 'Expressway Toll Junction', 'Borsad Crossroads'],
  Bharuch: ['Industrial Zone Gate 2', 'Golden Bridge Approach', 'Narmada Maiya Bridge Plaza', 'Dahej Port Highway Post', 'Zadeshwar Cross'],
};

// Seed 405 Representative Camera records
export function generateCameras(): Camera[] {
  const cameras: Camera[] = [];
  let globalIndex = 1;

  // Specific canonical cameras mentioned in requirements
  const canonicalMap: Record<string, { district: string; landmark: string; reason: string; status: Camera['status'] }> = {
    'CAM-AHM-0182': { district: 'Ahmedabad', landmark: 'SG Highway', reason: 'Signal degradation', status: 'degraded' },
    'CAM-SUR-0314': { district: 'Surat', landmark: 'Ring Road', reason: 'Heartbeat instability', status: 'degraded' },
    'CAM-VAD-0104': { district: 'Vadodara', landmark: 'Makarpura GIDC Cross', reason: 'Storage warning', status: 'degraded' },
    'CAM-RAJ-0207': { district: 'Rajkot', landmark: '150 Feet Ring Road Circle', reason: 'Network latency', status: 'degraded' },
    'CAM-BHA-0092': { district: 'Bharuch', landmark: 'Industrial Zone Gate 2', reason: 'Perimeter optic calibration', status: 'online' },
  };

  for (const item of DISTRICT_CENTROIDS) {
    const landmarks = LANDMARKS[item.district] || ['Main Highway Point', 'Central Circle', 'Security Post', 'Toll Plaza'];
    for (let i = 0; i < item.cameraBase; i++) {
      const idCode = item.district.substring(0, 3).toUpperCase();
      const numStr = String(globalIndex).padStart(4, '0');
      let camId = `CAM-${idCode}-${numStr}`;

      let status: Camera['status'] = 'online';
      let failureRisk: Camera['failureRisk'] = 'low';
      let failureReason: string | undefined = undefined;

      // Ensure canonical cameras are injected
      if (item.district === 'Ahmedabad' && i === 1) camId = 'CAM-AHM-0182';
      if (item.district === 'Surat' && i === 1) camId = 'CAM-SUR-0314';
      if (item.district === 'Vadodara' && i === 1) camId = 'CAM-VAD-0104';
      if (item.district === 'Rajkot' && i === 1) camId = 'CAM-RAJ-0207';
      if (item.district === 'Bharuch' && i === 1) camId = 'CAM-BHA-0092';

      if (canonicalMap[camId]) {
        status = canonicalMap[camId].status;
        failureReason = canonicalMap[camId].reason;
        failureRisk = 'medium';
      } else {
        const randStatus = Math.random();
        if (randStatus < 0.03) {
          status = 'offline';
          failureRisk = 'high';
          failureReason = Math.random() > 0.5 ? 'Network Switch Offline / Fiber Link Cut' : 'PoE Injector Fault';
        } else if (randStatus < 0.07) {
          status = 'degraded';
          failureRisk = 'medium';
          failureReason = Math.random() > 0.5 ? 'High Packet Loss (>18%) & Frame Drops' : 'Optical Sensor Fogging / Dust';
        }
      }

      // Geo coordinate jitter around centroid
      const latJitter = (Math.random() - 0.5) * 0.08;
      const lngJitter = (Math.random() - 0.5) * 0.08;

      const landmark = landmarks[i % landmarks.length];
      const dept = DEPTS[Math.floor(Math.random() * DEPTS.length)];
      const vendor = VENDORS[Math.floor(Math.random() * VENDORS.length)];

      cameras.push({
        id: camId,
        name: `${item.district} ${landmark} • S${(i % 4) + 1}`,
        district: item.district,
        locationName: landmark,
        dept,
        vendor,
        lat: Number((item.lat + latJitter).toFixed(5)),
        lng: Number((item.lng + lngJitter).toFixed(5)),
        status,
        resolution: i % 3 === 0 ? '4K / 30fps (H.265)' : '1080p / 60fps (H.264)',
        ipAddress: `10.42.${10 + Math.floor(globalIndex / 250)}.${(globalIndex % 250) + 1}`,
        firmware: `v3.${(globalIndex % 4) + 1}.${(globalIndex % 9) + 2}-build7`,
        lastHeartbeat: `${Math.floor(Math.random() * 35) + 3}s ago`,
        uptime30d: status === 'offline' ? 91.2 : status === 'degraded' ? 95.8 : Number((98.9 + Math.random() * 1.0).toFixed(1)),
        healthScore: status === 'offline' ? 32 : status === 'degraded' ? 68 : Math.floor(93 + Math.random() * 7),
        failureRisk,
        failureReason,
        currentAlert: camId === 'CAM-AHM-0182' ? 'SIM-ALT-00482' : camId === 'CAM-SUR-0314' ? 'SIM-ALT-00483' : camId === 'CAM-BHA-0092' ? 'SIM-ALT-00484' : undefined,
      });

      globalIndex++;
    }
  }

  return cameras;
}

// Initial realistic simulated alert pool with required examples
export function generateInitialAlerts(cameras: Camera[]): Alert[] {
  const alerts: Alert[] = [
    {
      id: 'SIM-ALT-00484',
      severity: 'CRITICAL',
      type: 'PerimeterBreach',
      title: 'Perimeter Breach Detected',
      district: 'Bharuch',
      locationName: 'Industrial Zone Gate 2',
      cameraId: 'CAM-BHA-0092',
      confidence: 96.2,
      timestamp: '23:00:58',
      status: 'Detected',
      details: {
        perimeterZone: 'Zone 4 Outer Petrochemical Barrier',
        notes: 'Simulated infrared tripwire crossing detected after scheduled operating hours. Automated PTZ camera focus engaged.',
      },
      timeline: [
        {
          status: 'Detected',
          timestamp: '23:00:58 (00s)',
          actor: 'Edge AI Inference Node',
          note: 'Infrared tripwire break triggered spatial boundary violation score 0.962.',
        },
        {
          status: 'AI Analysis',
          timestamp: '23:01:04 (06s)',
          actor: 'Central Intelligence Engine',
          note: 'Secondary motion classification confirmed human silhouette in restricted buffer zone.',
        },
      ],
      relatedInfo: {
        relatedCameraId: 'CAM-BHA-0093',
        nearbyCameras: ['CAM-BHA-0091', 'CAM-BHA-0094', 'CAM-BHA-0095'],
        previousSimulatedEvents: ['SIM-EVT-BHA-019 (Speed violation at 21:40)', 'SIM-EVT-BHA-014 (Gate ping 18:22)'],
        crossDistrictObservations: ['No external district correlation identified in prior 2 hours.'],
      },
    },
    {
      id: 'SIM-ALT-00483',
      severity: 'MEDIUM',
      type: 'CrowdAnomaly',
      title: 'Crowd Density Anomaly',
      district: 'Surat',
      locationName: 'Ring Road Chowk',
      cameraId: 'CAM-SUR-0314',
      confidence: 91.3,
      timestamp: '23:01:08',
      status: 'Acknowledged',
      details: {
        crowdDensity: 7.8,
        notes: 'Optical flow vector analysis indicates abnormal cluster formation (7.8 persons/sq.m) exceeding sector threshold (5.0 p/m²).',
      },
      timeline: [
        {
          status: 'Detected',
          timestamp: '23:01:08 (00s)',
          actor: 'Surat Smart City Edge AI',
          note: 'Crowd density threshold exceeded at junction perimeter.',
        },
        {
          status: 'AI Analysis',
          timestamp: '23:01:12 (04s)',
          actor: 'Central AI Engine',
          note: 'Crowd surge rate calculated at +18 persons/min.',
        },
        {
          status: 'Acknowledged',
          timestamp: '23:01:25 (17s)',
          actor: 'Control Room Operator (OPR-SRT-014)',
          note: 'Visual confirmation checked on console monitor 2. Monitoring situation.',
        },
      ],
      relatedInfo: {
        relatedCameraId: 'CAM-SUR-0315',
        nearbyCameras: ['CAM-SUR-0312', 'CAM-SUR-0316'],
        previousSimulatedEvents: ['SIM-EVT-SUR-082 (Routine traffic slowdown 22:15)'],
        crossDistrictObservations: ['Correlated with festival transport egress from Surat Central.'],
      },
    },
    {
      id: 'SIM-ALT-00482',
      severity: 'HIGH',
      type: 'ANPR',
      title: 'Stolen Vehicle Detection',
      district: 'Ahmedabad',
      locationName: 'SG Highway Flyover',
      cameraId: 'CAM-AHM-0182',
      confidence: 94.7,
      timestamp: '23:01:14',
      status: 'Dispatched',
      details: {
        plateNumber: 'GJ-01-XX-4821',
        targetId: 'SIM-HOTLIST-VEH-4821',
        vehicleModel: 'White SUV / Scorpio Classic',
        speedEstimate: '74 km/h',
        matchVectorScore: 0.947,
        notes: 'Plate matched against simulated inter-district hotlist. Associated with simulated pending vehicle theft FIR #GJ-01-CR-8821.',
      },
      timeline: [
        {
          status: 'Detected',
          timestamp: '23:01:14 (00s)',
          actor: 'ANPR Edge Neural Engine',
          note: 'High-contrast OCR matched plate GJ-01-XX-4821 (Confidence 94.7%).',
        },
        {
          status: 'AI Analysis',
          timestamp: '23:01:17 (03s)',
          actor: 'Central Intelligence Engine',
          note: 'Simulated hotlist verification confirmed active stolen vehicle flag.',
        },
        {
          status: 'Acknowledged',
          timestamp: '23:01:28 (14s)',
          actor: 'Control Room Operator (OPR-AMD-409)',
          note: 'Visual verification confirmed white SUV profile matches hotlist entry.',
        },
        {
          status: 'Dispatched',
          timestamp: '23:01:40 (26s)',
          actor: 'District SP Command Desk',
          note: 'Tasked PCR Patrol Van 12 & Highway Interceptor 04 to intercept down-corridor.',
        },
      ],
      relatedInfo: {
        relatedCameraId: 'CAM-AHM-0183',
        nearbyCameras: ['CAM-AHM-0180', 'CAM-AHM-0184', 'CAM-AHM-0185'],
        previousSimulatedEvents: ['SIM-EVT-AMD-401 (Observed at SP Ring Road 22:48)'],
        crossDistrictObservations: ['Trajectory indicates southward transit towards Vadodara corridor.'],
      },
    },
    {
      id: 'SIM-ALT-00481',
      severity: 'HIGH',
      type: 'FaceWatchlist',
      title: 'Watchlist Identity Correlation',
      district: 'Vadodara',
      locationName: 'Alkapuri Underpass',
      cameraId: 'CAM-VAD-0102',
      confidence: 93.8,
      timestamp: '22:58:32',
      status: 'Acknowledged',
      details: {
        targetId: 'WL-0027',
        watchlistCategory: 'Simulated Interstate Economic Offender Notice',
        matchVectorScore: 0.938,
        notes: 'Synthetic vector cosine distance 0.062 against simulated watchlist index WL-0027. Strictly synthetic embedding simulation.',
      },
      timeline: [
        {
          status: 'Detected',
          timestamp: '22:58:32 (00s)',
          actor: 'Edge Facial Feature Extractor',
          note: 'Facial feature vector matched synthetic template WL-0027.',
        },
        {
          status: 'AI Analysis',
          timestamp: '22:58:36 (04s)',
          actor: 'Central Intelligence Engine',
          note: 'Multi-frame verification confirmed vector consistency across 4 consecutive frames.',
        },
        {
          status: 'Acknowledged',
          timestamp: '22:58:55 (23s)',
          actor: 'Control Room Operator (OPR-VAD-101)',
          note: 'Alert acknowledged. Verification protocol dispatched to station investigator.',
        },
      ],
      relatedInfo: {
        relatedCameraId: 'CAM-VAD-0103',
        nearbyCameras: ['CAM-VAD-0101', 'CAM-VAD-0105'],
        previousSimulatedEvents: ['SIM-EVT-VAD-091 (Station entry recorded 22:30)'],
        crossDistrictObservations: ['Correlation with Ahmedabad passenger transit manifest.'],
      },
    },
    {
      id: 'SIM-ALT-00480',
      severity: 'LOW',
      type: 'SpeedViolation',
      title: 'Corridor Speed Threshold Exceeded',
      district: 'Gandhinagar',
      locationName: 'GIFT City North Gate',
      cameraId: 'CAM-GND-0240',
      confidence: 97.4,
      timestamp: '22:54:19',
      status: 'Resolved',
      details: {
        plateNumber: 'GJ-18-XX-3012',
        speedEstimate: '98 km/h (Limit: 70 km/h)',
        vehicleModel: 'Silver Sedan',
        notes: 'Automated speed calculation over 100m calibration markers. Simulated e-challan generated.',
      },
      timeline: [
        {
          status: 'Detected',
          timestamp: '22:54:19',
          actor: 'Traffic AI Sensor',
          note: 'Vehicle velocity measured at 98 km/h.',
        },
        {
          status: 'Resolved',
          timestamp: '22:54:28',
          actor: 'Automated Rule Engine',
          note: 'Synthetic notice queued for simulated eGujCop traffic branch dispatch.',
        },
      ],
      relatedInfo: {
        relatedCameraId: 'CAM-GND-0241',
        nearbyCameras: ['CAM-GND-0238', 'CAM-GND-0242'],
        previousSimulatedEvents: [],
        crossDistrictObservations: [],
      },
    },
    {
      id: 'SIM-ALT-00479',
      severity: 'CRITICAL',
      type: 'AbandonedObject',
      title: 'Unattended Bag Detected (>15 min)',
      district: 'Rajkot',
      locationName: 'Yagnik Road Chowk',
      cameraId: 'CAM-RAJ-0205',
      confidence: 95.1,
      timestamp: '22:51:02',
      status: 'Dispatched',
      details: {
        notes: 'Static object segmentation algorithm identified black backpack stationary without guardian for 16 minutes.',
      },
      timeline: [
        {
          status: 'Detected',
          timestamp: '22:51:02',
          actor: 'Static Object AI Node',
          note: 'Stationary threshold (15 min) breached.',
        },
        {
          status: 'Dispatched',
          timestamp: '22:51:40',
          actor: 'Rajkot Control Desk',
          note: 'Bomb Detection & Disposal Squad (BDDS) protocol simulated alert issued.',
        },
      ],
      relatedInfo: {
        relatedCameraId: 'CAM-RAJ-0206',
        nearbyCameras: ['CAM-RAJ-0201', 'CAM-RAJ-0208'],
        previousSimulatedEvents: [],
        crossDistrictObservations: [],
      },
    },
  ];

  return alerts;
}

// Generate an individual synthetic alert on timer ticker
export function generateSyntheticAlert(cameras: Camera[]): Alert {
  const alertConfigs: {
    type: Alert['type'];
    severity: Alert['severity'];
    titleTemplate: string;
  }[] = [
    { type: 'ANPR', severity: 'HIGH', titleTemplate: 'Stolen Vehicle Detection' },
    { type: 'FaceWatchlist', severity: 'HIGH', titleTemplate: 'Watchlist Identity Correlation' },
    { type: 'CrowdAnomaly', severity: 'MEDIUM', titleTemplate: 'Crowd Density Anomaly' },
    { type: 'PerimeterBreach', severity: 'CRITICAL', titleTemplate: 'Perimeter Breach Detected' },
    { type: 'AbandonedObject', severity: 'CRITICAL', titleTemplate: 'Unattended Object Flagged' },
    { type: 'SpeedViolation', severity: 'LOW', titleTemplate: 'Corridor Speed Violation' },
  ];

  const cfg = alertConfigs[Math.floor(Math.random() * alertConfigs.length)];
  const randomCamera = cameras[Math.floor(Math.random() * cameras.length)] || cameras[0];
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const alertId = `SIM-ALT-00${Math.floor(485 + Math.random() * 500)}`;

  const now = new Date();
  const timestamp = now.toTimeString().split(' ')[0];

  let details: Alert['details'] = {};
  if (cfg.type === 'ANPR') {
    const mockPlate = `GJ-01-XX-${randNum}`;
    details = {
      plateNumber: mockPlate,
      targetId: `SIM-HOTLIST-${randNum}`,
      vehicleModel: ['White SUV / Scorpio', 'Silver Sedan / City', 'Black Hatchback / Swift', 'Commercial Truck'][Math.floor(Math.random() * 4)],
      speedEstimate: `${Math.floor(55 + Math.random() * 40)} km/h`,
      matchVectorScore: Number((0.92 + Math.random() * 0.07).toFixed(3)),
      notes: 'Vehicle flagged on simulated inter-district watchlist for unpaid high-risk e-challans.',
    };
  } else if (cfg.type === 'FaceWatchlist') {
    const wlId = `WL-00${Math.floor(10 + Math.random() * 89)}`;
    details = {
      targetId: wlId,
      watchlistCategory: 'Simulated Interstate Court Warrant Flag',
      matchVectorScore: Number((0.89 + Math.random() * 0.09).toFixed(3)),
      notes: 'Synthetic biometric embedding cosine match (vector distance < 0.11). Human verification required prior to action.',
    };
  } else if (cfg.type === 'CrowdAnomaly') {
    const density = Number((7.1 + Math.random() * 4.2).toFixed(1));
    details = {
      crowdDensity: density,
      notes: `Optical flow vector analysis indicates abnormal cluster formation exceeding threshold.`,
    };
  } else {
    details = {
      perimeterZone: 'Zone 2 Outer Security Barrier',
      notes: 'Tripwire laser crossing simulated after curfew hours. Automated PTZ camera tracking lock initiated.',
    };
  }

  return {
    id: alertId,
    severity: cfg.severity,
    type: cfg.type,
    title: cfg.titleTemplate,
    district: randomCamera.district,
    locationName: randomCamera.locationName,
    cameraId: randomCamera.id,
    confidence: Number((89 + Math.random() * 9.5).toFixed(1)),
    timestamp,
    status: 'Detected',
    details,
    timeline: [
      {
        status: 'Detected',
        timestamp: `${timestamp} (00s)`,
        actor: 'Apex Edge AI Node',
        note: 'High-confidence signature match trigger generated locally on edge sensor.',
      },
      {
        status: 'AI Analysis',
        timestamp: `${timestamp} (04s)`,
        actor: 'Central Intelligence Engine',
        note: 'Cross-validated against historical sensor stream telemetry.',
      },
    ],
    relatedInfo: {
      relatedCameraId: randomCamera.id,
      nearbyCameras: [`${randomCamera.id.slice(0, -1)}1`, `${randomCamera.id.slice(0, -1)}3`],
      previousSimulatedEvents: ['Prior event logged 45m ago in same sector.'],
      crossDistrictObservations: ['Statewide federation check active.'],
    },
  };
}

// Canonical Cross-District Tracking Scenario: SIM-VH-0238
export const TRACKING_SCENARIOS: TrackingScenario[] = [
  {
    id: 'SCENARIO-01',
    targetLabel: 'Target Vehicle: SIM-VH-0238',
    targetType: 'Vehicle',
    plateOrId: 'SIM-VH-0238',
    riskCategory: 'Critical',
    description: 'Inter-district hotlist tracking simulation across Ahmedabad, Vadodara, Bharuch, and Surat corridors.',
    summaryStats: {
      observationsCount: 4,
      locationsCount: 4,
      districtsCount: 3,
      durationMinutes: 32,
    },
    waypoints: [
      {
        order: 1,
        cameraId: 'CAM-AHM-0182',
        district: 'Ahmedabad',
        locationName: 'SG Highway Flyover',
        lat: 23.0385,
        lng: 72.5122,
        timestamp: '22:15:10',
        speedKmh: 74,
        confidence: 94.7,
      },
      {
        order: 2,
        cameraId: 'CAM-VAD-0104',
        district: 'Vadodara',
        locationName: 'Makarpura GIDC Cross',
        lat: 22.2510,
        lng: 73.1950,
        timestamp: '22:26:40',
        speedKmh: 82,
        confidence: 96.1,
      },
      {
        order: 3,
        cameraId: 'CAM-BHA-0092',
        district: 'Bharuch',
        locationName: 'Industrial Zone Gate 2',
        lat: 21.7010,
        lng: 72.9810,
        timestamp: '22:38:15',
        speedKmh: 68,
        confidence: 95.4,
      },
      {
        order: 4,
        cameraId: 'CAM-SUR-0314',
        district: 'Surat',
        locationName: 'Ring Road Chowk',
        lat: 21.1980,
        lng: 72.8250,
        timestamp: '22:47:30',
        speedKmh: 54,
        confidence: 97.2,
      },
    ],
  },
  {
    id: 'SCENARIO-02',
    targetLabel: 'Corridor Escort: SIM-VH-0519',
    targetType: 'Vehicle',
    plateOrId: 'SIM-VH-0519',
    riskCategory: 'High',
    description: 'Hazardous cargo simulated tracking from Gandhinagar through Ahmedabad to Anand industrial bypass.',
    summaryStats: {
      observationsCount: 3,
      locationsCount: 3,
      districtsCount: 3,
      durationMinutes: 24,
    },
    waypoints: [
      {
        order: 1,
        cameraId: 'CAM-GND-0240',
        district: 'Gandhinagar',
        locationName: 'GIFT City North Gate',
        lat: 23.2150,
        lng: 72.6840,
        timestamp: '21:30:00',
        speedKmh: 60,
        confidence: 96.8,
      },
      {
        order: 2,
        cameraId: 'CAM-AHM-0185',
        district: 'Ahmedabad',
        locationName: 'SP Ring Road Toll 2',
        lat: 23.0945,
        lng: 72.5489,
        timestamp: '21:42:20',
        speedKmh: 75,
        confidence: 94.2,
      },
      {
        order: 3,
        cameraId: 'CAM-ANA-0352',
        district: 'Anand',
        locationName: 'Expressway Toll Junction',
        lat: 22.5645,
        lng: 72.9289,
        timestamp: '21:54:10',
        speedKmh: 78,
        confidence: 95.9,
      },
    ],
  },
];

// Predictive Maintenance At-Risk Cameras
export function generateInitialWorkOrders(): WorkOrder[] {
  return [
    {
      id: 'SIM-WO-2026-104',
      cameraId: 'CAM-AHM-0182',
      district: 'Ahmedabad',
      issue: 'Signal degradation — Optical sensor noise and RTSP frame drops over 15%',
      priority: 'High',
      status: 'Open',
      createdAt: '2026-09-14 21:45',
      technicianVendor: 'CP Plus Field Support',
    },
    {
      id: 'SIM-WO-2026-105',
      cameraId: 'CAM-SUR-0314',
      district: 'Surat',
      issue: 'Heartbeat instability — Intermittent telemetry loss every 90s',
      priority: 'High',
      status: 'Assigned',
      createdAt: '2026-09-14 22:05',
      technicianVendor: 'Hikvision L2 SLA Team',
    },
    {
      id: 'SIM-WO-2026-106',
      cameraId: 'CAM-VAD-0104',
      district: 'Vadodara',
      issue: 'Storage warning — Edge SD buffer capacity at 94%, pending retention purge',
      priority: 'Medium',
      status: 'In-Progress',
      createdAt: '2026-09-14 22:20',
      technicianVendor: 'Dahua Maintenance Partner',
    },
    {
      id: 'SIM-WO-2026-107',
      cameraId: 'CAM-RAJ-0207',
      district: 'Rajkot',
      issue: 'Network latency — Ping roundtrip exceeding 140ms on WAN link',
      priority: 'Medium',
      status: 'Open',
      createdAt: '2026-09-14 22:35',
      technicianVendor: 'BSNL Gujarat WAN Support',
    },
  ];
}

// AI Modules Catalog for AI Analytics Screen
export const AI_MODULES_CATALOG: AiModuleSpec[] = [
  {
    id: 'AI-ANPR-01',
    title: 'Automatic Number Plate Recognition (ANPR)',
    category: 'Vehicle Intelligence',
    status: 'SIMULATED',
    description: 'High-speed OCR parsing of Indian standard and non-standard vehicle registration plates across adverse weather and low-light conditions.',
    syntheticConfidence: 97.4,
    sampleInput: 'Frame: SG Highway Cam #4 • 1080p @ 60fps',
    sampleOutput: 'Plate: GJ-01-XX-4821 • Class: White SUV',
    latencyTarget: '< 45 ms',
    edgeOrCentral: 'Edge Embedded',
  },
  {
    id: 'AI-FACE-02',
    title: 'Face / Watchlist Matching',
    category: 'Biometric Vector Search (Simulated)',
    status: 'DEMO MODULE',
    description: 'Generates 512-dimensional synthetic facial embeddings for cosine similarity lookups against statutory watchlists. No real biometric data used.',
    syntheticConfidence: 93.8,
    sampleInput: 'Target Crop: 140x140px • Normalized Face Matrix',
    sampleOutput: 'Match: WL-0027 • Vector Distance: 0.062',
    latencyTarget: '< 80 ms',
    edgeOrCentral: 'Central GPU Cluster',
  },
  {
    id: 'AI-OBJ-03',
    title: 'Multi-Class Object Detection',
    category: 'Computer Vision',
    status: 'SIMULATED',
    description: 'Simultaneous bounding-box localization and classification for Persons, Vehicles, Bags, and Motorcycles in dense urban transit spaces.',
    syntheticConfidence: 96.1,
    sampleInput: 'Frame: Surat Ring Road Junction',
    sampleOutput: 'Detected: 14 Persons, 8 Vehicles, 3 Motorcycles',
    latencyTarget: '< 30 ms',
    edgeOrCentral: 'Edge Embedded',
  },
  {
    id: 'AI-CROWD-04',
    title: 'Crowd Density & Surge Analysis',
    category: 'Public Safety',
    status: 'SIMULATED',
    description: 'Optical flow vector field modeling to calculate spatial crowd density (persons/m²) and detect sudden surge directionalities for stampede prevention.',
    syntheticConfidence: 91.3,
    sampleInput: 'Sector Grid: Kalupur Station Promenade',
    sampleOutput: 'Density: 7.8 p/m² • Status: Abnormal Congestion',
    latencyTarget: '< 120 ms',
    edgeOrCentral: 'Central GPU Cluster',
  },
  {
    id: 'AI-PERI-05',
    title: 'Perimeter Intrusion & Tripwire Detection',
    category: 'Infrastructure Security',
    status: 'SIMULATED',
    description: 'Virtual directional tripwires and polygonal exclusion zones alerting on unauthorized movement during scheduled curfew intervals.',
    syntheticConfidence: 96.2,
    sampleInput: 'Zone: Bharuch Industrial Petrochemical Buffer',
    sampleOutput: 'Violation: Ingress Vector crossing Line AB',
    latencyTarget: '< 25 ms',
    edgeOrCentral: 'Edge Embedded',
  },
  {
    id: 'AI-ABN-06',
    title: 'Stationary & Abandoned Object Alerting',
    category: 'Forensic Surveillance',
    status: 'DEMO MODULE',
    description: 'Background-subtraction algorithm isolating items that remain unattended without an owner proxy for longer than 15 consecutive minutes.',
    syntheticConfidence: 95.1,
    sampleInput: 'Object: Backpack • Stationary Duration: 16m 12s',
    sampleOutput: 'Classification: High-Priority Unattended Item',
    latencyTarget: '< 200 ms',
    edgeOrCentral: 'Central GPU Cluster',
  },
  {
    id: 'AI-VEH-07',
    title: 'Vehicle Trajectory & Speed Estimation',
    category: 'Traffic Operations',
    status: 'SIMULATED',
    description: 'Calculates vehicle velocity via camera-calibrated ground perspective geometry and traces corridor egress paths across multiple camera nodes.',
    syntheticConfidence: 97.2,
    sampleInput: 'Corridor: GIFT City North Gate Approach',
    sampleOutput: 'Velocity: 98 km/h • Threshold: Exceeded',
    latencyTarget: '< 40 ms',
    edgeOrCentral: 'Edge Embedded',
  },
];

// 26 Gujarat Government Departments & Proposed Integration Nodes (Layer 2 Federation)
export const INTEGRATION_NODES: DepartmentNode[] = [
  // External Proposed State/National Databases (Explicitly labeled as proposed/illustrative)
  {
    id: 'PROP-01',
    name: 'eGujCop Police Core (Proposed)',
    sector: 'External Proposed Database',
    status: 'SIMULATED CONNECTED',
    protocol: 'Secure Gov Gateway (Simulated)',
    cameraCount: 0,
    throughputRps: 142,
    latencyMs: 38,
    lastSync: '12s ago',
    contactDept: 'Gujarat Police CCTNS Cell',
    purpose: 'FIR status cross-referencing and stolen vehicle hotlist synchronization.',
    dataCategory: 'Incident & Case Records',
  },
  {
    id: 'PROP-02',
    name: 'CCTNS / ICJS National Portal (Proposed)',
    sector: 'External Proposed Database',
    status: 'PENDING',
    protocol: 'REST / JSON',
    cameraCount: 0,
    throughputRps: 0,
    latencyMs: 0,
    lastSync: 'MoU Drafting Phase',
    contactDept: 'NCRB / MHA New Delhi',
    purpose: 'Interstate offender lookup and judicial custody tracking integration.',
    dataCategory: 'National Crime Records',
  },
  {
    id: 'PROP-03',
    name: 'VAHAN & SARTHI Portal (Proposed)',
    sector: 'External Proposed Database',
    status: 'SIMULATED CONNECTED',
    protocol: 'REST / JSON',
    cameraCount: 0,
    throughputRps: 280,
    latencyMs: 44,
    lastSync: '8s ago',
    contactDept: 'Ministry of Road Transport & Highways',
    purpose: 'Vehicle registration verification and driver license validation.',
    dataCategory: 'National Vehicle Registry',
  },
  {
    id: 'PROP-04',
    name: 'NAFIS Fingerprint / Biometric Hub (Proposed)',
    sector: 'External Proposed Database',
    status: 'NOT ONBOARDED',
    protocol: 'REST / JSON',
    cameraCount: 0,
    throughputRps: 0,
    latencyMs: 0,
    lastSync: 'Security Audit Required',
    contactDept: 'NCRB New Delhi',
    purpose: 'Forensic biometric reference registry verification.',
    dataCategory: 'Biometric Hash Registry',
  },

  // State Departments & Municipal Corporations
  {
    id: 'DEPT-01',
    name: 'Ahmedabad Smart City (AMC-ICCC)',
    sector: 'Municipal & Smart City',
    status: 'SIMULATED CONNECTED',
    protocol: 'MQTT Stream',
    cameraCount: 6500,
    throughputRps: 420,
    latencyMs: 16,
    lastSync: '2s ago',
    contactDept: 'AMC Smart City SPV',
    purpose: 'Urban core traffic management and public space surveillance.',
    dataCategory: 'Video Stream Feeds',
  },
  {
    id: 'DEPT-02',
    name: 'Surat Municipal Corporation (SMC) ICCC',
    sector: 'Municipal & Smart City',
    status: 'SIMULATED CONNECTED',
    protocol: 'MQTT Stream',
    cameraCount: 4800,
    throughputRps: 340,
    latencyMs: 18,
    lastSync: '4s ago',
    contactDept: 'SMC Command Center',
    purpose: 'Citywide municipal security and transit corridor monitoring.',
    dataCategory: 'Video Stream Feeds',
  },
  {
    id: 'DEPT-03',
    name: 'Vadodara Smart City (VMSS) ICCC',
    sector: 'Municipal & Smart City',
    status: 'SIMULATED CONNECTED',
    protocol: 'REST / JSON',
    cameraCount: 3200,
    throughputRps: 190,
    latencyMs: 24,
    lastSync: '10s ago',
    contactDept: 'VMSS Control Hub',
    purpose: 'Urban surveillance and municipal ward monitoring.',
    dataCategory: 'Video Stream Feeds',
  },
  {
    id: 'DEPT-04',
    name: 'Rajkot Smart City (RUDA) Hub',
    sector: 'Municipal & Smart City',
    status: 'SIMULATED CONNECTED',
    protocol: 'REST / JSON',
    cameraCount: 2800,
    throughputRps: 160,
    latencyMs: 26,
    lastSync: '15s ago',
    contactDept: 'RUDA IT Division',
    purpose: 'Saurashtra urban command hub surveillance.',
    dataCategory: 'Video Stream Feeds',
  },
  {
    id: 'DEPT-05',
    name: 'Gandhinagar Smart City Net',
    sector: 'Municipal & Smart City',
    status: 'SIMULATED CONNECTED',
    protocol: 'MQTT Stream',
    cameraCount: 2100,
    throughputRps: 180,
    latencyMs: 14,
    lastSync: '3s ago',
    contactDept: 'GMC IT Division',
    purpose: 'State capital security and secretariat perimeter control.',
    dataCategory: 'Video Stream Feeds',
  },
  {
    id: 'DEPT-06',
    name: 'Gujarat State Road Transport (GSRTC)',
    sector: 'Transport & Corridors',
    status: 'SIMULATED CONNECTED',
    protocol: 'MQTT Stream',
    cameraCount: 3400,
    throughputRps: 210,
    latencyMs: 32,
    lastSync: '6s ago',
    contactDept: 'GSRTC Central Control',
    purpose: 'Bus depot security and public passenger safety.',
    dataCategory: 'Depot & Terminal Video',
  },
  {
    id: 'DEPT-07',
    name: 'Roads & Buildings Dept (State Highways)',
    sector: 'Transport & Corridors',
    status: 'SIMULATED CONNECTED',
    protocol: 'REST / JSON',
    cameraCount: 5200,
    throughputRps: 310,
    latencyMs: 28,
    lastSync: '11s ago',
    contactDept: 'R&BD Highway Division',
    purpose: 'Inter-district highway corridor surveillance.',
    dataCategory: 'Highway Video & ANPR',
  },
  {
    id: 'DEPT-08',
    name: 'NHAI Gujarat Toll Network (FASTag ANPR)',
    sector: 'Transport & Corridors',
    status: 'SIMULATED CONNECTED',
    protocol: 'REST / JSON',
    cameraCount: 1600,
    throughputRps: 450,
    latencyMs: 22,
    lastSync: '5s ago',
    contactDept: 'NHAI Regional Office',
    purpose: 'National highway toll plaza vehicle detection.',
    dataCategory: 'Toll ANPR Telemetry',
  },
  {
    id: 'DEPT-09',
    name: 'Gujarat Maritime Board (Ports & Coastal)',
    sector: 'Transport & Corridors',
    status: 'SIMULATED CONNECTED',
    protocol: 'RTSP Proxy',
    cameraCount: 2400,
    throughputRps: 130,
    latencyMs: 36,
    lastSync: '18s ago',
    contactDept: 'GMB Marine Operations',
    purpose: '1,600 km coastline port perimeter security.',
    dataCategory: 'Coastal Sensor Feeds',
  },
  {
    id: 'DEPT-10',
    name: 'State Emergency Operation Center (SEOC)',
    sector: 'Critical Infrastructure',
    status: 'SIMULATED CONNECTED',
    protocol: 'REST / JSON',
    cameraCount: 1200,
    throughputRps: 95,
    latencyMs: 20,
    lastSync: '8s ago',
    contactDept: 'GSDMA Disaster Management',
    purpose: 'Disaster monitoring and cyclone/flood emergency feeds.',
    dataCategory: 'Emergency Feeds',
  },
  {
    id: 'DEPT-11',
    name: 'Forest Dept (Gir Corridor Net)',
    sector: 'Critical Infrastructure',
    status: 'SIMULATED CONNECTED',
    protocol: 'MQTT Stream',
    cameraCount: 950,
    throughputRps: 48,
    latencyMs: 54,
    lastSync: '42s ago',
    contactDept: 'PCCF Wildlife Wing',
    purpose: 'Wildlife conservation buffer and anti-poaching security.',
    dataCategory: 'Forest Perimeter Feeds',
  },
  {
    id: 'DEPT-12',
    name: 'GETCO Power Grid Security Net',
    sector: 'Critical Infrastructure',
    status: 'PENDING',
    protocol: 'MQTT Stream',
    cameraCount: 1450,
    throughputRps: 0,
    latencyMs: 0,
    lastSync: 'Network Testing',
    contactDept: 'GETCO Transmission',
    purpose: 'High-voltage substation perimeter surveillance.',
    dataCategory: 'Substation Feeds',
  },
  {
    id: 'DEPT-13',
    name: 'GIDC Industrial Estates Security Net',
    sector: 'Critical Infrastructure',
    status: 'PENDING',
    protocol: 'REST / JSON',
    cameraCount: 2100,
    throughputRps: 0,
    latencyMs: 0,
    lastSync: 'MoU Review',
    contactDept: 'GIDC Head Office',
    purpose: 'Industrial estate zone surveillance.',
    dataCategory: 'Industrial Feeds',
  },
  {
    id: 'DEPT-14',
    name: 'Mines & Minerals Vigilance Net',
    sector: 'Critical Infrastructure',
    status: 'NOT ONBOARDED',
    protocol: 'REST / JSON',
    cameraCount: 650,
    throughputRps: 0,
    latencyMs: 0,
    lastSync: 'Not Connected',
    contactDept: 'Industries & Mines',
    purpose: 'Mineral checkpost weighbridge tracking.',
    dataCategory: 'Mining Checkpoints',
  },
];

// Predefined Demo Roles
export const DEMO_ROLES: Record<UserRole, {
  title: string;
  badge: string;
  badgeColor: string;
  subtitle: string;
  districtFocus: string;
  description: string;
  primaryFocus: string;
  permissions: string[];
}> = {
  operator: {
    title: 'Control Room Operator',
    badge: 'OPR-ALPHA-12',
    badgeColor: 'bg-blue-950 text-blue-300 border-blue-800',
    subtitle: 'City / District Command Room Console',
    districtFocus: 'Ahmedabad Urban Operations',
    description: 'Front-line dispatch interface prioritized for rapid alert verification, camera telemetry check, and tactical PCR assignment.',
    primaryFocus: 'Live Alerts • Camera Status • Incident Investigation',
    permissions: [
      'Live Incident Center Triage & Acknowledgment',
      'Camera Video Status & Health Diagnostic Pings',
      'Tactical PCR Patrol Dispatch Assignment',
      'Initial Incident Note Logging',
    ],
  },
  sp: {
    title: 'District SP (Superintendent)',
    badge: 'SP-EXEC-004',
    badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
    subtitle: 'District HQ Executive Command Console',
    districtFocus: 'District Jurisdictional Scope',
    description: 'Supervisory command interface focused on district-level incident patterns, cross-district vehicle interception, and O&M work-order signoffs.',
    primaryFocus: 'District Incidents • Cross-District Tracking • Investigation',
    permissions: [
      'All Operator Privileges with Override Authority',
      'Cross-District Vehicle Interception Approval',
      'O&M Maintenance Work Order Authorization',
      'Evidentiary Bundle Digital Sealing (Sec. 65B)',
      'Vendor SLA Performance Monitoring',
    ],
  },
  admin: {
    title: 'State Admin (DGP Command)',
    badge: 'STATE-DGP-001',
    badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
    subtitle: 'Gujarat State Police Headquarters, Gandhinagar',
    districtFocus: 'Statewide 33-District Oversight',
    description: 'Executive governance interface providing complete statewide visibility, 26-department federation monitoring, and forensic blockchain integrity verification.',
    primaryFocus: 'Statewide KPIs • Department Integration • Network Health • Performance',
    permissions: [
      'Unrestricted Statewide GIS & Sensor Oversight',
      'Layer 2 Department Federation Gateway Management',
      'Forensic Blockchain Cryptographic Verification',
      'Cross-District Route Reconstruction Engine',
      'Automated Stakeholder Presentation Mode',
    ],
  },
};
