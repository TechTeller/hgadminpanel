import { ChangeEvent, useState } from "react"
import { Box, Button, TextField } from "@mui/material"
import { useRouter } from "next/router"
import Link from "next/link"
import Layout from "@/components/Layout"
import { trpc } from "@/utils/trpc"


const FollowupNewFormPage = () => {
  const router = useRouter()
  const { pathname } = router
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState("")

  const submitMutation = trpc.followup.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/")
  })

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault()
    submitMutation.mutate({ title, description, tag })
  }

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/followupMessages">{"< Back to list page"}</Link>
      </Box>
      <Box className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex flex-col flex-1 w-full p-4 bg-slate-600 gap-4">
            <TextField
              label="Title"
              value={title}
              onChange={(event: ChangeEvent<any>) => setTitle(event.target.value)}
              fullWidth
              id="filled-input"
              variant="filled"
              inputProps={{ 'aria-label': 'embed-title' }}
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
            <TextField
              label="Tag"
              value={tag}
              onChange={(event: ChangeEvent<any>) => setTag(event.target.value)}
              fullWidth
              id="filled-input"
              variant="filled"
              inputProps={{ 'aria-label': 'embed-tag' }}
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

export default FollowupNewFormPage
