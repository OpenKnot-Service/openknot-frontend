import { Navigate, useLocation } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isUserLoading } = useApp()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">인증 확인 중...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!user) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`} replace />
  }

  // User is authenticated, render the protected content
  return <>{children}</>
}
