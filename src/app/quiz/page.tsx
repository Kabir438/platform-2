"use client"
// components/Quiz.tsx
import { useEffect, useRef, useState } from 'react';
import { Question } from '../../utils/interfaces';
import quizData from '../../utils/questions';
import { Button, TextField, Typography, Paper, makeStyles, useTheme, CircularProgress } from '@mui/material';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../../firebase"
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import Image from "next/image"

const Quiz: React.FC = () => {
  const theme = useTheme();
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [user, loading] = useAuthState(auth)
  const [retrieved, setRetrieved] = useState(false)
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [showIncorrectAnswer, setShowIncorrectAnswer] = useState<boolean>(false);

  const handleAnswerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserAnswer(e.target.value);
    setShowIncorrectAnswer(false); // Hide incorrect answer text when typing again
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNextQuestion();
    }
  };
  useEffect(() => {
    if(retrieved) return;
    if(user) {
      getDoc(doc(db, "/users/" + user.email))
      .then(res => res.data())
      .then(res => {
        const index = res?.questionIndex;
        const score = res?.score;
        setCurrentQuestionIndex(index || 0)
        setScore(score || 0)
        if(index === quizData.length) {
          setIsQuizCompleted(true);
        }
        setRetrieved(true);
      })
    }
    if(!user && !loading) {
      router.replace("/")
    }
  }, [user, loading])

  const handleNextQuestion = () => {
    const email = user?.email
    const currentQuestion: Question = quizData[currentQuestionIndex];
    const isCorrect: boolean = currentQuestion.answers
      .map((answer) => answer.toLowerCase().trim())
      .includes(userAnswer.trim().toLowerCase());

    if (isCorrect) {
      setScore(score + 1);
      
      setUserAnswer(''); // Clear the input for the next question
      console.log(currentQuestionIndex, quizData.length)
      if (currentQuestionIndex + 1 === quizData.length) {
        setIsQuizCompleted(true);
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setDoc(doc(db, "/users/" + email), {
          score: score + 1,
          questionIndex: currentQuestionIndex + 1
        });
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1); // Move to the next question
        setDoc(doc(db, "/users/" + email), {
          score: score + 1,
          questionIndex: currentQuestionIndex + 1
        });
      }
    } else {
      setShowIncorrectAnswer(true); // Show incorrect answer text for the current question
    }
  };

  const currentQuestion: Question = quizData[currentQuestionIndex];
  console.log(isQuizCompleted)
  if(!retrieved) {
    return (
      <Paper elevation={3} style={{ padding: theme.spacing(3), maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <CircularProgress />
      </Paper>
    )
  }
  if (isQuizCompleted) {
    return (
      <Paper elevation={3} style={{ padding: theme.spacing(3), maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <Typography variant="h5">Congratulations! you have successfully found the remedy and completed the discovery stage.</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} style={{ padding: theme.spacing(3), maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
      <Typography variant="h5">Question {currentQuestionIndex + 1}</Typography>
      {
        currentQuestion?.question?.split("\n").map((line, index) => (
          <Typography 
            key={`line-${index}`}
            variant="body1" 
            textAlign={"left"}
            style={{ 
              marginBottom: index === ((currentQuestion?.question?.split("\n").length || -10) - 1) ? theme.spacing(2) : 0
            }}
            margin={0}
          >
            {line}
          </Typography>
        ))
      }
      {
        currentQuestion.image && <Image
          alt={currentQuestion.image.replace("/", "").replaceAll("-", "").replace(".png", "")}
          src={currentQuestion.image}
          width={500}
          height={500}
        />
      }
      <TextField
        onKeyDown={handleKeyDown}
        fullWidth
        variant="outlined"
        label="Your Answer"
        value={userAnswer}
        onChange={handleAnswerChange}
        style={{ marginBottom: theme.spacing(2) }}
        autoComplete="off" // Disable autocomplete for the input field
      />
      {showIncorrectAnswer && (
        <Typography variant="body1" style={{ color: 'red', marginBottom: theme.spacing(2) }}>
          Incorrect Answer! Please try again.
        </Typography>
      )}
      <Button variant="contained" color="primary" onClick={handleNextQuestion}>
        {currentQuestionIndex + 1 === quizData.length ? 'Finish' : 'Next'}
      </Button>
      <Typography variant="body1" style={{ marginTop: '10px' }}>
        Correct Answers: {score}
      </Typography>
    </Paper>
  );
};

export default Quiz;
