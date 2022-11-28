import { ChangeEvent, useRef } from "react";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { trpc } from "@/utils/trpc";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Link from "next/link";
import Layout from "@/components/Layout";
import TextField from "@mui/material/TextField";
import { DiscordType } from "@prisma/client";

const DiscordNewPage: NextPage = () => {
  const router = useRouter();
  const { pathname } = router;

  const nameRef = useRef("");
  const snowflakeRef = useRef("");
  const typeRef = useRef<DiscordType>(DiscordType.ROLE);

  const submitMutation = trpc.discordRole.createOne.useMutation({
    onSuccess: () => router.push(`/${pathname.split("/")[1]}` ?? "/"),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (event: ChangeEvent<any>) => {
    event.preventDefault();
    submitMutation.mutate({
      name: nameRef.current,
      snowflake: snowflakeRef.current,
      type: typeRef.current as DiscordType,
    });
  };

  return (
    <Layout>
      <div className="m-2 self-start text-sm">
        <Link href="/discordRoles">{"< Back to list page"}</Link>
      </div>
      <div className="w-full p-4">
        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-1 flex-col gap-4 bg-slate-600 p-4">
            <TextField
              inputRef={nameRef}
              label="Name"
              inputProps={{ "aria-label": "discord-name" }}
            />
            <TextField
              inputRef={snowflakeRef}
              label="Snowflake"
              inputProps={{ "aria-label": "discord-snowflake" }}
            />
            <Autocomplete
              disablePortal
              ref={typeRef}
              options={Object.keys(DiscordType)}
              onChange={(_e, value) => (typeRef.current = value as DiscordType)}
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
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default DiscordNewPage;
