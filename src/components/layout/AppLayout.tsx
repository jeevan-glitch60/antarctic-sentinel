import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useStation } from '../../context/StationContext';

export const AppLayout: React.FC = () => {
  const { isRefreshing, stationData } = useStation();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)]">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative p-4 md:p-6 min-h-[calc(100vh-6.5rem)]">
          {/* Station Switch 300ms Refresh Transition Overlay */}
          {isRefreshing && (
            <div className="absolute inset-0 bg-[var(--surface)]/80 backdrop-blur-none z-20 flex items-center justify-center">
              <div className="bg-[var(--surface)] border border-[var(--border)] px-4 py-2.5 rounded shadow-sm text-center">
                <div className="text-[13px] font-mono text-[var(--accent)] font-medium">
                  RE-CALIBRATING TELEMETRY BUS · {stationData.code}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  Synchronizing {stationData.name} Sensor Arrays & Digital Twin State...
                </div>
              </div>
            </div>
          )}
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
