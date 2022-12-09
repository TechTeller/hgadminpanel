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

const ReminderFormPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const channelRef = useRef("");
  const intervalRef = useRef<HTMLInputElement>();
  const embedRef = useRef("");

  const {
    data: reminderData,
    isLoading: reminderLoading,
    refetch,
  } = trpc.channelReminder.findById.useQuery({ id }, { enabled: !!id });

  const { data: channelData, isLoading: channelLoading } =
    trpc.channelReminder.getChannels.useQuery();

  const { data: embedData, isLoading: embedLoading } =
    trpc.reminderEmbed.getAll.useQuery();

  const submitMutation = trpc.channelReminder.updateOne.useMutation({
    onSuccess: () => refetch(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({
      id,
      channel_id:
        typeof channelRef.current === "string"
          ? channelRef.current
          : reminderData?.channel_id,
      message_interval: intervalRef.current
        ? Number(intervalRef.current.value)
        : reminderData?.message_interval,
      embed_id:
        typeof embedRef.current === "string"
          ? embedRef.current
          : reminderData?.embed_id,
    });
  };

  return (
    <Layout>
      <div className="m-2 self-start text-sm">
        <Link href="/channelReminders">{"< Back to list page"}</Link>
      </div>
      {reminderLoading || channelLoading || embedLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
              <Autocomplete
                ref={channelRef}
                options={
                  channelData?.filter(
                    (c) => c.type === "GUILD_TEXT"
                  ) as Channel[]
                }
                defaultValue={
                  channelData?.filter(
                    (c) => c.discord_id === reminderData?.channel_id
                  )[0]
                }
                getOptionLabel={(c) => c.name}
                onChange={(_e, value) => {
                  if (channelRef.current)
                    channelRef.current = value?.discord_id ?? "";
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
                label="Message Interval (minimum 1)"
                defaultValue={reminderData?.message_interval}
                inputProps={{ "aria-label": "reminder-message-interval" }}
              />
              <Autocomplete
                ref={embedRef}
                options={embedData as Embed[]}
                defaultValue={
                  embedData?.filter((e) => e.id === reminderData?.embed_id)[0]
                }
                getOptionLabel={(e) => e.header}
                onChange={(_e, value) => {
                  if (embedRef.current) embedRef.current = value?.id ?? "";
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
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default ReminderFormPage;
