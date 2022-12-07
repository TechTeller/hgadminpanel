import { ChangeEvent, useRef } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";

export interface Channel {
  type: string;
  name: string;
  discord_id: string;
}

export interface Embed {
  id: string;
  header: string;
  description: string;
}

const ReminderNewFormPage: NextPage = () => {
  const router = useRouter();
  const { pathname } = router;
  const channelRef = useRef("");
  const intervalRef = useRef<HTMLInputElement>();
  const embedRef = useRef("");

  const { data: channelData } = trpc.channelReminder.getChannels.useQuery();
  const { data: embedData } = trpc.reminderEmbed.getAll.useQuery();

  const submitMutation = trpc.channelReminder.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    if (!intervalRef.current) {
      return;
    }
    submitMutation.mutate({
      channel_id: channelRef.current,
      message_interval: Number(intervalRef.current.value),
      embed_id: embedRef.current,
    });
  };

  return (
    <Layout>
      <div className="m-2 self-start text-sm">
        <Link href="/channelReminders">{"< Back to list page"}</Link>
      </div>
      <div className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
            <Autocomplete
              ref={channelRef}
              options={
                channelData?.filter((c) => c.type === "GUILD_TEXT") as Channel[]
              }
              getOptionLabel={(c) => c.name}
              onChange={(_e, value) =>
                (channelRef.current = value?.discord_id ?? "")
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Channel"
                  inputProps={{
                    ...params.inputProps,
                    "aria-label": "reminder-channel",
                  }}
                />
              )}
            />
            <TextField
              inputRef={intervalRef}
              label="Message Interval"
              inputProps={{ "aria-label": "reminder-message-interval" }}
            />
            <Autocomplete
              ref={embedRef}
              options={embedData as Embed[]}
              getOptionLabel={(c) => c.header}
              onChange={(_e, value) => (embedRef.current = value?.id ?? "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Embed"
                  inputProps={{
                    ...params.inputProps,
                    "aria-label": "reminder-embed",
                  }}
                />
              )}
            />
            <Button type="submit" variant="contained">
              Save
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ReminderNewFormPage;
