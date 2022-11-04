import AdminList from "../../components/AdminList"
import Layout from "../../components/Layout"
import { trpc } from "../../utils/trpc"


const ChannelReminderAdminList = () => {
  const res = trpc.channelReminder.getAll.useQuery()
  console.log(res.isLoading ? "NOT YET" : res.data)
  return (
    <Layout>
      <AdminList
        columnProps={[
          { fieldName: 'header', headerName: 'Title' },
          { fieldName: 'description', headerName: 'Message' }
        ]}
        rowData={res.isLoading ? [] : (res.data ?? [])}
        slug="channelReminders"
        title="Channel Reminders"
      />
    </Layout>
  )
}

export default ChannelReminderAdminList
