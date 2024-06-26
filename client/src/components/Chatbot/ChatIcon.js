import {
    Box,
    Modal,
    styled,
    TextField,
    Tooltip, Button, Paper, Typography, Toolbar, IconButton, Avatar,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import { createTheme } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import Message from "./Message";
import logo from "../../images/chatbot2.png";
import SendIcon from '@mui/icons-material/Send';
import packagejson from '../../../package.json';

const StyledModal = styled(Modal)({
    display: "flex",
    justifyContent: "right",
    alignItems: "end"
});

const style = {
    left: 'auto',
    borderRadius: '4px',
    boxShadow: '0 2px 20px 0 #bfbcb5',
    backgroundColor: '#fff',
    top: 'auto',
    position: 'fixed',
    zIndex: '5000',
    right: '12px',
    float: 'right',
    width: '600px',
    height: '700px'
};

const ChatWrapper = styled("div")(({ theme }) => ({
    display: "flex",
    height: "calc(100% - 60px)",
}));

const InputWrapper = styled(Paper)(({ theme }) => ({
    backgroundImage: "none",
    alignItems: "center",
    padding: "2px",
    display: "flex",
    gap: 10,
    marginLeft: 10,
    marginRight: 10
}));

const useStyles = makeStyles((theme) => ({
    messages: {
        backgroundColor: "white",
        padding: "10px",
        height: "calc(100% - 76px)",
        overflow: "scroll",
        overflowX: "hidden",
    },
    chatinfo: {
        backgroundColor: "#5d5b82",
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        color: "lightgray",
    },

    textfield: {
        backgroundColor: "white",
        // borderRadius: 50,
        [`& fieldset`]: {
            border: '1px none #dbdee1!important'
        },
        ["& input"]: {
            fontSize: 20,
            padding: '11px 5px!important'
        },
    },
    minHeight: {
        minHeight: "48px !important",
    },
    logout: {
        color: "white",
    },
    button: {
        fontSize: '20px',
        fontWeight: 'bold',
        padding: '0 16px',
        fontFamily: 'scandinavian,Arial,,Helvetica,sans-serif'
    },
    suggestion: {
        backgroundColor: '#0069b4',
        // borderRadius: 10,
        // padding: 12,
        // display: 'none'
    },

    suggestionItem: {
        borderRadius: 50, marginTop: 10, marginBottom: 10, textAlign: 'center'
    },

    message: {
        display: 'flex',
        flexDirection: 'column',
    },
    messageWrapper: {
        display: 'flex',
        maxWidth: '400px',
        overflow: 'hidden',
        animation: 'animationFrames 2s',
        animationIterationCount: '1',
        clear: 'both',
        marginBottom: '10px',
        position: 'relative',
    },
    messageText: {
        color: 'white',
        padding: '8px',
        fontSize: '20px',
        backgroundColor: '#0069b4',
        borderRadius: '20px',
    },

    createdAt: {
        fontSize: '23px',
    },
}));

const theme = createTheme();

const Chat = (props) => {


    const [open, setOpen] = useState(false);
    const baseurl = packagejson.config.baseurl

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    const scrollRef = useRef();

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, [messages]);

    const handleSubmit = async (e, type = false, suggestion = "") => {

        e.preventDefault();

        let question = ""

        if (type) {
            question = suggestion
        } else {
            if (newMessage === "") {
                return;
            } else {
                question = newMessage
            }
        }

        setMessages([
            ...messages,
            {
                q: question,
                a: "",
                created_at: "",
            },
        ]);

        setNewMessage("");


        try {
            const response = await fetch(baseurl + "/api/chatBot", {
              method: "POST",
              body: JSON.stringify({
                question: question,
              }),
              headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
              },
            });
          
            const res = await response.json();
          
            console.log("API Response:", res);
          
            if (res.status === "SUCCESS") {
              setMessages([...messages, res.data]);
            }
          } catch (error) {
            console.error("Error fetching data:", error);
          }
          
    };

    const classes = useStyles();

    return (
        <>
            <Tooltip
                onClick={(e) => {
                    setOpen(true);
                }}
                sx={{
                    position: "fixed",
                    bottom: 50,
                    right: { xs: "calc(50% - 60px)", md: 30 },
                    fontSize: "20x",
                }}
            >
                <Paper elevation={8} style={{ borderRadius: '50px', width: '70px', height:'70px' }}>
                    <IconButton>
                        <Avatar src={logo} sx={{width:'60px', height:'60px'}}/>
                    </IconButton>
                </Paper>
            </Tooltip>
            <StyledModal
                open={open}
                onClose={(e) => {
                    setOpen(false);
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} >
                    <Box sx={{ backgroundColor: 'white' }}>
                        <Toolbar className={classes.minHeight} sx={{ minHeight: '48px', padding: '8px 8px 5px 15px' }}>
                            <Avatar src={logo} sx={{ mr: 2 }} />
                            <Typography variant="h5" component="div" color="#0F2846" sx={{ fontFamily: "Roboto", fontWeight: "bold", color: '#0069b4', lineHeight: '1.33 ', fontSize: '25px' }}>
                                Learning Assistant
                            </Typography>
                            <Box sx={{ flexGrow: 1 }}></Box>
                        </Toolbar>
                    </Box>
                    <ChatWrapper>
                        <Box flex={1}>
                            <Box className={classes.messages}>
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "start",
                                        p: 1,
                                        bgcolor: "#fff",
                                        borderRadius: 1,
                                    }}
                                >
                                    <Box className={classes.message}>

                                        <Box sx={{ mb: 1 }} className={classes.messageWrapper}>
                                            <Box className={classes.messageText}>
                                                Hello, How can I help you
                                            </Box>
                                        </Box>
{/* 
                                        <Box className={classes.messageWrapper}>
                                            <Box className={classes.messageText}>
                                                <Box className={classes.suggestion}>
                                                    <Typography sx={{ fontSize: '14px' }} color="initial">
                                                        Please provide input as below format: <h4 style={{ marginTop: '5px', marginBottom: '0px' }}>movie name, movie description</h4>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box> */}
                                    </Box>
                                </Box>
                                {messages.length !== 0 ? (
                                    messages.map((item, i) => {
                                        return (
                                            <div ref={scrollRef} key={i}>
                                                <Message {...item} />
                                            </div>
                                        );
                                    })
                                ) : (
                                    ''
                                )}
                            </Box>
                            <Box component="form" noValidate onSubmit={handleSubmit}>
                                <InputWrapper sx={{ height: '40px' }} elevation={10}>
                                    <TextField
                                        id=""
                                        label=""
                                        className={classes.textfield}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        value={newMessage}
                                        InputLabelProps={{
                                            shrink: false,
                                        }}
                                        fullWidth
                                        sx={{ height: '40px' }}
                                    />
                                    <Button id="send_button" onClick={handleSubmit} size="large" >
                                        <SendIcon />
                                    </Button>
                                </InputWrapper>
                            </Box>
                        </Box>
                    </ChatWrapper>
                </Box>
            </StyledModal>
        </>
    );
};

export default Chat;