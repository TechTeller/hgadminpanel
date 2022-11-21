import { ChangeEvent, createRef } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";

const FollowupNewFormPage = () => {
  const router = useRouter();
  const { pathname } = router;

  const titleRef = createRef<any>();
  const descriptionRef = createRef<any>();
  const tagRef = createRef<any>();

  const submitMutation = trpc.followup.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    if (!titleRef.current || !descriptionRef.current || !tagRef.current) {
      return;
    }
    submitMutation.mutate({
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      tag: tagRef.current.value,
    });
  };

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/followupMessages">{"< Back to list page"}</Link>
      </Box>
      <Box className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <Box className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
            <TextField
              inputRef={titleRef}
              label="Title"
              defaultValue={data?.title}
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
            <TextField
              inputRef={tagRef}
              label="Tag"
              defaultValue={data?.tag}
              inputProps={{ "aria-label": "embed-tag" }}
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

export default FollowupNewFormPage;
