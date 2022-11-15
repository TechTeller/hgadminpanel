import { ChangeEvent, useState } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import StyledTextField from "@/components/StyledTextField";

const ReminderNewFormPage: NextPage = () => {
  const router = useRouter();
  const { pathname } = router;
  const [channel, setChannel] = useState(0);
  const [messageInterval, setMessageInterval] = useState(0);
  const [embed, setEmbed] = useState(0);

  const submitMutation = trpc.channelReminder.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({
      channel,
      message_interval: messageInterval,
      embed,
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
            <StyledTextField
              label="Channel"
              value={channel}
              onChange={(event: ChangeEvent<any>) =>
                setChannel(event.target.value)
              }
              inputProps={{ "aria-label": "reminder-channel" }}
            />
            <StyledTextField
              label="Message Interval"
              value={messageInterval}
              onChange={(event: ChangeEvent<any>) =>
                setMessageInterval(event.target.value)
              }
              multiline
              rows={4}
              inputProps={{ "aria-label": "reminder-message-interval" }}
            />
            <StyledTextField
              label="Embed"
              value={embed}
              onChange={(event: ChangeEvent<any>) =>
                setEmbed(event.target.value)
              }
              multiline
              rows={4}
              inputProps={{ "aria-label": "reminder-embed" }}
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
