import { ChangeEvent, useRef, useState } from "react";
import type { NextPage } from "next";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";
import { trpc } from "@/utils/trpc";
import { DateTime, Settings } from "luxon";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { Property } from "@prisma/client";

Settings.defaultZone = "America/Chicago";
const weekdayValues = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const ScheduleFormPage: NextPage = () => {
  const [streamTopic, setStreamTopic] = useState("TBA");
  const [streamTime, setStreamTime] = useState<DateTime>(DateTime.now());
  const [weeklySchedule, setWeeklySchedule] = useState<string[]>([]);

  const getScheduledNextStreamDatetime = () => {
    const today = DateTime.now();
    const noon = today.set({ hour: 12 }).startOf("hour");

    let result;
    for (const weekday of weeklySchedule) {
      const weekdayToNum = weekdayValues.indexOf(weekday) || 1;
      if (noon < today.set({ weekday: weekdayToNum })) {
        result = noon.set({ weekday: weekdayToNum });
      }
    }
    // if at end of week, start at the beginning of next week
    if (!result) {
      const weekdayToNum = weekdayValues.indexOf(
        weeklySchedule?.[0] || "Monday"
      );
      result = noon.set({ weekday: weekdayToNum }).plus({ days: 7 });
    }
    return result;
  };

  // the first prop here is literal undefined
  // so that we can use the second prop that uses callbacks
  // this query doesn't need input otherwise
  const { isLoading, refetch } = trpc.schedule.get.useQuery(undefined, {
    onSuccess: (data) => {
      const { topic, time } = data;
      const prevStreamTime = DateTime.fromSeconds(Number(time.value));
      if (prevStreamTime >= DateTime.now()) {
        setStreamTopic(topic.value);
        setStreamTime(prevStreamTime);
      } else {
        setStreamTime(getScheduledNextStreamDatetime());
      }
    },
  });

  const { refetch: dbRefetch } = trpc.schedule.getWeeklySchedule.useQuery(
    undefined,
    {
      onSuccess: (data) => {
        const { value } = data as Property;
        setWeeklySchedule(JSON.parse(value));
      },
    }
  );

  const submitScheduleMutation = trpc.schedule.update.useMutation({
    onSuccess: () => refetch(),
  });

  const submitWeeklyMutation = trpc.schedule.setWeeklySchedule.useMutation({
    onSuccess: () => dbRefetch(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitScheduleMutation.mutate({
      streamTopic: streamTopic,
      streamTime: streamTime.toSeconds().toString(),
    });
    submitWeeklyMutation.mutate({
      value: JSON.stringify(weeklySchedule),
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
                label="Stream Topic"
                value={streamTopic}
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
              <Autocomplete
                multiple
                options={weekdayValues}
                value={weeklySchedule}
                onChange={(_e, value) => setWeeklySchedule(value)}
                filterSelectedOptions
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Weekly Schedule"
                    inputProps={{
                      ...params.inputProps,
                      "aria-label": "schedule-weekly",
                    }}
                  />
                )}
              />
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
