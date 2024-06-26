import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import {
    AppBar,
    Container,
    Toolbar,
    Typography,
    FormControl, RadioGroup, FormControlLabel, Radio, Button,
    Paper,
    Grid, Box, ButtonGroup
} from '@mui/material';
import packagejson from '../package.json';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Chart } from 'react-google-charts';
import Chat from './components/Chatbot/ChatIcon';


const baseurl = packagejson.config.baseurl

export default function Quest({questions}) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
    const [score, setScore] = useState(0);
    const [newDescription, setNewDescription] = useState('');
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
        setIsAnswerCorrect(null);
    };
    const scoreData = [
        ['Category', 'Score'],
        ['Correct', score],
        ['Incorrect', questions.length - score],
    ];

    const handleAnswerChange = (event) => {
        setSelectedAnswer(event.target.value);
    };

    const handleAnswerSubmit = async () => {
        const currentQuestion = questions[currentQuestionIndex];
        console.log("currentQuestion", currentQuestion);

        const response = await fetch(baseurl + "/api/postSelectedAnswer", {
            method: 'POST',
            body: JSON.stringify({
                "id": currentQuestion.id,
                "question": currentQuestion.question,
                "options": currentQuestion.options,
                "responded": selectedAnswer
            }),
            headers: {
                "Content-Type": "application/json",
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
        });

        const data = await response.json();
        console.log("handleAnswerSubmit.........", data);

        // Parse the response if it's a string
        const parsedData = typeof data.response === 'string' ? JSON.parse(data.response) : data.response;

        setNewDescription(parsedData.description);

        if (selectedAnswer === parsedData.correctAnswer) {
            setIsAnswerCorrect(true);
            setScore((prevScore) => prevScore + 1);
        } else {
            setIsAnswerCorrect(false);
        }
    };

    const QuestionContainer = styled('div')`
    background: linear-gradient(to right, #8c1bab,#f761a1);
    padding: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    color: #fff;
  `;

    const currentQuestion = questions[currentQuestionIndex];


    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" style={{ textTransform: 'uppercase', fontWeight: 'bold' }}>Mock Test App</Typography>
                    <AccountCircleIcon style={{ marginLeft: '80%', fontSize: '30px' }} />
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" style={{ marginTop: '20px' }}>
                <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                    {currentQuestion ? (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <h2> Answered Correctly: {score}</h2>
                                <QuestionContainer>
                                    <Box sx={{ display: 'flex' }}>

                                        <h3>{currentQuestion.id} .</h3>
                                        <h3>{currentQuestion.question}</h3>
                                    </Box>

                                    <FormControl component="fieldset">
                                        <RadioGroup value={selectedAnswer} onChange={handleAnswerChange}>
                                            {currentQuestion.options.map((option, index) => (
                                                <FormControlLabel key={index} value={option} control={<Radio sx={{
                                                    '&, &.Mui-checked': {
                                                        color: 'white',
                                                    },
                                                }} />} label={option} />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>

                                </QuestionContainer>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" onClick={handleAnswerSubmit} style={{ margin: '10px' }}>
                                    Submit Answer
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleNextQuestion}
                                    style={{ margin: '10px' }}
                                >
                                    Next Question
                                </Button>
                            </Grid>
                            {isAnswerCorrect !== null && (
                                <Grid item xs={12}>
                                    <Typography variant="body1" style={{ fontWeight: 'bold', color: isAnswerCorrect ? 'green' : 'red' }}>
                                        {isAnswerCorrect ? 'Correct!' : 'Incorrect!'} {newDescription}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <>
                            <Typography variant="h5">You have completed the mock test!</Typography>
                            <Typography variant="h6" style={{ marginTop: '10px' }}>
                                Your Score: {score} / {questions.length}
                            </Typography>
                            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                                <Chart
                                    width={'100%'}
                                    height={'300px'}
                                    chartType="PieChart"
                                    loader={<div>Loading Chart</div>}
                                    data={scoreData}
                                    options={{
                                        title: 'Score Distribution',
                                        is3D: 'true'
                                    }}
                                    rootProps={{ 'data-testid': '1' }}
                                />
                            </div>
                        </>
                    )}
                </Paper>
            </Container>
            <Chat />
        </div>
    )
}
