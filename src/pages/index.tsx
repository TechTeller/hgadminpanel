import type { NextPage } from "next";
import Link from "next/link";
import Layout from "@/components/Layout";

interface StyledLinkProps {
  slug: string;
  title: string;
}

const StyledLink = ({ slug, title }: StyledLinkProps) => (
  <div className="p-2 hover:bg-slate-500 hover:text-sky-500">
    <Link href={slug}>{title}</Link>
  </div>
);

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="my-8 flex flex-col items-center justify-center gap-2">
        <h1 className="mb-4 text-4xl font-bold leading-normal md:text-[3rem]">
          HealthyGamerBot Admin Panel
        </h1>
        <div className="rounded-md border border-white bg-slate-700 p-4">
          <div className="flex flex-col bg-slate-600">
            <StyledLink slug="channelReminders/" title="Channel Reminders" />
            <StyledLink slug="reminderEmbeds/" title="Reminder Embeds" />
            <StyledLink slug="followupMessages/" title="Follow Up Messages" />
            <StyledLink slug="schedule/" title="Stream Schedule" />
            <StyledLink slug="discordRoles/" title="Discord Roles" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
