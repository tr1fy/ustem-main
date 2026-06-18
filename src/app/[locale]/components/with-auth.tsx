'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

// import { useAuth } from '@/lib/Auth';

export default function withAuth(Component: React.ComponentType) {
  return function WithAuth(props: any) {
    // const { user } = useAuth();
    const { push } = useRouter();
    // useEffect(() => {
    //   if (!user) {
    //     push('/register');
    //   }
    // }, []);
    //
    // if (!user) {
    //   return null;
    // }
    return <Component {...props} />;
  };
}
