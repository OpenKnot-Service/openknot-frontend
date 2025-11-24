import { Navigate } from 'react-router-dom'
import { useApp } from '@/contexts/AppContext'

interface PublicOnlyRouteProps {
  children: React.ReactNode
}

export function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const { user, isUserLoading } = useApp()

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

  // Redirect to dashboard if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  // User is not authenticated, show public page (login/register)
  return <>{children}</>
}
