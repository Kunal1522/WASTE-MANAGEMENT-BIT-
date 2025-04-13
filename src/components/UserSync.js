'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

export const UserSync = () => {
  const { isSignedIn, isLoaded } = useUser();
  useEffect(() => {
    const syncUserToDatabase = async () => {
      if (isSignedIn) {
        try {
          console.log('Syncing user to database...');
          const response = await fetch('/api/user/sync');   
          if (!response.ok) {
            const errorText = await response.text();
            console.error('Error syncing user:', errorText);
            return;
          }
          const data = await response.json();
          console.log('User sync result:', data);
        } catch (error) {
          console.error('Error syncing user to database:', error);
        }
      }
    };

    if (isLoaded) {
      syncUserToDatabase();
    }
  }, [isSignedIn, isLoaded]);
  // This is a utility component that doesn't render anything visible
  return null;
};