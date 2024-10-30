import { Add } from '@mui/icons-material'
import {  Avatar, Box, Button, IconButton, Modal, TextField, Typography } from '@mui/material'
import axios from 'axios'
import React, {  useEffect, useState } from 'react'
import { getSender, getSenderDetails } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import env from '../Settings'
import ChatLoading from './ChatLoading'
import CloseIcon from '@mui/icons-material/Close';
import UserList from './UserList'
import UserBadgeItem from './UserBadgeItem'
import useMediaQuery from '@mui/material/useMediaQuery';


function MyChats({fetchAgain}) {
    //const t = ChatState()
    const {selectedChat,setSelectedChat, user, chats, setChats} = ChatState()
    const [loggedUser, setLoggedUser] = useState()
    const [open,setOpen] = useState(false)
    const [loading,setLoading] = useState(false)
    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    //const [search, setSearch] = useState()
    const [searchResult, setSearchResult] = useState()
    const matches = useMediaQuery('(min-width:600px)');
    // console.log(t.user)
    // console.log(user)
    const fetchChats = async () => {
        const userInfo = JSON.parse(localStorage.getItem('userinfo'))
        try {
            const config = {
                    headers: {
                        Authorization:`Bearer ${userInfo.token}`
                    }
                }    
            const {data}= await axios.get(`${env.api}/api/chat`, config);
            console.log((data))
            setChats(data)
            console.log(chats)
        } catch (error) {
            console.log(error)
        }
    }
    const handleGroup = (user) => {
        if (selectedUsers.includes(user)) {
        console.log(selectedUsers)
            return;

        }
        setSelectedUsers([...selectedUsers, user])
        console.log(selectedUsers)
    }
    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false); setSelectedUsers([]);setSearchResult([])};
    const handleSearch = async (query) => {
        if (!query) {
            return;
        }
        try {
        const userInfo = JSON.parse(localStorage.getItem('userinfo'))
            setLoading(true)
            const config = {
                headers: {
                    Authorization:`Bearer ${userInfo.token}`
                }
            }
            const { data } = await axios.get(`${env.api}/api/user?search=${query}`, config)
            console.log(data)
            setSearchResult(data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (selectedUsers.length <= 1) {
            console.log(selectedUsers.length)
            alert("Please Select atleast 2 users");
            return;
        }
        try {
        const userInfo = JSON.parse(localStorage.getItem('userinfo'))
           const config = {
                headers: {
                    Authorization:`Bearer ${userInfo.token}`
                }
            }
            const { data } = axios.post(`${env.api}/api/chat/group`, {
                name: groupChatName,
                users:JSON.stringify(selectedUsers.map((user)=>user._id))
            }, config)
            setChats([data, ...chats])
            handleClose()
        } catch (error) {
            console.log(error)
        }
        
    }
    const handleDelete = (user) => {
        setSelectedUsers(selectedUsers.filter(sel=>sel._id !==user._id))
    }
    const handleSelect = (e,chat) => {
        e.preventDefault();
        setSelectedChat(chat) 

    }
    useEffect(async () => {
        setLoggedUser(JSON.parse(window.localStorage.getItem('userinfo')))
        await fetchChats()
        // console.log(chats)
        console.log(Boolean(selectedChat))
    }, [fetchAgain])
    return (
            <Box
                display={"flex"}
                sx={{ display: selectedChat ? { xs: 'none', sm: 'block', md: 'block', lg: 'block' } : {}, color: "white"}}
                flexDirection={"column"}
                alignItems={"center"}
                justifyContent={"space-between"}
                padding={2}
                // mr={1}
                height={"90vh"}
                width={matches?"40%":"100%"}
                backgroundColor={'blue '}
                borderRadius={"10px"}
                overflow={"hidden"}
            >
                <Box
                    pb={3}
                    px={3}
                    fontFamily={"Work sans"}
                    color={"white"}
                    display={"flex"}
                    // width="100%"
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    position={"relative"}
                >
                    <Typography width={30} fontSize={{ base: "28px", md: "30px" }}>My Chats</Typography>
                   
                    <Button
                    // display={"flex"}
                    // fontSize={{ base: "17px", md: "10px", lg: "17px" }} 
                    sx={{ml:"auto",mr:'0px'}}
                    endIcon={<Add />}
                    onClick={handleOpen}
                    color='inherit'
                    >
                        New Group Chat
                    </Button>
                            <Modal
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                            >
                                <Box sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    width:!matches?300:400,
                                    bgcolor: 'background.paper',
                                    border: '2px solid #000',
                                    boxShadow: 24,
                                    p: 4,
                                    m:'auto'
                                }}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                Create a new group
                                        <IconButton
                                            aria-label="close"
                                            onClick={handleClose}
                                            sx={{
                                                position: 'absolute',
                                                right: 8,
                                                top: 8,
                                                color: (theme) => theme.palette.grey[500],
                                            }}
                                            ><CloseIcon/></IconButton>
                            </Typography>
                            
                                <Box id="modal-modal-description" sx={{ mt: 2, '& .MuiTextField-root': { m: 1, width: '25ch' } }}>
                                <TextField
                                    required
                                    id="outlined-name"
                                    label="Group Name"
                                    type="text"
                                    value={groupChatName}
                                    onChange={(e)=>{setGroupChatName(e.target.value)}}
                                />
                                <TextField
                                    id="outlined-users"
                                    label="Add Users - Eg: Gopi, Arun"
                                    type="text"
                                    mt={2}
                                    onChange={(e)=>{handleSearch(e.target.value)}}
                                />
                                <Box width={"100%"} display={"flex"} flexWrap={"wrap"}>
                                {selectedUsers? (selectedUsers.map(user => {return( <UserBadgeItem key={user._id} user={user} handleFunction={()=>handleDelete(user) }/>)})): <>Please Select</>  }
                                </Box>
                                {loading ? <div>Loading...</div> : (searchResult?.slice(0, 4).map(user => (<UserList key={user._id} user={user} handleFunction={()=>{handleGroup(user)}}/>)))}
                                <Button variant='filled' disabled={!groupChatName || !selectedUsers.length} sx={{backgroundColor:"blueviolet", color:'white',mx:"30%","&:hover": { backgroundColor: "green" }}} onClick={e=>handleSubmit(e)}>
                                    Create Group
                                </Button>
                                </Box>
                                </Box>
                            </Modal>

                </Box>
                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    p={2}
                    bgcolor="#F8F8F8"
                    width="100%"
                    height="100%"
                    borderRadius={"10px"}
                    overflow={"scroll"}
                >
                    {chats ? <>
                        {chats.map((chat) => {
                            return (
                                <Box
                                    onClick={(e) => {handleSelect(e,chat)}}
                                    sx={{"&:hover": { backgroundColor: "#38B2AC", color: 'white' }}}
                                    cursor='pointer'
                                    bgcolor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                    color={selectedChat === chat ? "white" : "black"}
                                    px={3}
                                    py={2}
                                    mb={2}
                                    display={'flex'}
                                    alignItems={'center'}
                                    borderRadius={"10px"}
                                    key={chat._id}

                                >
                                    <Avatar mr={2} size="sm" cursor="pointer" src={chat.isGroupchat?"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqueJcsJ6yi70JhOmBC8fXBYQjzGDBG9OQ9A&usqp=CAU":getSenderDetails(loggedUser,chat.users).pic}/>
                                    <Box pl={2}>
                                        <Typography>
                                        {chat.isGroupchat ? chat.chatName: getSender(loggedUser, chat.users)}
                                    </Typography>
                                    {chat.latestMessage && (
                                        <Typography fontSize="xs">
                                            <b>{chat.latestMessage.sender.name} : </b>
                                            {chat.latestMessage.content.length > 50
                                                ? chat.latestMessage.content.substring(0, 51) + "..."
                                                : chat.latestMessage.content}
                                        </Typography>)}
                                    </Box>
                                </Box>)
                            })}
                        
                    </> : <ChatLoading />}
                </Box>
            </Box>
    )
}

export default MyChats
