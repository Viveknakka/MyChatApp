import { Avatar, Box, CircularProgress,  IconButton, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import CustomizedDialogs from './Profile';
import { getSenderDetails} from '../config/ChatLogics'
import GroupUpdate from './GroupUpdate';
import axios from 'axios';
import env from '../Settings'
import './msgStyles.css'
import ScrollableChat from './ScrollableChat';
import io from 'socket.io-client'


var socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const matches = useMediaQuery("(max-width:600px)")
    const [open, setOpen] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message,setMessage] = useState()
    const [messages,setMessages] = useState([])
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing,setTyping] = useState(false)
    const [isTyping,setIsTyping] = useState(false)
    const fetchMessages = async () => {
        if (!selectedChat) return;
        try {
            const config ={
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:`Bearer ${user.token}`
                    }
            }
            setLoading(true)
            const { data } = await axios.get(`${env.api}/api/message/${selectedChat._id}`, config);
            setMessages(data)
            console.log(data)
            setLoading(false)
            socket.emit('joinchat', selectedChat._id)
        } catch (error) {
            console.log(error)
            alert("can't fetch msgs, try refreshing once")
        }
    }
    useEffect(() => {

            socket = io(env.api)
            socket.emit("setup", user);
            socket.on("connected", () => setSocketConnected(true))
            socket.on('typing', () => { setIsTyping(true) })
            socket.on('stopTyping',()=>{setIsTyping(false)}) 

    }, [])
    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat;
    }, [selectedChat])
console.log(notification)
    useEffect(() => {
        
        socket.on('message received', (newMessageReceived) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain)
                }
            }
            else {
                setMessages([...messages, newMessageReceived])
            }
        })
        
    })
    const handleOpen = (e) => {
        e.preventDefault()
        setOpen(true)
    }
    const handleOpen2 = (e) => {
        e.preventDefault()
        setOpen2(true)
    }
    const handleClose = (e) => {
        e.preventDefault()
        setOpen(false)
    }
    const handleClose2 = (e) => {
        e.preventDefault()
        setOpen2(false)
    }
    const handleSend = async (e) => {
        if (e.key === 'Enter' && message.trim()) {
            socket.emit('stopTyping', selectedChat._id);
            
            try {
                const config ={
                    headers: {
                        "Content-Type": "application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }
                setMessage('')
                const { data } = await axios.post(`${env.api}/api/message`, {
                    content: message,
                    chatId:selectedChat._id
                }, config)
                console.log(data)
                setMessages([...messages, data])
                socket.emit('newMessage', data)

            } catch (error) {
                console.log(error)
                alert('cant send')
            }
        }
    }
    
    const typingHandle = (e) => {
        // e.preventDefault()
        setMessage(e.target.value)
        if (!socketConnected) {
            console.log('not connected')
            return;
        };

        console.log(typing)
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        // socket.emit('typing', selectedChat._id)
        console.log('typing')
       // let lastTypingTIme = new Date().getTime();
        var timerLength = 1000;
        setTimeout(() => {
                socket.emit('stopTyping', selectedChat._id);
                setTyping(false)
        },timerLength)
    }
    return (
        <>
            {selectedChat ? (
                <Box ><CustomizedDialogs onClose={handleClose} display="none" user={getSenderDetails(user, selectedChat.users)} open={open}/>
                    <Box display={"flex"} justifyContent={'space-between'}>
                        <IconButton onClick={(e)=>setSelectedChat("")}><KeyboardBackspaceIcon/></IconButton>
                        {selectedChat.isGroupchat ? <><Box display={"flex"}><Avatar src={ "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqueJcsJ6yi70JhOmBC8fXBYQjzGDBG9OQ9A&usqp=CAU"}/>
                                <Typography
                                    fontSize={matches ? "30px" : "28px"}>
                                    {selectedChat.chatName}
                                </Typography></Box>
                            <IconButton onClick={handleOpen2}><SettingsIcon /></IconButton><GroupUpdate open={open2} setOpen={setOpen2} handleClose={handleClose2} chat={selectedChat} setFetchAgain={setFetchAgain} fetchAgain={fetchAgain}/></> : <>
                            <Box display={"flex"}><Avatar src={getSenderDetails(user,selectedChat.users).pic}/>
                                <Typography
                                    fontSize={matches ? "30px" : "28px"}>
                                    {getSenderDetails(user,selectedChat.users).name}
                                </Typography></Box>
                                <IconButton onClick={handleOpen}><InfoIcon /></IconButton>
                        </>}
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} p={3} backgroundColor={"#E8E8E8"} width="100%" height={'70vh'} borderRadius={"10px"} flexWrap={"wrap"}>
                        {loading?<Typography width={"100%"} height={"90%"} display={"flex"} justifyContent={'center'} alignItems={'center'}
                        ><CircularProgress /></Typography> :
                            <div className='messages'><ScrollableChat messages={messages} /></div>
                        }
                    </Box>
                    <Box mt={1}>
                        {isTyping?<div>Typing...</div>:<></>}
                        <TextField
                        id="filled-textarea"
                        label={''}
                        placeholder="Messsage..."
                        // multiline
                        // maxRows={4}
                        minWidth={"100px"}
                        variant="outlined"
                        fullWidth
                        onKeyUp={(e)=>{handleSend(e)}}
                        value={message}
                        onChange={e =>{typingHandle(e)}}    
                    /> 
                    </Box>
                    
            </Box>) :
                (<Box display={'flex'} alignItems={"center"} justifyContent={"center"} height="100%" >
                    <Typography fontSize={"xx-large"} color={"grey"}>Click on a user to start chatting</Typography>
                </Box>)}
        </>
    )
}

export default SingleChat
