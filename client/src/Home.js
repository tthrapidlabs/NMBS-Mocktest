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
import { useNavigate } from 'react-router-dom';
import wallPaper from "./images/wall.jpg";
import packagejson from '../package.json';


const baseurl = packagejson.config.baseurl

export default function Home({setQuestions}) {

    const navigate = useNavigate();

    const [level, setLevel] = useState('easy')
    const getQuestions = async () => {

        try {
            const response = await fetch(baseurl + "/api/getQuestions", {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    "level": level,
                }),
                headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
                }
            });
            const res = await response.json();
            console.log("getQuestions res.............", res);

            if (res.status === 'SUCCESS') {
                setQuestions(res.response); // Use res.response instead of res
                navigate('/mock-test')
            } else {
                console.log(res);
            }
        } catch (err) {
            console.log(err);
        }
    };
    return (
        <Box
            sx={{
                backgroundImage: `url(${wallPaper})`,
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: { xs: "none", sm: "block" },
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                height: '100vh'
            }}
        >
            <Typography variant="h4" color="#fff" sx={{
                position: "fixed",
                bottom: '70%',
                left: '37%',
            }}>
                Voitures série I10
            </Typography>
            <ButtonGroup variant="contained" aria-label="outlined primary button group" sx={{
                position: "fixed",
                bottom: '60%',
                left: '39%',
            }}>
                <Button color={level === 'easy' ? "secondary" : "primary"} onClick={() => setLevel('easy')}>Easy</Button>
                <Button color={level === 'medium' ? "secondary" : "primary"} onClick={() => setLevel('medium')}>Medium</Button>
                <Button color={level === 'difficult' ? "secondary" : "primary"} onClick={() => setLevel('difficult')}>Hard</Button>
            </ButtonGroup>
            <Button variant="contained" color="primary" onClick={() => getQuestions()}
                // to="/mock-test"
                sx={{
                    position: "fixed",
                    bottom: '45%',
                    left: '35%',
                    // right: { xs: "calc(50% - 60px)" },

                    fontSize: "24px",
                }}>
                Start your mock test
            </Button>
        </Box>
    )
}
