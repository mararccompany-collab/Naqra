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

const LoadingSpinner: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-6">
    <div className="text-center animate-fade bg-white p-12 rounded-3xl shadow-xl max-w-md">
      <div className="text-6xl mb-6 animate-pulse">🌐</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">جاري التحميل...</h2>
      <p className="text-gray-500">الرجاء الانتظار</p>
    </div>
  </div>
);

const AppContent: React.FC = () => {
  const { currentPage, isLoading } = useApp();

  if (isLoading) return <LoadingSpinner />;

  switch (currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'admin-login':
      return <AdminLoginPage />;
    case 'dashboard':
      return <Dashboard />;
    case 'create-site':
      return <CreateSite />;
    case 'edit-site':
      return <EditSite />;
    case 'site-settings':
      return <SiteSettings />;
    case 'analytics':
      return <Analytics />;
    case 'admin':
      return <AdminPanel />;
    case 'view-site':
      return <SiteViewer />;
    default:
      return <LandingPage />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
