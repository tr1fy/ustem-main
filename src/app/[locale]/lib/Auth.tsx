'use client';

import React, { useContext, createContext, useState, useEffect } from 'react';

import {
  createClientComponentClient,
  Session,
  User,
} from '@supabase/auth-helpers-nextjs';
import {
  SignInWithOAuthCredentials,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
} from '@supabase/gotrue-js';

const AuthContext = createContext({});

export function useAuth(): any {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: any): JSX.Element {
  const [user, setUser] = useState<User | undefined>();
  const [session, setSession] = useState<Session | null>();
  const [isLoading, setLoading] = useState(true);
  const client = createClientComponentClient();
  const [profile, setProfile] = useState<any>();

  useEffect(() => {
    const setData = async () => {
      const {
        data: { session: any },
        error,
      } = await client.auth.getSession();

      if (error) {
        throw error;
      }

      setSession(session);

      if (session) {
        setUser(session.user);

        // Manually refresh session when the token is expired
        const expiryAt = new Date(session?.expires_at || 0);

        if (expiryAt < new Date()) {
          const { error } = await client.auth.refreshSession();

          if (error) {
            throw error;
          }
        }

        if (session.user) {
          const profile = await client
            .from('users_profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setProfile(profile);
        }
      }

      setLoading(false);
    };

    const { data: listener } = client.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user);
        setLoading(false);
        if (session?.user) {
          const profile = await client
            .from('users_profiles')
            .select('*')
            .eq('id', session?.user?.id)
            .single();

          setProfile(profile);
        }
      }
    );

    setData();

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    signUp: (payload: SignUpWithPasswordCredentials) =>
      client.auth.signUp(payload),
    signIn: (payload: SignInWithPasswordCredentials) =>
      client.auth.signInWithPassword(payload),
    signOut: () => client.auth.signOut(),
    updateUser: (payload: { password: string }) =>
      client.auth.updateUser(payload),
    resetPasswordForEmail: (email: string, options?: { redirectTo: string }) =>
      client.auth.resetPasswordForEmail(email, options),
    exchangeCodeForSession: (code: string) =>
      client.auth.exchangeCodeForSession(code),
    user,
    profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}
