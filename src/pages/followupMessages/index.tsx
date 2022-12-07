import AdminList from "@/components/AdminList";
import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";

const FollowUpAdminList = () => {
  const res = trpc.followup.getAll.useQuery();
  return (
    <Layout>
      <AdminList
        columnProps={[
          { fieldName: "title", headerName: "Title" },
          { fieldName: "description", headerName: "Message" },
          { fieldName: "eventName", headerName: "Event or Tag" },
          { fieldName: "active", headerName: "Is Active" },
          { fieldName: "listeningTime", headerName: "Listening Time" },
        ]}
        rowData={res.data ?? []}
        slug="followupMessages"
        title="Follow Up Messages"
      />
    </Layout>
  );
};

export default FollowUpAdminList;
