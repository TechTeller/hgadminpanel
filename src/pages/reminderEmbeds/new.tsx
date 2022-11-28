import { ChangeEvent, useRef } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";

const ReminderEmbedNewFormPage = () => {
  const router = useRouter();
  const { pathname } = router;

  const headerRef = useRef("");
  const descriptionRef = useRef("");

  const submitMutation = trpc.reminderEmbed.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({
      header: headerRef.current,
      description: descriptionRef.current,
    });
  };

  return (
    <Layout>
      <div className="m-2 self-start text-sm">
        <Link href="/reminderEmbeds">{"< Back to list page"}</Link>
      </div>
      <div className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
            <TextField
              inputRef={headerRef}
              label="Title"
              inputProps={{ "aria-label": "embed-header" }}
            />
            <TextField
              inputRef={descriptionRef}
              label="Message"
              multiline
              rows={4}
              inputProps={{ "aria-label": "embed-description" }}
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

export default ReminderEmbedNewFormPage;
