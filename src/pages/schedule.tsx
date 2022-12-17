import { ChangeEvent, useRef, useState } from "react";
import type { NextPage } from "next";
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
  const topicRef = useRef<HTMLInputElement>();

  const getNextStreamDatetime = () => {
    const nowTime = DateTime.now();
    const noon = nowTime.set({ hour: 12 }).startOf("hour");
    const monday = noon.set({ weekday: 1 });
    const wednesday = noon.set({ weekday: 3 });
    const friday = noon.set({ weekday: 5 });
    const nextMonday = monday.plus({ days: 7 });
    let result;
    if (monday >= nowTime) {
      result = monday;
    } else if (wednesday >= nowTime) {
      result = wednesday;
    } else if (friday >= nowTime) {
      result = friday;
    } else {
      result = nextMonday;
    }
    return result;
  };
  const [streamTime, setStreamTime] = useState<DateTime>(
    getNextStreamDatetime()
  );

  // the first prop here is literal undefined
  // so that we can use the second prop that uses callbacks
  // this query doesn't need input otherwise
  const { data, isLoading, refetch } = trpc.schedule.get.useQuery(undefined, {
    onSuccess: (data) => {
      const { time: dataStreamTime } = data;
      const parsedTime = DateTime.fromSeconds(Number(dataStreamTime.value));
      if (parsedTime >= DateTime.now()) {
        setStreamTime(parsedTime);
      }
    },
  });

  const submitMutation = trpc.schedule.update.useMutation({
    onSuccess: () => refetch(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    if (!topicRef.current) {
      return;
    }
    submitMutation.mutate({
      streamTopic: topicRef.current.value,
      streamTime: streamTime.toSeconds().toString(),
    });
  };

  return (
    <Layout>
      <div className="m-2 self-start text-sm">
        <Link href="/">{"< Back to main page"}</Link>
      </div>
      <div className="w-full p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
              <TextField
                inputRef={topicRef}
                label="Stream Topic"
                defaultValue={data?.topic.value}
                inputProps={{ "aria-label": "embed-header" }}
              />
              <LocalizationProvider dateAdapter={AdapterLuxon}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  label="Stream Date and Time (Times are set to US Central Time)"
                  value={streamTime}
                  onChange={(newValue) => setStreamTime(newValue as DateTime)}
                  inputFormat="DDDD, T ZZZZ"
                />
              </LocalizationProvider>
              <Button type="submit" variant="contained">
                Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ScheduleFormPage;
