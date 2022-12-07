import { ChangeEvent, useRef, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Autocomplete from "@mui/material/Autocomplete";
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

  const titleRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();
  const intervalRef = useRef<HTMLInputElement>();
  const eventRef = useRef("");
  const tagRef = useRef<HTMLInputElement>();
  const [active, setActive] = useState(true);

  const { data: eventData, isLoading: eventLoading } =
    trpc.followup.getEvents.useQuery();

  const submitMutation = trpc.followup.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    if (!titleRef.current || !descriptionRef.current || !tagRef.current || !intervalRef.current) {
      return;
    }
    submitMutation.mutate({
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      listening_time: Number(intervalRef.current.value),
      event_id: eventRef.current,
      tag: tagRef.current.value,
      active,
    });
  };

  return (
    <Layout>
      <div className="m-2 self-start text-sm">
        <Link href="/followupMessages">{"< Back to list page"}</Link>
      </div>
      {eventLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
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
              <TextField
                inputRef={tagRef}
                label="Tag"
                inputProps={{ "aria-label": "followup-tag" }}
              />
              <TextField
                inputRef={intervalRef}
                label="Listening Time"
                inputProps={{ "aria-label": "followup-listening-time" }}
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
            </div>
          </form>
        </div>
      )}
    </Layout>
  );
};

export default FollowupNewFormPage;
