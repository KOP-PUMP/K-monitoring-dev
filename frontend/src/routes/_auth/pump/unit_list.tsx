import { createFileRoute } from '@tanstack/react-router'
import { UnitTable } from '@/components/UnitList'


export const Route = createFileRoute('/_auth/pump/unit_list')({
  component: UnitTable
})