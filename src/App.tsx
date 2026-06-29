import React from 'react';
import { AppProvider, useApp } from './store';
import LandingPage from './components/LandingPage';
import { LoginPage, RegisterPage, AdminLoginPage } from './components/AuthPages';
import Dashboard from './components/Dashboard';
import CreateSite from './components/CreateSite';
import EditSite from './components/EditSite';
import SiteSettings from './components/SiteSettings';
import Analytics from './components/Analytics';
import AdminPanel from './components/AdminPanel';
import SiteViewer from './components/SiteViewer';

const AppContent: React.FC = () => {
  const { currentPage } = useApp();
  switch (currentPage) {
    case 'view-site': return <SiteViewer />;
    case 'login': return <LoginPage />;
    case 'register': return <RegisterPage />;
    case 'admin-login': return <AdminLoginPage />;
    case 'dashboard': return <Dashboard />;
    case 'create-site': return <CreateSite />;
    case 'edit-site': return <EditSite />;
    case 'site-settings': return <SiteSettings />;
    case 'analytics': return <Analytics />;
    case 'admin': return <AdminPanel />;
    default: return <LandingPage />;
  }
};

const App: React.FC = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
