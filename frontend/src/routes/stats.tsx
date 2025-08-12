import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { StatsPage } from '../components/dashboard/StatsPage'

export const Route = createFileRoute('/stats')({
  component: Stats,
})

function Stats() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return (
    <DashboardLayout>
      <StatsPage />
    </DashboardLayout>
  )
}
