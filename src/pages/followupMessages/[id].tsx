import { ChangeEvent, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";

const FollowupFormPage = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const res = trpc.followup.findById.useQuery(
    { id },
    {
      onSuccess: (data) => {
        const {
          title: dataTitle,
          description: dataDescription,
          tag: dataTag,
        } = data;
        setTitle(dataTitle);
        setDescription(dataDescription);
        setTag(dataTag);
      },
    }
  );

  const submitMutation = trpc.followup.updateOne.useMutation({
    onSuccess: () => res.refetch(),
  });

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({ id, title, description, tag });
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
              label="Title"
              value={title}
              onChange={(event: ChangeEvent<any>) =>
                setTitle(event.target.value)
              }
              inputProps={{ "aria-label": "embed-header" }}
            />
            <TextField
              label="Message"
              value={description}
              onChange={(event: ChangeEvent<any>) =>
                setDescription(event.target.value)
              }
              multiline
              rows={4}
              inputProps={{ "aria-label": "embed-description" }}
            />
            <TextField
              label="Tag"
              value={tag}
              onChange={(event: ChangeEvent<any>) => setTag(event.target.value)}
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

export default FollowupFormPage;
