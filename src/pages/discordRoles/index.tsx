import type { NextPage } from "next";
import AdminList from "@/components/AdminList";
import Layout from "@/components/Layout";
import { trpc } from "@/utils/trpc";

const FollowUpAdminList: NextPage = () => {
  const res = trpc.discordRole.getAll.useQuery();
  return (
    <Layout>
      <AdminList
        columnProps={[
          { fieldName: "name", headerName: "Name" },
          { fieldName: "snowflake", headerName: "Discord Snowflake" },
          { fieldName: "type", headerName: "Type" },
        ]}
        rowData={res.data ?? []}
        slug="discordRoles"
        title="Admin Roles (Discord)"
      />
    </Layout>
  );
};

export default FollowUpAdminList;
