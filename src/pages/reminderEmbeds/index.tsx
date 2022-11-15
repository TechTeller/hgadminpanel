import AdminList from "@/components/AdminList";
import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";

const ReminderEmbedAdminList = () => {
  const res = trpc.reminderEmbed.getAll.useQuery();
  return (
    <Layout>
      <AdminList
        columnProps={[
          { fieldName: "header", headerName: "Title" },
          { fieldName: "description", headerName: "Message" },
        ]}
        rowData={res.data ?? []}
        slug="reminderEmbeds"
        title="Reminder Embeds"
      />
    </Layout>
  );
};

export default ReminderEmbedAdminList;
