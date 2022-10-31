import AdminList from "../../components/AdminList"

const ChannelReminderAdminList = () => {
  // TODO get data from API
  return (
    <AdminList
      columnProps={[
        { fieldName: 'title', headerName: 'Title' },
        { fieldName: 'message', headerName: 'Message' }
      ]}
      rowData={[{ "id": 5, "title": "Test Message", "message": "Please remember to remove this placeholder" }]}
      slug="channelReminders"
      title="Channel Reminders"
    />
  )
}

export default ChannelReminderAdminList
