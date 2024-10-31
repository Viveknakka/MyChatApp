import React, { useState } from 'react'
import { Avatar, Box, Button, Divider, Drawer, List, ListItem, Menu, MenuItem, TextField, Tooltip, Typography, useMediaQuery } from '@mui/material';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ProfileDialog from './Profile';

import { ChatState } from '../Context/ChatProvider';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import env from '../Settings'
import UserList from './UserList';
import { getSender } from '../config/ChatLogics';
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';
import { Effect } from 'react-notification-badge';

function SideDrawer() {
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorE2, setAnchorE2] = useState(null);
    const open = Boolean(anchorEl);
    const open2 = Boolean(anchorE2)
    const [open3, setOpen] = useState(false);
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();
    const history = useHistory()
    const [toggle, setToggle] = useState(false);
    const matches = useMediaQuery('(max-width:300px)');

    const toggleDrawer = (state,e) => {
        e.preventDefault()
        setToggle(state)
    }
    const logoutHandler = (e) => {
        e.preventDefault();
        localStorage.removeItem('userinfo');
        history.push('/')
    }
    const handleResetPassword = async (e) =>{
        console.log("reset password");
        history.push("/reset");
    }
    const handleClickOpen = (e) => {
        e.preventDefault()
        setOpen(true);
  };
    const handleClose3 = (e) => {
        e.preventDefault()
        setOpen(false);
  };
    const handleClick = (event) => {
        event.preventDefault()
        setOpen(false);
        setAnchorEl(event.currentTarget);
    };
    const handleClick2 = (event) => {
        setAnchorE2(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleClose2 = () => {
        setAnchorE2(null);
    };
    const accessChat = async (userId) => {
        try {
        const userInfo = JSON.parse(localStorage.getItem('userinfo'))

            setLoadingChat(true)
            const config = {
                headers: {
                        "Content-type":"application/json",
                        Authorization:`Bearer ${userInfo.token}`
                    }
            }
            const { data } = await axios.post(`${env.api}/api/chat`, { userId }, config)
            if (!chats.find((c)=>c._id===data._id)) setChats([data,...chats])
            setSelectedChat(data);
            setLoadingChat(false)

            // toggleDrawer(false)
        } catch (error) {
            setLoadingChat(false)
            console.log(error)
            alert('something went wrong')
        }
    }
    const handleUsers = async (e) => {
        e.preventDefault()
        if (!search.trim()) { return }
        try {
                setLoading(true);
                const config = {
                    headers: {
                        "Content-type":"application/json",
                        Authorization:`Bearer ${user.token}`
                    }
                }
            const { data } = await axios.get(`${env.api}/api/user?search=${search}`, config);
            setSearchResult(data)
                console.log(data)
                setLoading(false)
            } catch (error) {
            console.log(error)
            setLoading(false)
            alert('something went wrong')
        }   
    }
    const [search, setSearch] = useState('');
    const [serachResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    // console.log(user)
    return (
        <div>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{
                width: "100%",
                height: 50,
                backgroundColor: 'darkblue',
                
            }}>
                <Tooltip title="Search Users in the Chat" arrow placement='bottom-end'>
                    <Button onClick={e=>toggleDrawer(true,e)} variant='filled' display="flex" justifyContent="space-between" alignItems="center" color='inherit' size='small' sx={{mx:3,height:"30px", color:'white'}}>
                        <i class='fas fa-search'></i>
                        <p className='d-none d-sm-block px-3 pt-3'>Search User</p>
                    </Button>
                </Tooltip>
                {matches?<></>:<Typography className='px-3 p-3' style={{ fontWeight: "bold",fontSize: "35px", color:"white" }}>Chat Application</Typography>}
                <div className='d-flex justify-content-around align-items-center'>
                    <Tooltip title="Notifications">
                        <Button
                            id="basic-button"
                            aria-controls={open2 ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open2 ? 'true' : undefined}
                            onClick={handleClick2}
                        >
                            <CircleNotificationsIcon backgroundColor={"white"} />
                            <NotificationBadge count={notification.length} effect={ Effect.SCALE}/>
                            
                        </Button>
                    </Tooltip>
                    <Menu
                        anchorEl={anchorE2}
                        id = "notifications"
        open={open2}
        onClose={handleClose2}
        onClick={handleClose2}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>     
                        <MenuItem>
                            {!notification.length && 'No new messages'}
                        </MenuItem>
                        {notification.map((item) => {
                            return(<MenuItem key={item._id} onClick={() => { setSelectedChat(item.chat); setNotification(notification.filter((n) => n !== item))}}>
                            {item.chat.isGroupchat?`New msg in ${item.chat.chatName}`:`New msg from ${getSender(user,item.chat.users)}`}
                            </MenuItem>)
                        })}
                    </Menu>

                    <Tooltip title="Account settings">
                        
                        <Button
                            onClick={handleClick}
                            size="small"
                            sx={{ ml: 2 }}
                            aria-controls={open ? 'account-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            endIcon={<KeyboardArrowDownIcon />}
                        >
                            <Avatar sx={{ width: 32, height: 32 }} src={user?user.pic:""} alt="user" ></Avatar>
                        </Button>
                    </Tooltip>
                    <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        // onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem>
        <Button onClick={handleClickOpen} >
            <Avatar src={ user?user.pic:""}/> Profile
        </Button>
        <ProfileDialog onClose={handleClose3} open={open3} user={user} />
                            
        </MenuItem>
        <MenuItem>
        <Button onClick={handleResetPassword} >Reset Password</Button>
        </MenuItem>
        <MenuItem>
        <Button onClick={logoutHandler
        }>Log out</Button>
        </MenuItem>
        <Divider />
                    </Menu>
        

                </div>
            </Box>
            <Drawer anchor='left' open={toggle} onClose={e=>toggleDrawer(false,e)}>
                <List>
                    <ListItem>
                        <TextField
                        id="standard-search"
                        label="Search Users"
                        type="search"
                            variant="outlined"
                            onChange={e =>setSearch(e.target.value)}
                        />
                        <Button variant="outlined" onClick={handleUsers}>Go</Button>
                    </ListItem>
                    {/* <ListItem> */}
                       {/* <ChatLoading/> */}
                    {loading ? <ChatLoading /> :
                            serachResult?.map((obj) => <UserList key={obj._id} user={obj} handleFunction={(e) => { accessChat(obj._id);toggleDrawer(false,e) }} />)
                        }
                    {/* </ListItem> */}
                </List>
            </Drawer>
        </div>
    )
}

export default SideDrawer
