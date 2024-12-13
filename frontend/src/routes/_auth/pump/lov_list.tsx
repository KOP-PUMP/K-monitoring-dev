import { createFileRoute } from '@tanstack/react-router'
import { LOVTable } from '@/components/LOVList'

export const Route = createFileRoute('/_auth/pump/lov_list')({
  component: LOVTable
})