import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/analytic/report')({
  component: () => <div>Hello /_auth/analytic/report!</div>
})