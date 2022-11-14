import AdminList from "@/components/AdminList"
import Layout from "@/components/Layout"
import { trpc } from "@/utils/trpc"

const FollowUpAdminList = () => {
  const res = trpc.discordRole.getAll.useQuery()
  return (
    <Layout>
      <AdminList
        columnProps={[
          { fieldName: 'name', headerName: 'Role or User Name' },
          { fieldName: 'discordId', headerName: 'Role ID' },
        ]}
        rowData={res.data ?? []}
        slug="discordRoles"
        title="Admin Roles (Discord)"
      />
    </Layout>
  )
}


export default FollowUpAdminList
