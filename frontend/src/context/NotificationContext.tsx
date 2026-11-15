import React, { createContext, useContext, useState, useEffect } from 'react';
import { AlertNotification } from '../types';

interface NotificationContextType {
  notifications: AlertNotification[];
  unreadCount: number;
  isOpen: boolean;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
}

const INITIAL_NOTIFICATIONS: AlertNotification[] = [
  {
    id: 'ALT-9042',
    severity: 'CRITICAL',
    title: 'Cross-Border Velocity Surge Detected',
    description: '52 high-value wire authorizations originated within 90 mins from non-domestic nodes without valid MFA.',
    affected_entities: '14 Accounts in Tier-1 Commercial Banking',
    timestamp: '8m ago',
    metric: '+245% vs baseline',
    action: 'Immediate Account Freezes & Biometrics',
    read: false
  },
  {
    id: 'ALT-8831',
    severity: 'HIGH',
    title: 'Synthetic Identity Cluster in Loan Pipeline',
    description: 'Automated bot cluster identified submitting fabricated debt-to-income documents.',
    affected_entities: '38 New Credit Applications',
    timestamp: '42m ago',
    metric: 'Anomaly score 0.94',
    action: 'Route to Senior Fraud Underwriting Review',
    read: false
  },
  {
    id: 'ALT-8520',
    severity: 'MEDIUM',
    title: 'Adverse Market Sentiment Shift',
    description: 'Financial news sentiment dropped 18 points following commercial delinquency disclosures.',
    affected_entities: 'Regional CRE Lending Portfolio',
    timestamp: '2h ago',
    metric: 'Sentiment Score -0.74',
    action: 'Adjust Collateral Haircuts by 150 Bps',
    read: false
  },
  {
    id: 'ALT-8199',
    severity: 'LOW',
    title: 'Inference Threshold Re-Calibration',
    description: 'Gradient boosting pipeline weights re-synchronized with 8.4ms latency.',
    affected_entities: 'Core Settlement Engine',
    timestamp: '4h ago',
    metric: 'Model v2.4.1 Active',
    action: 'Routine Log Verified',
    read: true
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AlertNotification[]>(INITIAL_NOTIFICATIONS);
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleDrawer = () => setIsOpen(prev => !prev);
  const closeDrawer = () => setIsOpen(false);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      isOpen,
      toggleDrawer,
      closeDrawer,
      markAsRead,
      markAllAsRead,
      dismissNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
