import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Camera, Alert, AlertStatus, WorkOrder, TrackingScenario, AuditBlock } from '../types';
import {
  generateCameras,
  generateInitialAlerts,
  generateSyntheticAlert,
  generateInitialWorkOrders,
  TRACKING_SCENARIOS,
} from '../services/mockDataService';
import {
  generateInitialLedger,
  appendBlock,
  verifyChainIntegrity,
  VerificationResult,
} from '../services/blockchainService';
import { useRole } from './RoleContext';

interface AppContextType {
  cameras: Camera[];
  alerts: Alert[];
  workOrders: WorkOrder[];
  ledger: AuditBlock[];
  isFeedPaused: boolean;
  toggleFeedPause: () => void;
  selectedAlert: Alert | null;
  setSelectedAlert: (alert: Alert | null) => void;
  selectedCamera: Camera | null;
  setSelectedCamera: (camera: Camera | null) => void;
  activeScenario: TrackingScenario;
  setActiveScenario: (scenario: TrackingScenario) => void;
  updateAlertStatus: (alertId: string, newStatus: AlertStatus, note?: string) => Promise<void>;
  addWorkOrder: (newWo: Omit<WorkOrder, 'id' | 'createdAt'>) => Promise<void>;
  exportEvidence: (alert: Alert) => Promise<void>;
  currentScreen: string;
  setCurrentScreen: (screen: string) => void;
  isPresentationMode: boolean;
  togglePresentationMode: () => void;
  verificationStatus: VerificationResult | null;
  isVerifyingLedger: boolean;
  runLedgerVerification: () => Promise<VerificationResult>;
  injectLedgerTamper: () => void;
  repairLedger: () => Promise<void>;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { roleConfig } = useRole();
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [ledger, setLedger] = useState<AuditBlock[]>([]);
  const [isFeedPaused, setIsFeedPaused] = useState<boolean>(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [activeScenario, setActiveScenario] = useState<TrackingScenario>(TRACKING_SCENARIOS[0]);
  const [currentScreen, setCurrentScreen] = useState<string>('dashboard');
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationResult | null>(null);
  const [isVerifyingLedger, setIsVerifyingLedger] = useState<boolean>(false);
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setThemeState(nextTheme);
    try {
      localStorage.setItem('apex_theme', nextTheme);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('apex_theme') as 'light' | 'dark';
      if (saved === 'dark' || saved === 'light') {
        setThemeState(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const camerasRef = useRef<Camera[]>([]);
  camerasRef.current = cameras;

  // Initialize data on mount
  useEffect(() => {
    const cams = generateCameras();
    setCameras(cams);
    camerasRef.current = cams;

    const initialAlerts = generateInitialAlerts(cams);
    setAlerts(initialAlerts);
    setSelectedAlert(initialAlerts[0] || null);

    setWorkOrders(generateInitialWorkOrders());

    generateInitialLedger().then((initialChain) => {
      setLedger(initialChain);
    });
  }, []);

  // Alert generation stream (runs every 6 seconds if feed is not paused)
  useEffect(() => {
    if (isFeedPaused) return;

    const timer = setInterval(() => {
      if (camerasRef.current.length === 0) return;

      const newAlert = generateSyntheticAlert(camerasRef.current);
      setAlerts((prev) => {
        const next = [newAlert, ...prev];
        // Cap feed at 45 visible records
        return next.slice(0, 45);
      });
    }, 6000);

    return () => clearInterval(timer);
  }, [isFeedPaused]);

  // Presentation Mode Carousel (cycles through the 6 requested screens every 20 seconds)
  useEffect(() => {
    if (!isPresentationMode) return;

    const sequence = ['dashboard', 'alerts', 'tracking', 'audit', 'architecture', 'about'];
    const interval = setInterval(() => {
      setCurrentScreen((prev) => {
        const idx = sequence.indexOf(prev);
        const nextIdx = idx === -1 || idx === sequence.length - 1 ? 0 : idx + 1;
        return sequence[nextIdx];
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [isPresentationMode]);

  const toggleFeedPause = () => {
    setIsFeedPaused((prev) => !prev);
  };

  const togglePresentationMode = () => {
    setIsPresentationMode((prev) => !prev);
  };

  const updateAlertStatus = async (alertId: string, newStatus: AlertStatus, note?: string) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    const defaultNote =
      newStatus === 'Acknowledged'
        ? 'Visual signature checked by console operator.'
        : newStatus === 'Dispatched'
        ? 'PCR Patrol Unit assigned for immediate physical verification.'
        : 'Incident verified and closed with standard synthetic disposition report.';

    setAlerts((prev) =>
      prev.map((a) => {
        if (a.id === alertId) {
          const updatedAlert: Alert = {
            ...a,
            status: newStatus,
            timeline: [
              ...a.timeline,
              {
                status: newStatus,
                timestamp: `${timestamp} (${roleConfig.title})`,
                actor: roleConfig.badge,
                note: note || defaultNote,
              },
            ],
          };
          if (selectedAlert?.id === alertId) {
            setSelectedAlert(updatedAlert);
          }
          return updatedAlert;
        }
        return a;
      })
    );

    // Record into cryptographic audit ledger
    if (newStatus === 'Dispatched' || newStatus === 'Resolved') {
      const updatedLedger = await appendBlock(ledger, {
        actorRole: roleConfig.title,
        actorId: roleConfig.badge,
        action: 'ALERT_DISPATCH',
        details: `Incident ${alertId} transitioned to ${newStatus}. Disposition: ${note || defaultNote}`,
      });
      setLedger(updatedLedger);
    }
  };

  const addWorkOrder = async (newWo: Omit<WorkOrder, 'id' | 'createdAt'>) => {
    const id = `SIM-WO-2026-${Math.floor(200 + Math.random() * 800)}`;
    const now = new Date();
    const createdAt = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
    const wo: WorkOrder = {
      ...newWo,
      id,
      createdAt,
    };

    setWorkOrders((prev) => [wo, ...prev]);

    // Append to audit ledger
    const updatedLedger = await appendBlock(ledger, {
      actorRole: roleConfig.title,
      actorId: roleConfig.badge,
      action: 'WORK_ORDER_ISSUED',
      details: `Work Order ${id} created for ${newWo.cameraId} (${newWo.district}): ${newWo.issue}`,
    });
    setLedger(updatedLedger);
  };

  const exportEvidence = async (alert: Alert) => {
    const updatedLedger = await appendBlock(ledger, {
      actorRole: roleConfig.title,
      actorId: roleConfig.badge,
      action: 'EVIDENCE_EXPORT',
      details: `Forensic evidence package generated for incident ${alert.id} (${alert.type}) at ${alert.locationName}.`,
    });
    setLedger(updatedLedger);
  };

  const runLedgerVerification = async (): Promise<VerificationResult> => {
    setIsVerifyingLedger(true);
    await new Promise((r) => setTimeout(r, 450));
    const result = await verifyChainIntegrity(ledger);
    setVerificationStatus(result);
    setIsVerifyingLedger(false);
    return result;
  };

  const injectLedgerTamper = () => {
    if (ledger.length < 3) return;
    setLedger((prev) => {
      return prev.map((block, idx) => {
        if (idx === 2) {
          return {
            ...block,
            details: 'TAMPERED RECORD: Unauthorized alteration of vehicle dispatch log!',
          };
        }
        return block;
      });
    });
    setVerificationStatus(null);
  };

  const repairLedger = async () => {
    const freshLedger = await generateInitialLedger();
    setLedger(freshLedger);
    setVerificationStatus(null);
  };

  return (
    <AppContext.Provider
      value={{
        cameras,
        alerts,
        workOrders,
        ledger,
        isFeedPaused,
        toggleFeedPause,
        selectedAlert,
        setSelectedAlert,
        selectedCamera,
        setSelectedCamera,
        activeScenario,
        setActiveScenario,
        updateAlertStatus,
        addWorkOrder,
        exportEvidence,
        currentScreen,
        setCurrentScreen,
        isPresentationMode,
        togglePresentationMode,
        verificationStatus,
        isVerifyingLedger,
        runLedgerVerification,
        injectLedgerTamper,
        repairLedger,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
