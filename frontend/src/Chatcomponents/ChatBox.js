import { Box } from '@mui/material'
import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat'

function ChatBox({fetchAgain, setFetchAgain}) {
    const {selectedChat}  = ChatState()
    //const matches = useMediaQuery('(min-width:600px)');
    return (
        <Box
            display={"flex"}
            sx={{ display: !selectedChat ? { xs: 'none', sm: 'block', md: 'block', lg: 'block' } : {}, color: "black"}}
            flexDirection={"column"}
            alignItems={"center"}
            padding={2}
            m={1}
            // mt={1}
            height={"90vh"}
            width="100%"
            bgcolor={"white"}
            // width={{ md: "40%" }}
            borderRadius={"10px"}
            overflow={"hidden"}
        >
            {/* <Box display={'flex'} alignItems={"center"} justifyContent={"center"} height="100%"> */}
                <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
            {/* </Box> */}
        </Box>
    )
}

export default ChatBox
