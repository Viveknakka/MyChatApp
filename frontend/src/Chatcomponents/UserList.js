import { Avatar, Box, Typography, Button } from '@mui/material';
import React from 'react';
import axios from 'axios';

function UserList({ user, currentUserId, handleFunction }) {
    // Function to handle adding a friend
    const handleAddFriend = async () => {
        try {
            // Get user token from local storage or context
            const userInfo = JSON.parse(localStorage.getItem('userinfo'));
            const token = userInfo.token; // Assuming token is stored in userinfo

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, // Include token in headers
                },
            };

            const response = await axios.put('/api/user/addfriend', {
                id: currentUserId, // Current user's ID
                friendId: user._id, // ID of the user to be added as a friend
            },config);

            console.log('Friend added:', response.data.message);
            // Optionally, update local state or show a notification here
        } catch (error) {
            console.error('Error adding friend:', error);
            // Handle error (e.g., show a notification to the user)
        }
    };

    return (
        <div>
            <Box
                sx={{
                    width: "100%",
                    height: "45px",
                    cursor: 'pointer',
                    color: 'black',
                    px: 3,
                    py: 2,
                    mb: 2,
                    borderRadius: "10px",
                    backgroundColor: '#E8E8E8',
                    "&:hover": { backgroundColor: "#38B2AC", color: 'white' }
                }}
                display={"flex"}
                alignItems={"center"}
                onClick={handleFunction} // Function to view user profile
            >
                <Avatar mr={2} size="sm" cursor="pointer" name={user.name} src={user.pic} />
                <Box sx={{ flexGrow: 1 }}>
                    <Typography sx={{ mx: 3 }}>{user.name}</Typography>
                    <Typography sx={{ mx: 3, fontSize: 'small' }}>{user.email}</Typography>
                </Box>
                {/* Add Friend Button */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddFriend} // Call add friend function on click
                >
                    Add Friend
                </Button>
            </Box>
        </div>
    );
}

export default UserList;
