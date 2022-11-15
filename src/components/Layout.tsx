import Head from "next/head";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export interface LayoutProps {
  children: JSX.Element | JSX.Element[];
  classname?: string;
}

const Layout = (props: LayoutProps) => {
  const { children, classname } = props;
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Healthy Gamer Admin Panel</title>
        <meta name="description" content="Healthy Gamer Admin Panel" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        className={`container mx-auto flex min-h-screen flex-col items-center bg-slate-800 text-slate-100 ${classname}`}
      >
        {sessionData ? (
          <>
            <div className="flex w-screen bg-slate-600 text-xl">
              <p className="py-2 pl-4">
                Logged in as {sessionData?.user?.name}
              </p>
              <div
                className="ml-auto border-l border-white px-4 py-2 hover:bg-slate-500"
                onClick={() => signOut()}
              >
                Sign out
              </div>
            </div>
            {children}
          </>
        ) : (
          <div className="flex min-h-screen flex-col justify-center">
            <button
              className="rounded-md border border-black bg-slate-700 px-4 py-2 text-xl shadow-lg hover:bg-slate-600"
              onClick={() => signIn()}
            >
              Please sign in
            </button>
          </div>
        )}
      </main>
    </>
  );
};

export default Layout;
