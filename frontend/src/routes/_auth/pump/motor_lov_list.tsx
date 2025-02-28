import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/pump/motor_lov_list')({
  component: () => <div>Hello /_auth/pump/motor_detail_lov!</div>
})