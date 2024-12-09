import { createFileRoute } from '@tanstack/react-router'
import { DataListEdit } from '@/components/DataListEdit'

export const Route = createFileRoute('/_auth/pump/list_edit')({
  component: DataListEdit
})