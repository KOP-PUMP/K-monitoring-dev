import { createFileRoute } from '@tanstack/react-router'
import { CustomerDashboardPage } from '@/components/CustomerDashboard'

export const Route = createFileRoute('/_auth/customers/dashboard')({
  component: CustomerDashboardPage
})