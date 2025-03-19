import { createFileRoute } from '@tanstack/react-router'
import { useGetMatDetailLOV } from '@/hook/pump/pump'

const MaterialTable = () => {
  const { data : materialData} = useGetMatDetailLOV("")
  console.log(materialData)
  return <div>Hello /_auth/pump/material_lov_list!</div>
}
 
export const Route = createFileRoute('/_auth/pump/material_lov_list')({
  component: MaterialTable
})