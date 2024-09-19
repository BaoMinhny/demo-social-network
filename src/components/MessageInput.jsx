import { Flex, Image, Input, 
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal, ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { IoSendSharp } from "react-icons/io5";
import { conversationsAtom, selectedConversationAtom } from '../atoms/messagesAtom';
import useShowToast from '../hooks/useShowtoast';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { BsFillImageFill } from 'react-icons/bs';
import usePreviewimg from "../hooks/usePreviewimg.js"
import Filter from 'bad-words'
// import encryptText from "../utils/encryption.js"

const MessageInput = ({setMessages}) => {
  const selectedConversation = useRecoilValue (selectedConversationAtom);
  const showToast = useShowToast();
  const [messagesText, setMessageText] = useState("");
  const setConversations = useSetRecoilState(conversationsAtom);
  const imageRef = useRef(null);
  const {onClose} = useDisclosure();
  const {handleImageChange, imgUrl, setImgUrl} = usePreviewimg();
  const [isSending, setIsSending] = useState(false);


  const FilterBadword = new Filter();

  // console.log("Sending message with imgUrl:", imgUrl);

  const handleSendMessage = async  (e) => {
    e.preventDefault();
    if (!messagesText && !imgUrl) return;
    if (isSending) return;

    if (FilterBadword.isProfane(messagesText)) {
      showToast("Error", "Nội dung có chứa từ ngữ nhạy cảm", "error");
      return;
    }
		setIsSending(true);


    setIsSending(true);
    try {
      // const encryptedMessage = encryptText(messagesText);

      const res = await fetch("/api/messages",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // message: encryptedMessage,
          message: messagesText,
          recipientId: selectedConversation.userId,
          img: imgUrl,
        })
      })
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      console.log(data)
      setMessageText("")
      setMessages((messages) => [...messages, data])
      
      setConversations(prevConvs =>{
        const updateConvesations = prevConvs.map(conversation => {
          if(conversation._id === selectedConversation._id){
            return {
              ...conversation,
              lastMessage: {
                text: messagesText,
                sender: data.sender
              }
            }
          }
          return conversation;
        })
        return updateConvesations;
      });
      setMessageText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
			setIsSending(false);
		}
  }


  return (
    <Flex gap={2} alignItems={"center"} >
    <form onSubmit={handleSendMessage} style={{ flex: 95 }}>
        <InputGroup onSubmit={handleSendMessage}>
        <Input        
            w={"full"}
            placeholder='Type a message'
            onChange={(e) => setMessageText(e.target.value)}
            value={messagesText}
        />
        <InputRightElement onClick={handleSendMessage} cursor={"pointer"}>
         <IoSendSharp color='green.500'/>
        </InputRightElement>
        </InputGroup>
    </form>

    <Flex flex={5} cursor={"pointer"}>
				<BsFillImageFill size={20} onClick={() => imageRef.current.click()} />
				<Input type={"file"} hidden ref={imageRef} onChange={handleImageChange} />
			</Flex>
			<Modal
				isOpen={imgUrl}
				onClose={() => {
					onClose();
					setImgUrl("");
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex mt={5} w={"full"}>
							<Image src={imgUrl} />
						</Flex>
						<Flex justifyContent={"flex-end"} my={2}>
            
							{!isSending ? (
								<IoSendSharp size={24} cursor={"pointer"} onClick={handleSendMessage} />
							) : (
								<Spinner size={"md"} />
							)}
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		
    </Flex>
  )
}

export default MessageInput
