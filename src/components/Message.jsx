import { Avatar, Flex, Text,Box,Image, useDisclosure, ModalOverlay, Modal, ModalContent, ModalBody } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { selectedConversationAtom } from '../atoms/messagesAtom'
import userAtom from '../atoms/usersAtom'
import { BsCheck2All } from 'react-icons/bs'
import { formatDistanceToNow } from "date-fns";



const Message = ({ownMessage, message ,isLastMessage }) => {
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const user = useRecoilValue(userAtom)
  // console.log(isLastMessage)
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImg, setSelectedImg] = useState("");

  const handleImageClick = (imgUrl) => {
    setSelectedImg(imgUrl);
    onOpen();
  };
 
  return (
    <>
    {ownMessage ? (
    <Flex gap={2} alignSelf={"flex-end"} flexDirection={"column"}>
      <Flex gap={2}>

        {message.text && ( 
        <Flex bg={"green.800"} maxW={"350px"} p={1} borderRadius={"md"}>
          <Text color={"white"}> {message.text} </Text>     
               <Box  alignSelf={"flex-end"}	ml={1} color={message.seen ? "green.400" : ""} fontWeight={"bold"} >
							    	<BsCheck2All size={16} />  
							</Box>     
          </Flex> 
        )}
         {message.img && (
          <Flex mt={5} w={"200px"} cursor="pointer" onClick={() => handleImageClick(message.img)}>
              <Image
                  src={message.img}
                  alt='message image'
                  borderRadius={4}
              />
          </Flex>)}      
         <Avatar src={user.profilePic} w={7} h={7}/> 
         </Flex> 

         {isLastMessage && (
            <Flex alignSelf={"flex-end"}>
              <Text fontSize="xs" color="gray.300" alignSelf="flex-start">
                {formatDistanceToNow(new Date(message.createdAt))} ago
              </Text>
            </Flex>
          )}
    </Flex>
    ): (
            <Flex gap={2} >
                 <Avatar src={selectedConversation.userProfilePic} w={7} h={7}/>
                    <Text maxW={"350px"} bg={"gray.500"} p={1} borderRadius={"md"}>
                        {message.text}
                       
            </Text>
    </Flex>
    )}
    
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Image src={selectedImg} alt="Preview image" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Message
