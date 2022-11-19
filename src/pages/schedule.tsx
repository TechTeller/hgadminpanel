import { ChangeEvent, useState } from "react";
import type { NextPage } from "next";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";
import { trpc } from "@/utils/trpc";
import { DateTime, Settings } from "luxon";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

Settings.defaultZone = "America/Chicago";

const ScheduleFormPage: NextPage = () => {
  const [streamTopic, setStreamTopic] = useState("TBD");

  const getNextStreamDatetime = () => {
    const d = DateTime.now();
    const noon = d.set({ hour: 12 }).startOf("hour");
    let result;
    if (noon < d.set({ weekday: 1 })) {
      result = noon.set({ weekday: 1 });
    } else if (noon < d.set({ weekday: 3 })) {
      result = noon.set({ weekday: 3 });
    } else if (noon < d.set({ weekday: 5 })) {
      result = noon.set({ weekday: 5 });
    } else {
      result = noon.set({ weekday: 1 }).plus({ days: 7 });
    }
    return result;
  };
  const [streamTime, setStreamTime] = useState<DateTime>(
    getNextStreamDatetime()
  );

  // the first prop here is literal undefined
  // so that we can use the second prop that uses callbacks
  // this query doesn't need input otherwise
  const res = trpc.schedule.get.useQuery(undefined, {
    onSuccess: (data) => {
      const { topic: dataStreamTopic, time: dataStreamTime } = data;
      setStreamTopic(dataStreamTopic.value);
      setStreamTime(DateTime.fromSeconds(Number(dataStreamTime.value)));
    },
  });

  const submitMutation = trpc.schedule.update.useMutation({
    onSuccess: () => res.refetch(),
  });

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({
      streamTopic,
      streamTime: streamTime.toSeconds().toString(),
    });
  };

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/">{"< Back to main page"}</Link>
      </Box>
      <Box className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
            <TextField
              label="Stream Topic"
              value={streamTopic}
              onChange={(event: ChangeEvent<any>) =>
                setStreamTopic(event.target.value)
              }
              inputProps={{ "aria-label": "embed-header" }}
            />
            <LocalizationProvider dateAdapter={AdapterLuxon}>
              <DateTimePicker
                renderInput={(props) => <TextField {...props} />}
                label="Stream Date and Time (Times are set to US Central Time)"
                value={streamTime}
                onChange={(newValue) => setStreamTime(newValue as DateTime)}
              />
            </LocalizationProvider>
            <Button type="submit" variant="contained">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Layout>
  );
};

export default ScheduleFormPage;