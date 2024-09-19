import React from 'react'
import { Box, Button, Center, Flex, Input, Skeleton, SkeletonCircle, Text, useColorModeValue } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { GiConversation } from "react-icons/gi";
import Conversation from '../components/Conversation'
import MessageContainer from '../components/MessageContainer';
import useShowToast from '../hooks/useShowtoast';
import { useEffect } from 'react';
import { useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {conversationsAtom} from "../atoms/messagesAtom"
import {selectedConversationAtom} from "../atoms/messagesAtom"
import userAtom from '../atoms/usersAtom';
import { useSocket } from '../../context/SocketContext';

const ChatPage = () => {
  const showToast = useShowToast();
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [conversations, setConversations] = useRecoilState(conversationsAtom)
  const [selectedConversation, setSelectedConversation] = useRecoilState(selectedConversationAtom)
  const [searchText, setSearchText] = useState("");
  const[searchingUser, setSearchingUser] = useState(false);
  const currentUser = useRecoilValue(userAtom);
  const {socket, onlineUsers} = useSocket();

  useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await fetch("/api/messages/conversations");
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data);
				setConversations(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingConversations(false);
			}
		};

		getConversations();
	}, [showToast, setConversations]);

  useEffect(() => {
		socket?.on("messagesSeen", ({ conversationId }) => {
			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === conversationId) {
						return {
							...conversation,
							lastMessage: {
								...conversation.lastMessage,
								seen: true,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});
	}, [socket, setConversations]);


  const handleConversationSearch = async (e) => {
    e.preventDefault();
    setSearchingUser(true);

    try {
      const res = await fetch(`/api/users/profile/${searchText}`)
      const searchUser = await res.json();

      if(searchUser.error){
        showToast("Error", searchUser.error, "error");
        return;
      }
      if(searchUser._id === currentUser._id){
        showToast("Error", "you can not message your self", "error")
        return;
      }

      const messagingYourSelf = searchUser._id === currentUser._id;
      if(messagingYourSelf){
        showToast("Error", "you can't not message yourseft", "error")
        return;
      }

      const conversationAlreadyExists = conversations.find(
        (conversation) => conversation.participants[0]._id === searchUser._id
      );
      if (conversationAlreadyExists) {
				setSelectedConversation({
					_id: conversationAlreadyExists._id,
					userId: searchUser._id,
					username: searchUser.username,
					userProfilePic: searchUser.profilePic,
				});
				return;
      }

      if(conversations.find(conversation => conversation.participants[0]._id === searchUser._id)){
        setSelectedConversation({
          _id: conversations.find(conversation => conversation.participants[0]._id === searchUser._id)._id,
          userId: searchUser._id,
          username: searchUser.username,
          userProfilePic: searchUser.profilePic
        })
        return;
      }

      const mockConversation = {
        mock: true,
        lastMessage:{
            text: "",
            sender: "",
        },
        _id: Date.now(),
        participants: [
          {
            _id: searchUser._id,
            username: searchUser.username,
            profilePic: searchUser.profilePic
          }
        ]
      };
      setConversations((prevConvs) => [...prevConvs, mockConversation]);
    } catch (error) {
      showToast("Error", error.message, "error")
    }finally{
      setSearchingUser(false)
    }
  }

  return (
    
    <Box 
    position={"absolute"}
    // left={"50%"}
    w={{base:"100%", md: "80%", lg:"750px"}}
    transform={"translateX{-50px}"}
    p={4}
    // border={"1px solid red"}
    > 
        <Flex
         gap={4}
         flexDirection={{
          base:"column",
          md:"row"
         }}
         maxW={{
          sm:"400px",
          md:"full"
         }}
         mx={"auto"}
         >
            <Flex 
            flex={30} gap={2}
            flexDirection={"column"}
            maxW={{
              sm:"250",
              md:"full"
            }}
            mx={"auto"}>
              <Text fontWeight={700} color={useColorModeValue("gray.600", "gray.400")}>Your conversations</Text>
              <form>
                  <Flex alignItems={"center"} gap={2}>
                      <Input placeholder='Search for a user' onChange={(e) => setSearchText(e.target.value)}/>
                      <Button size={"sm"} type='submit' onClick={handleConversationSearch} isLoading={searchingUser}>
                          <SearchIcon/>
                      </Button>
                  </Flex>
              </form>
              {loadingConversations && 
                [0,1,2,3,4].map((_, i) => (
                  <Flex key={i} gap={4} alignItems={"center"} p={"1"} borderRadius={"md"}>
                        <Box>
									          <SkeletonCircle size={"10"} />
								        </Box>
                        <Flex w={"full"} flexDirection={"column"} gap={3}>
									          <Skeleton h={"10px"} w={"80px"} />
									          <Skeleton h={"8px"} w={"90%"} />
								        </Flex>
                  </Flex>
                ))}

            
					{!loadingConversations &&
						conversations.map((conversation) => (
							<Conversation
								key={conversation._id}  
								isOnline={onlineUsers.includes(conversation.participants[0]._id)}
								conversation={conversation}
							/>
						))}


            </Flex>
            {!selectedConversation._id && (
              <Flex 
              flex={70}
              borderRadius={"md"}
              p={2}
              flexDir={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              height={"400px"}
              > 
                  <GiConversation size={100} />
                  <Text fontSize={20}>Select a conversation to start messaging</Text>
              </Flex>
            )}

            {selectedConversation._id && <MessageContainer/>}
        </Flex>
    </Box>
  )
}

export default ChatPage
