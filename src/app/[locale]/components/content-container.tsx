'use client'

import { ReactElement } from 'react';

const ContentContainer = ({ children }: {children: React.ReactNode}): ReactElement => {
  return (
    <>
      <main className="flex flex-col items-center justify-between overflow-hidden">
        {children}
      </main>
    </>
  );
};

export default ContentContainer;
