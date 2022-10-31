import type { NextPage } from "next"
import Layout from "../components/Layout"
// import { trpc } from "../utils/trpc"

const Home: NextPage = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center gap-2 my-8">
        <h1 className="text-4xl font-bold leading-normal md:text-[3rem] mb-4">
          HealthyGamerBot Admin Panel
        </h1>
        <p className="text-2xl">Placeholder</p>
        <div className="">
          {/* TODO table of items */}
        </div>
      </div>
    </Layout >
  )
}


export default Home

