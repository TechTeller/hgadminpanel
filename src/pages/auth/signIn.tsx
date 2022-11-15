import { NextPageContext } from "next";
import { getProviders, signIn, SessionProviderProps } from "next-auth/react";

export default function SignIn({
  providers,
}: {
  providers: SessionProviderProps;
}) {
  return (
    <>
      {Object.values(providers).map((provider) => (
        <div key={provider.name}>
          <button onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
    </>
  );
}

export async function getServerSideProps(context: NextPageContext) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
