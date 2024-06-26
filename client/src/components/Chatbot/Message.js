import { Box } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';
import { format } from "timeago.js";
import './message.css'


const useStyles = makeStyles({
    message: {
        display: 'flex',
        flexDirection: 'column',
        margin: '10px',
    },
    messageOwn: {
        alignItems: 'flex-end',
    },
    messageWrapper: {
        display: 'flex',
        maxWidth: '400px',
        overflow: 'hidden'
    },
    messageTextOwn: {
        padding: '10px',
        backgroundColor: '#8D8787',
        // backgroundImage: 'linear-gradient(to right top, #c680c6, #c181c7, #bc82c7, #b782c7, #b283c7)',
        color: 'white',
        '-webkit-border-radius': '20px',
        '-webkit-border-bottom-right-radius': '2px',
        fontSize: 20,
        overflow: 'hidden',
        maxWidth: 'max-content'
    },
    messageText: {
        padding: '10px',
        backgroundColor: '#0069b4',
        // backgroundImage: 'linear-gradient(to right top, #d95cd9, #c46acd, #b771c4, #bc64d7, #a86ec2)',
        color: 'white',
        fontSize: 20,
        overflow: 'hidden',
        maxWidth: 'max-content',
        borderRadius: '20px'
    },
    createdAt: {
        fontSize: '20px',
        marginTop: '10px'
    },
})

const Message = ({ q, a, created_at }) => {

    // function urlify(text) {
    //     var urlRegex = /(https?:\/\/[^\s,]+)/g;
    //     return text.replace(urlRegex, function (url) {
    //         return '<a href="' + url + '" target="_blank">' + 'here' + '</a>';
    //     })
    // }

    function clean(text) {
        var urlRegex = /(https?:\/\/[^\s,]+)/g;
        let urlified = text.replace(urlRegex, function (url) {
            return '<a href="' + url + '" target="_blank">' + '<img src="' + url + '" alt="image" style="width:210px;height:260px;"/>' + '</a>';
        })
        return urlified.replace(/\*([^*]+?)\*/g, "<b>$1<\/b>")
    }

    let newText = a ? a.replaceAll('/n', '\n') : '';



    // newText = urlify(newText)
    newText = clean(newText)
    const textArr = newText.split(" /b ");

    const classes = useStyles()
    return (
        <>
            {q ? (
                <Box className={`${classes.message} ${classes.messageOwn}`}>
                    <Box className={classes.messageWrapper}>
                        <Box className={classes.messageTextOwn}>
                            {q}
                        </Box>
                    </Box>
                  
                </Box>

            ) : ('')}

            {a ? (<>
                {textArr.map((item, key) => {
                    return (
                        <Box key={key} className={classes.message}>
                            <Box className={classes.messageWrapper}>
                                <Box className={classes.messageText} textAlign="start">
                                    <Box sx={{ whiteSpace: 'pre-line' }} className="content" dangerouslySetInnerHTML={{ __html: item }}></Box>
                                </Box>
                            </Box>
                        </Box>
                    )
                })}
            </>) : (
                <Box className={classes.message}>
                    <Box className={classes.messageWrapper}>
                        <Box className={classes.messageText} textAlign="start">
                            <div className="typing">
                                <div className="dot"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </Box>
                    </Box>
                </Box>
            )
            }

        </>
    );
}

export default Message;