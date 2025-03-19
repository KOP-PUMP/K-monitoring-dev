import { createFileRoute } from '@tanstack/react-router'
import { useGetMotorDetailLOV } from '@/hook/pump/pump'

const MotorTable = () => {
  const {data : motorData} = useGetMotorDetailLOV("")
  console.log(motorData)

  return <div>Hello /_auth/pump/motor_detail_lov!</div>
}

export const Route = createFileRoute('/_auth/pump/motor_lov_list')({
  component: MotorTable
})