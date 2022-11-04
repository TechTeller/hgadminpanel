import { Box, Button } from "@mui/material"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "../../components/Layout"
import StyledTextField from "../../components/StyledTextField"
import { trpc } from "../../utils/trpc"


const ReminderFormPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const res = trpc.channelReminder.findById.useQuery({ id })
  const { header, description } = res.data || { header: "", description: "" }

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/channelReminders">{"< Back to list page"}</Link>
      </Box>
      <Box className="w-full p-1 flex">
        <Box className="flex flex-col flex-1 m-4 p-4 bg-slate-600 gap-4">
          <Box className="">
            <StyledTextField label="Title" value={header} />
          </Box>
          <Box className="">
            <StyledTextField label="Message" value={description} multiline />
          </Box>
          <Box className="">
            <Button variant="contained">Save</Button>
          </Box>
        </Box>
      </Box>
    </Layout>
  )
}

export default ReminderFormPage
