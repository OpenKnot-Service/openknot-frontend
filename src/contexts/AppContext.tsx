import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { User, Project, Task, Notification } from '../types';
import { mockProjects, mockTasks, mockNotifications } from '../lib/mockData';
import {
  ApiError,
  fetchCurrentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  storeAccessToken,
  getStoredAccessToken,
} from '../lib/apiClient';

interface AppContextType {
  user: User | null;
  accessToken: string | null;
  isUserLoading: boolean;
  projects: Project[];
  tasks: Task[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  addProject: (project: Project) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(() => getStoredAccessToken());
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false);

  const saveAccessToken = useCallback((token: string | null) => {
    setAccessToken(token);
    storeAccessToken(token);
  }, []);

  const loadUser = useCallback(async (): Promise<User | null> => {
    if (!accessToken) {
      setUser(null);
      setIsUserLoading(false);
      return null;
    }

    setIsUserLoading(true);

    try {
      const profile = await fetchCurrentUser();
      setUser(profile);
      return profile;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        try {
          const refreshed = await refreshAccessToken();
          saveAccessToken(refreshed.accessToken);
          const profile = await fetchCurrentUser();
          setUser(profile);
          return profile;
        } catch (refreshError) {
          console.error('Failed to refresh session', refreshError);
          saveAccessToken(null);
          setUser(null);
        }
      } else {
        console.error('Failed to load user profile', error);
      }
      return null;
    } finally {
      setIsUserLoading(false);
    }
  }, [accessToken, saveAccessToken]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const auth = await loginUser({ email, password });
      saveAccessToken(auth.accessToken);
      const profile = await fetchCurrentUser();
      setUser(profile);
      return profile;
    },
    [saveAccessToken]
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      saveAccessToken(null);
      setUser(null);
    }
  }, [saveAccessToken]);

  const refreshUser = useCallback(async () => {
    if (!accessToken) {
      return null;
    }
    return loadUser();
  }, [accessToken, loadUser]);

  const unreadNotificationsCount = useMemo(
    () =>
      user
        ? notifications.filter((notification) => notification.userId === user.id && !notification.read)
            .length
        : 0,
    [notifications, user]
  );

  const addProject = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const addTask = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    if (!user) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === user.id ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        accessToken,
        isUserLoading,
        projects,
        tasks,
        notifications,
        unreadNotificationsCount,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        login,
        logout,
        refreshUser,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
