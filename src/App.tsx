import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';
import MainLayout from './components/layout/MainLayout';
import ProjectLayout from './components/layout/ProjectLayout';
import ErrorBoundary from './components/ui/ErrorBoundary';
import DashboardSkeleton from './components/ui/skeletons/DashboardSkeleton';
import PWAInstallPrompt from './components/ui/PWAInstallPrompt';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const ProjectSettingsPage = lazy(() => import('./pages/ProjectSettingsPage'));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage'));
const GitHubPage = lazy(() => import('./pages/GitHubPage'));
const DeploymentPage = lazy(() => import('./pages/DeploymentPage'));
const MonitoringPage = lazy(() => import('./pages/MonitoringPage'));
const SecurityPage = lazy(() => import('./pages/SecurityPage'));
const CreateProjectPage = lazy(() => import('./pages/CreateProjectPage'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AppProvider>
            <BrowserRouter>
              <Suspense fallback={<DashboardSkeleton />}>
                <Routes>
                  {/* Onboarding Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/pricing" element={<PricingPage />} />

                  {/* Auth Pages */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* App Pages */}
                  <Route element={<MainLayout />}>
                    <Route path="/dashboard" element={<DashboardPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/projects/new" element={<CreateProjectPage />} />
                    <Route path="/projects/:id" element={<ProjectLayout />}>
                      <Route index element={<ProjectDetailPage />} />
                      <Route path="github" element={<GitHubPage />} />
                      <Route path="deployment" element={<DeploymentPage />} />
                      <Route path="monitoring" element={<MonitoringPage />} />
                      <Route path="security" element={<SecurityPage />} />
                      <Route path="settings" element={<ProjectSettingsPage />} />
                    </Route>
                    <Route path="/tasks/:id" element={<TaskDetailPage />} />
                    <Route path="/explore" element={<ExplorePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                  </Route>

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
              <ToastContainer />
              <PWAInstallPrompt />
            </BrowserRouter>
          </AppProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
