import { NextPage } from "next";
import AdminList from "@/components/AdminList";
import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";

const ChannelReminderAdminList: NextPage = () => {
  const res = trpc.channelReminder.getAll.useQuery();
  return (
    <Layout>
      <AdminList
        columnProps={[
          { fieldName: "channel", headerName: "Channel" },
          { fieldName: "message_interval", headerName: "Message Interval" },
          { fieldName: "embed", headerName: "Embed" },
        ]}
        rowData={res.data ?? []}
        slug="channelReminders"
        title="Channel Reminders"
      />
    </Layout>
  );
};

export default ChannelReminderAdminList;
