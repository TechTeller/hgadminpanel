import AdminList from "@/components/AdminList"
import Layout from "@/components/Layout"
import { trpc } from "@/utils/trpc"

const FollowUpAdminList = () => {
  const res = trpc.discordUsers.getAll.useQuery()
  return (
    <Layout>
      <AdminList
        columnProps={[
          { fieldName: 'username', headerName: 'Username' },
          { fieldName: 'roles', headerName: 'Roles'}
        ]}
        rowData={res.data ?? []}
        slug="discordUsers"
        title="Discord Users"
      />
    </Layout>
  )
}


export default FollowUpAdminList
