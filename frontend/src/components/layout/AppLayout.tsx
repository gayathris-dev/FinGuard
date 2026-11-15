import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { NotificationDrawer } from '../notifications/NotificationDrawer';

interface AppLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onSelectTab,
  children
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [dateRange, setDateRange] = useState('30d');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex font-sans">
      {/* FinGuard AI Persistent Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Container */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'ml-16' : 'ml-64'
        }`}
      >
        {/* Top Bar */}
        <TopNav
          currentTab={currentTab}
          dateRange={dateRange}
          onChangeDateRange={setDateRange}
          sidebarCollapsed={collapsed}
        />

        {/* Dynamic Content Body */}
        <main className="flex-1 mt-12 p-5 lg:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Notification Drawer */}
      <NotificationDrawer />
    </div>
  );
};
