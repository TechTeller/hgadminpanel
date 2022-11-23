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

const FollowupNewFormPage = () => {
  const router = useRouter();
  const { pathname } = router;

  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const eventRef = useRef("");
  const [active, setActive] = useState(true);

  const { data: eventData, isLoading: eventLoading } =
    trpc.followup.getEvents.useQuery();

  const submitMutation = trpc.followup.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({
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
      {eventLoading ? (
        <Box>Loading...</Box>
      ) : (
        <Box className="w-full p-4">
          <form onSubmit={handleSubmit}>
            <Box className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
              <TextField
                inputRef={titleRef}
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
              <Autocomplete
                ref={eventRef}
                options={eventData as Event[]}
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

export default FollowupNewFormPage;
