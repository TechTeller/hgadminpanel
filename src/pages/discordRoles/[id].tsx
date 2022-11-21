import { ChangeEvent, createRef } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";
import { DiscordType } from "@prisma/client";

const DiscordIdPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const nameRef = createRef<any>();
  const snowflakeRef = createRef<any>();
  const typeRef = createRef<any>();

  const { data, isLoading, refetch } = trpc.discordRole.findById.useQuery({
    id,
  });

  const submitMutation = trpc.discordRole.updateOne.useMutation({
    onSuccess: () => refetch(),
  });

  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    if (!nameRef.current || !snowflakeRef.current || !typeRef.current) {
      return;
    }
    submitMutation.mutate({
      id,
      name: nameRef.current.value,
      snowflake: snowflakeRef.current.value,
      type: typeRef.current.value,
    });
  };

  return (
    <Layout>
      <Box className="m-2 self-start text-sm">
        <Link href="/channelReminders">{"< Back to list page"}</Link>
      </Box>
      {isLoading ? (
        <Box>Loading...</Box>
      ) : (
        <Box className="w-full p-4">
          <form onSubmit={handleSubmit}>
            <Box className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
              <TextField
                inputRef={nameRef}
                label="Name"
                defaultValue={data?.name}
                inputProps={{ "aria-label": "discord-name" }}
              />
              <TextField
                inputRef={snowflakeRef}
                label="Snowflake"
                defaultValue={data?.snowflake}
                inputProps={{ "aria-label": "discord-snowflake" }}
              />
              <Autocomplete
                disablePortal
                ref={typeRef}
                options={Object.keys(DiscordType)}
                defaultValue={data?.type}
                onChange={(_e, value) => {
                  if (typeRef.current) {
                    typeRef.current.value = value;
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Type"
                    inputProps={{
                      ...params.inputProps,
                      "aria-label": "discord-type",
                    }}
                  />
                )}
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

export default DiscordIdPage;
