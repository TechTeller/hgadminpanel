import { Box, Button, TextField } from "@mui/material"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "@/components/Layout"
import { trpc } from "@/utils/trpc"
import { ChangeEvent, useState } from "react"


const ReminderFormPage = () => {
  const router = useRouter()
  const id = router.query.id as string
  const [header, setHeader] = useState("")
  const [description, setDescription] = useState("")

  const res = trpc.channelReminder.findById.useQuery({ id }, {
    onSuccess: (data) => {
      const { header: dataHeader, description: dataDescription } = data
      setHeader(dataHeader)
      setDescription(dataDescription)
    }
  })

  const submitMutation = trpc.channelReminder.updateOne.useMutation({ onSuccess: () => res.refetch() })

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault()
    submitMutation.mutate({ id, header, description })
  }

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/channelReminders">{"< Back to list page"}</Link>
      </Box>
      <Box className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex flex-col flex-1 w-full p-4 bg-slate-600 gap-4">
            <TextField
              label="Title"
              value={header}
              onChange={(event: ChangeEvent<any>) => setHeader(event.target.value)}
              fullWidth
              id="filled-input"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              inputProps={{ 'aria-label': 'embed-header' }}
              sx={{
                backgroundColor: '#334155',
                color: '#f1f5f9',
                '& #filled-input': {
                  color: '#f1f5f9',
                },
                '& #filled-input-label': {
                  color: '#f1f5f9',
                },
              }}
            />
            <TextField
              label="Message"
              value={description}
              onChange={(event: ChangeEvent<any>) => setDescription(event.target.value)}
              multiline
              rows={4}
              fullWidth
              id="filled-multiline-static"
              variant="filled"
              InputLabelProps={{ shrink: true }}
              inputProps={{ 'aria-label': 'embed-description' }}
              sx={{
                backgroundColor: '#334155',
                color: '#f1f5f9',
                '& #filled-multiline-static': {
                  color: '#f1f5f9',
                },
                '& #filled-multiline-static-label': {
                  color: '#f1f5f9',
                },
              }}
            />
            <Button type="submit" variant="contained">Save</Button>
          </Box>
        </form>
      </Box>
    </Layout>
  )
}

export default ReminderFormPage
