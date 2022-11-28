import { NextPage } from "next";
import AdminList from "@/components/AdminList";
import Layout from "@/components/Layout";

const ChannelReminderAdminList: NextPage = () => {
  return (
    <Layout>
      <AdminList
        columnProps={[
          { source: "channelName", label: "Channel" },
          { source: "message_interval", label: "Message Interval" },
          { source: "embedName", label: "Embed" },
        ]}
        slug="channelReminders"
        title="Channel Reminders"
      />
    </Layout>
  );
};

export default ChannelReminderAdminList;
