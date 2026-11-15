import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Overview } from './pages/Overview';
import { FraudDetection } from './pages/FraudDetection';
import { CreditRisk } from './pages/CreditRisk';
import { TransactionMonitoring } from './pages/TransactionMonitoring';
import { MarketSentiment } from './pages/MarketSentiment';
import { AnomalyDetection } from './pages/AnomalyDetection';
import { RiskIntelligence } from './pages/RiskIntelligence';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const MainApp: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('overview');

  if (!isAuthenticated) {
    return <Login onSuccess={() => setCurrentTab('overview')} />;
  }

  const renderActiveModule = () => {
    switch (currentTab) {
      case 'overview':
        return <Overview onNavigateToModule={setCurrentTab} />;
      case 'fraud':
        return <FraudDetection />;
      case 'credit':
        return <CreditRisk />;
      case 'monitoring':
        return <TransactionMonitoring />;
      case 'sentiment':
        return <MarketSentiment />;
      case 'anomaly':
        return <AnomalyDetection />;
      case 'intelligence':
        return <RiskIntelligence />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview onNavigateToModule={setCurrentTab} />;
    }
  };

  return (
    <AppLayout currentTab={currentTab} onSelectTab={setCurrentTab}>
      {renderActiveModule()}
    </AppLayout>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;
