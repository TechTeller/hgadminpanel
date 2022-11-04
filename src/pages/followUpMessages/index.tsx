import AdminList from "../../components/AdminList"

const FollowUpAdminList = () => {
  // TODO get data from API
  return (
    <AdminList
      columnProps={[
        { fieldName: 'title', headerName: 'Title' },
        { fieldName: 'message', headerName: 'Message' }
      ]}
      rowData={[{ "id": 5, "title": "Test Message", "message": "Please remember to remove this placeholder" }]}
      slug="followUps"
      title="Follow Up Messages"
    />
  )
}

export default FollowUpAdminList
