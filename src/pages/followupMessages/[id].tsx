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

const FollowupFormPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const titleRef = useRef<HTMLInputElement>();
  const descriptionRef = useRef<HTMLInputElement>();
  const intervalRef = useRef<HTMLInputElement>();
  const eventRef = useRef("");
  const tagRef = useRef<HTMLInputElement>();
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
    if (!titleRef.current || !descriptionRef.current || !tagRef.current) {
      return;
    }
    submitMutation.mutate({
      id,
      title: titleRef.current.value,
      description: descriptionRef.current.value,
      active,
      listening_time: intervalRef.current
        ? Number(intervalRef.current.value)
        : followupData?.scheduled_event_followup_settings?.listening_time,
      event_id: eventRef.current,
      tag: tagRef.current.value,
    });
  };

  return (
    <Layout>
      <div className="m-2 self-start text-sm">
        <Link href="/followupMessages">{"< Back to list page"}</Link>
      </div>
      {followupLoading || eventLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="w-full p-4">
          <form onSubmit={handleSubmit}>
            <div className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
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
                defaultValue={followupData?.tag}
                inputProps={{ "aria-label": "followup-tag" }}
              />
              <TextField
                inputRef={intervalRef}
                label="Listening Time"
                defaultValue={followupData?.scheduled_event_followup_settings?.listening_time}
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

export default FollowupFormPage;
