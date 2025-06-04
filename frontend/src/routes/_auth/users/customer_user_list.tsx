import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/users/customer_user_list')({
  component: () => <div>Hello /_auth/users/customer_user/list!</div>
})