import { ChangeEvent, useRef } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";

const ReminderEmbedFormPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const headerRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();

  const { data, isLoading, refetch } = trpc.reminderEmbed.findById.useQuery(
    { id },
    { enabled: !!id }
  );

  const submitMutation = trpc.reminderEmbed.updateOne.useMutation({
    onSuccess: () => refetch(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      <div className="m-2 self-start text-sm">
        <Link href="/reminderEmbeds">{"< Back to list page"}</Link>
      </div>
      <div className="w-full p-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
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
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ReminderEmbedFormPage;
