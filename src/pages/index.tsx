import type { NextPage } from "next"
import Link from "next/link"
import Layout from "@/components/Layout"

interface StyledLinkProps {
  slug: string
  title: string
}

const StyledLink = ({ slug, title }: StyledLinkProps) => (
  <div className="p-2 hover:bg-slate-500 hover:text-sky-500">
    <Link href={slug}>{title}</Link>
  </div>
)

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-2 my-8">
        <h1 className="text-4xl font-bold leading-normal md:text-[3rem] mb-4">
          HealthyGamerBot Admin Panel
        </h1>
        <div className="rounded-md border border-white bg-slate-700 p-4">
          <div className="text-xl pb-4">Messages</div>
          <div className="flex flex-col bg-slate-600">
            <StyledLink slug="channelReminders/" title="Channel Reminders" />
            <StyledLink slug="followupMessages/" title="Follow Up Messages" />
            <StyledLink slug="schedule/" title="Stream Schedule" />
          </div>
          <div className="text-xl py-4">Users</div>
          <div className="flex flex-col bg-slate-600">
            <StyledLink slug="discordUsers/" title="Discord Users" />
          </div>
        </div>
      </div>
    </Layout>
  )
}


export default Home

