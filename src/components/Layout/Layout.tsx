import React from 'react';

export interface LayoutProps {
  children: JSX.Element | JSX.Element[];
  classname?: string;
}

const Layout = (props: LayoutProps) => {
  const { children, classname } = props;
  return <main className={`container mx-auto flex flex-col items-center justify-center p-4 ${classname}`}>
    {children}
  </main>
}

export default Layout;
