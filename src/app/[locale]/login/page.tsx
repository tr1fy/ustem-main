import { ReactElement } from 'react';

import { Metadata } from 'next';
import Link from 'next/link';

import LoginForm from '@/app/[locale]/login/components/login-form';
import { cn } from '@/app/[locale]/lib/utils';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

const LoginPage = (): ReactElement => {
  return (
    <>
      <div className="container relative flex h-full items-center justify-center lg:max-w-none lg:px-0">
        <Link
          href="/register"
          className={cn('absolute right-4 top-4 md:right-8 md:top-8')}
        >
          Register
        </Link>

        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login into your account
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
