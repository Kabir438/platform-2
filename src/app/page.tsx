"use client"
// App.tsx
import React, { useEffect } from 'react';
import { auth } from '../firebase';
import 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRouter } from 'next/navigation';
import { CircularProgress, Paper, useTheme } from '@mui/material';

const App: React.FC = () => {
  // Check if the user is logged in or not
  const theme = useTheme();
  const [user, loading] = useAuthState(auth)
  const router = useRouter()
  useEffect(() => {
    if(user && !loading) {
      router.replace("/quiz")
    } else if (!user && !loading) {
      router.replace("/login")
    }
  }, [user, loading, router])
  return (
    <Paper elevation={3} style={{ padding: theme.spacing(3), maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <CircularProgress />
    </Paper>
  );
};

export default App;