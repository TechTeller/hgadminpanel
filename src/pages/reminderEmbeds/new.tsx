import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import StyledTextField from "@/components/StyledTextField";

const ReminderEmbedNewFormPage = () => {
  const router = useRouter();
  const { pathname } = router;
  const [header, setHeader] = useState("");
  const [description, setDescription] = useState("");

  const submitMutation = trpc.reminderEmbed.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({ header, description });
  };

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/reminderEmbeds">{"< Back to list page"}</Link>
      </Box>
      <Box className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
            <StyledTextField
              label="Title"
              value={header}
              onChange={(event: ChangeEvent<any>) =>
                setHeader(event.target.value)
              }
              inputProps={{ "aria-label": "embed-header" }}
            />
            <StyledTextField
              label="Message"
              value={description}
              onChange={(event: ChangeEvent<any>) =>
                setDescription(event.target.value)
              }
              multiline
              rows={4}
              inputProps={{ "aria-label": "embed-description" }}
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

export default ReminderEmbedNewFormPage;
