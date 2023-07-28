"use client"
// components/Login.tsx
import React, { FormEventHandler, useState } from 'react';
import { auth } from '../../firebase'; // Import the Firebase instance
import { Button, TextField, Typography, Paper, useTheme } from '@mui/material';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Login: React.FC = () => {
  const theme = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();

  const handleLogin: FormEventHandler<HTMLFormElement> = (event) => {
      event.preventDefault()
      signInWithEmailAndPassword(auth, email + "@doonschool.com", password)
      .then(() => {
        router.replace("/quiz")
      })
      .catch((error) => {
        setErrorMessage((error.code as string).replaceAll("-", " ").replace("auth/", "").split(" ").map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(" ") + '.');
      })
      // Successful login, redirect to the quiz or home page
  };

  return (
    <Paper onSubmit={handleLogin} component={"form"} elevation={3} style={{ padding: theme.spacing(3), maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h5">Login</Typography>
      <TextField
        fullWidth
        variant="outlined"
        type="text"
        label="Username"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ marginBottom: theme.spacing(2) }}
      />
      <TextField
        fullWidth
        variant="outlined"
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ marginBottom: theme.spacing(2) }}
      />
      {errorMessage && (
        <Typography variant="body1" style={{ color: 'red', marginBottom: theme.spacing(2) }}>
          {errorMessage}
        </Typography>
      )}
      <Button type="submit" variant="contained" color="primary">
        Login
      </Button>
    </Paper>
  );
};

export default Login;
