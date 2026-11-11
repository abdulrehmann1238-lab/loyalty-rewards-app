import React from 'react';
import { Redirect } from 'expo-router';
import { useUserStore } from '@/store/userStore';

export default function AppEntryRedirect() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);
  return <Redirect href={isAuthenticated ? '/app/dashboard' : '/app/login'} />;
}

