import { Avatar, Box,  Typography } from '@mui/material'

import React from 'react'

function UserList({user,handleFunction}) {
    return (
        <div>
            <Box sx={{ width: "100 %", height: "45px", cursor: 'pointer', color: 'black', px: 3, py: 2, mb: 2, borderRadius: "10px", backgroundColor: '#E8E8E8', "&:hover": { backgroundColor: "#38B2AC", color: 'white' } }} display={"flex"} alignItems={"center"} onClick={handleFunction}>
                <Avatar mr={2} size="sm" cursor="pointer" name={user.name} src={user.pic}/>
                <Box>
                    <Typography sx={{mx:3}}>{user.name}</Typography>
                    <Typography sx={{mx:3,fontSize:'small'}}>{user.email}</Typography>
                </Box>
            </Box>
        </div>
    )
}

export default UserList
