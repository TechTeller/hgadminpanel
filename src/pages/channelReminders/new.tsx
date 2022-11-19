import { ChangeEvent, createRef } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
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
  const channelRef = createRef<any>();
  const intervalRef = createRef<any>();
  const embedRef = createRef<any>();

  const { data: channelData } = trpc.channelReminder.getChannels.useQuery();
  const { data: embedData } = trpc.reminderEmbed.getAll.useQuery();

  const submitMutation = trpc.channelReminder.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    if (!channelRef.current || !embedRef.current || !intervalRef.current) {
      return;
    }
    submitMutation.mutate({
      channel_id: channelRef.current.value,
      message_interval: Number(intervalRef.current.value),
      embed_id: embedRef.current.value,
    });
  };

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/channelReminders">{"< Back to list page"}</Link>
      </Box>
      <Box className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
            <Autocomplete
              ref={channelRef}
              options={
                channelData?.filter((c) => c.type === "GUILD_TEXT") as Channel[]
              }
              getOptionLabel={(c) => c.name}
              onChange={(_e, value) => {
                if (channelRef.current) {
                  channelRef.current.value = value?.discord_id ?? "";
                }
              }}
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
              onChange={(_e, value) => {
                if (embedRef.current) embedRef.current.value = value?.id ?? "";
              }}
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
          </Box>
        </form>
      </Box>
    </Layout>
  );
};

export default ReminderNewFormPage;
