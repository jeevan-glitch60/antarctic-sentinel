import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StationProvider } from './context/StationContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { CommandCenterPage } from './pages/CommandCenterPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { TelemetryPage } from './pages/TelemetryPage';
import { AlertsPage } from './pages/AlertsPage';
import { ConnectivityPage } from './pages/ConnectivityPage';
import { ImpactEnginePage } from './pages/ImpactEnginePage';
import { SimulationPage } from './pages/SimulationPage';
import { RecoveryPlannerPage } from './pages/RecoveryPlannerPage';
import { EnergyPage } from './pages/EnergyPage';
import { EnvironmentPage } from './pages/EnvironmentPage';
import { LogisticsPage } from './pages/LogisticsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { MethodsPage } from './pages/MethodsPage';
import { SecurityPage } from './pages/SecurityPage';
import { SettingsPage } from './pages/SettingsPage';

// 9 New Pages (16–24)
import { SimulationLabPage } from './pages/SimulationLabPage';
import { SubsystemPhysicsPage } from './pages/SubsystemPhysicsPage';
import { CoupledSystemsPage } from './pages/CoupledSystemsPage';
import { MaintenanceLifecyclePage } from './pages/MaintenanceLifecyclePage';
import { CrewOperationsPage } from './pages/CrewOperationsPage';
import { SciencePayloadPage } from './pages/SciencePayloadPage';
import { GeographicRemoteSensingPage } from './pages/GeographicRemoteSensingPage';
import { MultiStationCoordinationPage } from './pages/MultiStationCoordinationPage';
import { ReportGeneratorPage } from './pages/ReportGeneratorPage';

export function App() {
  return (
    <StationProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing / Mission Gateway */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="dashboard" element={<CommandCenterPage />} />
            <Route path="digital-twin" element={<DigitalTwinPage />} />
            <Route path="telemetry" element={<TelemetryPage />} />
            <Route path="alerts" element={<AlertsPage />} />
            <Route path="connectivity" element={<ConnectivityPage />} />
            <Route path="impact" element={<ImpactEnginePage />} />
            <Route path="simulation" element={<SimulationPage />} />
            <Route path="recovery" element={<RecoveryPlannerPage />} />
            <Route path="energy" element={<EnergyPage />} />
            <Route path="environment" element={<EnvironmentPage />} />
            <Route path="logistics" element={<LogisticsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="methods" element={<MethodsPage />} />
            <Route path="security" element={<SecurityPage />} />
            <Route path="settings" element={<SettingsPage />} />

            {/* Part 1: Pages 16–24 */}
            <Route path="simulation-lab" element={<SimulationLabPage />} />
            <Route path="physics" element={<SubsystemPhysicsPage />} />
            <Route path="coupled" element={<CoupledSystemsPage />} />
            <Route path="lifecycle" element={<MaintenanceLifecyclePage />} />
            <Route path="crew" element={<CrewOperationsPage />} />
            <Route path="science" element={<SciencePayloadPage />} />
            <Route path="geo" element={<GeographicRemoteSensingPage />} />
            <Route path="coordination" element={<MultiStationCoordinationPage />} />
            <Route path="reports" element={<ReportGeneratorPage />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StationProvider>
  );
}

export default App;
