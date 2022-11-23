import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";

export interface Event {
  id: string;
  title: string;
}

const FollowupFormPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const eventRef = useRef("");
  const [active, setActive] = useState(true);

  const {
    data: followupData,
    isLoading: followupLoading,
    refetch,
  } = trpc.followup.findById.useQuery({
    id,
  });

  const { data: eventData, isLoading: eventLoading } =
    trpc.followup.getEvents.useQuery();

  const submitMutation = trpc.followup.updateOne.useMutation({
    onSuccess: () => refetch(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({
      id,
      title: titleRef.current,
      description: descriptionRef.current,
      event_id: eventRef.current,
      active,
    });
  };

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/followupMessages">{"< Back to list page"}</Link>
      </Box>
      {followupLoading || eventLoading ? (
        <Box>Loading...</Box>
      ) : (
        <Box className="w-full p-4">
          <form onSubmit={handleSubmit}>
            <Box className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
              <TextField
                inputRef={titleRef}
                label="Title"
                defaultValue={followupData?.title}
                inputProps={{ "aria-label": "followup-title" }}
              />
              <TextField
                inputRef={descriptionRef}
                label="Message"
                defaultValue={followupData?.description}
                multiline
                rows={4}
                inputProps={{ "aria-label": "followup-description" }}
              />
              <Autocomplete
                ref={eventRef}
                options={eventData as Event[]}
                defaultValue={
                  eventData?.filter(
                    (e: Event) => e.id === followupData?.event_data
                  )[0]
                }
                getOptionLabel={(e) => e.title}
                onChange={(_e, value) => (eventRef.current = value?.id ?? "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Event"
                    inputProps={{
                      ...params.inputProps,
                      "aria-label": "followup-event",
                    }}
                  />
                )}
              />
              <FormControlLabel
                label="Is Active"
                value="left"
                control={
                  <Checkbox
                    checked={active}
                    onChange={(event) =>
                      setActive(event.target.checked ?? false)
                    }
                  />
                }
              />
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Box>
          </form>
        </Box>
      )}
    </Layout>
  );
};

export default FollowupFormPage;
