import { Box, Button, TextField } from "@mui/material"
import Link from "next/link"
import Layout from "@/components/Layout"
import { trpc } from "@/utils/trpc"
import { ChangeEvent, useState } from "react"

import dayjs, { Dayjs } from "dayjs"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import timezone from "dayjs/plugin/timezone"
import utc from "dayjs/plugin/utc"
import StyledTextField from "@/components/StyledTextField"

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault("America/Chicago") // US Central Time

const ScheduleFormPage = () => {
  const [streamTopic, setStreamTopic] = useState("TBD")

  const getNextStreamDatetime = () => {
    const noon = dayjs().hour(12).startOf("hour")
    let result
    if (noon.isBefore(dayjs().day(1))) {
      result = noon.day(1)
    } else if (noon.isBefore(dayjs().day(3))) {
      result = noon.day(3)
    } else if (noon.isBefore(dayjs().day(5))) {
      result = noon.day(5)
    } else {
      result = noon.day(1).add(7, 'day')
    }
    return result
  }
  const [streamDatetime, setStreamDatetime] = useState<Dayjs | null>(getNextStreamDatetime())

  // the first prop here is literal undefined
  // so that we can use the second prop that uses callbacks
  // this query doesn't need input otherwise
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
            <StyledTextField
              label="Stream Topic"
              value={streamTopic}
              onChange={(event: ChangeEvent<any>) => setStreamTopic(event.target.value)}
              inputProps={{ 'aria-label': 'embed-header' }}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                renderInput={props => <StyledTextField {...props} />}
                label="Stream Date and Time (Times are set to US Central Time)"
                value={streamDatetime}
                onChange={newValue => setStreamDatetime(newValue)}
              />
            </LocalizationProvider>
            <Button type="submit" variant="contained">Save</Button>
          </Box>
        </form>
      </Box>
    </Layout>
  )
}

export default ScheduleFormPage
