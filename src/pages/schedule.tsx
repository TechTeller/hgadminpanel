import { Box, Button, TextField } from "@mui/material"
import Link from "next/link"
import Layout from "@/components/Layout"
import { trpc } from "@/utils/trpc"
import { ChangeEvent, useState } from "react"


const ScheduleFormPage = () => {
  const [streamTopic, setStreamTopic] = useState("")

  const res = trpc.schedule.get.useQuery(undefined, {
    onSuccess: (data) => {
      const { value: dataStreamTopic } = data
      setStreamTopic(dataStreamTopic)
    }
  })

  const submitMutation = trpc.schedule.update.useMutation({ onSuccess: () => res.refetch() })

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault()
    submitMutation.mutate({ streamTopic })
  }

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/">{"< Back to main page"}</Link>
      </Box>
      <Box className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex flex-col flex-1 w-full p-4 bg-slate-600 gap-4">
            <TextField
              label="StreamTopic"
              value={streamTopic}
              onChange={(event: ChangeEvent<any>) => setStreamTopic(event.target.value)}
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
            <Button type="submit" variant="contained">Save</Button>
          </Box>
        </form>
      </Box>
    </Layout>
  )
}

export default ScheduleFormPage
