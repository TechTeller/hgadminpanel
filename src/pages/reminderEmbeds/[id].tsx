import { ChangeEvent, createRef } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";

const ReminderEmbedFormPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const headerRef = createRef<any>();
  const descriptionRef = createRef<any>();

  const { data, refetch } = trpc.reminderEmbed.findById.useQuery({ id });

  const submitMutation = trpc.reminderEmbed.updateOne.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    if (!headerRef.current || !descriptionRef.current) {
      return;
    }
    submitMutation.mutate({
      id,
      header: headerRef.current.value,
      description: descriptionRef.current.value,
    });
  };

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/reminderEmbeds">{"< Back to list page"}</Link>
      </Box>
      <Box className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
            <TextField
              inputRef={headerRef}
              label="Title"
              defaultValue={data?.header}
              inputProps={{ "aria-label": "embed-header" }}
            />
            <TextField
              inputRef={descriptionRef}
              label="Message"
              defaultValue={data?.description}
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

export default ReminderEmbedFormPage;
