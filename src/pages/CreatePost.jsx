import { AddIcon } from '@chakra-ui/icons'
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	Textarea,
	useColorModeValue,
} from "@chakra-ui/react";
import { useDisclosure } from '@chakra-ui/react';
import { BsFillImageFill } from "react-icons/bs";
import React, { useRef, useState } from 'react'
import usePreviewImg from '../hooks/usePreviewimg';
import { useRecoilState, useRecoilValue } from 'recoil';

import useShowToast from '../hooks/useShowtoast';
import userAtom from '../atoms/usersAtom';
import postsAtom from '../atoms/postAtom';
import { useParams } from 'react-router-dom';


const MAX_CHAR = 500;

const CreatePost = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();

    const imageRef = useRef(null);
    const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
    const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
    const user = useRecoilValue(userAtom);
    const showToast = useShowToast();
	const[loading, setLoading] = useState(false);
	const [postText, setPostText] = useState("");
	const [posts, setPosts]= useRecoilState(postsAtom);
	const {username} = useParams();


    const handleTextChange = (e) => {
		const inputText = e.target.value;

		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
			setRemainingChar(MAX_CHAR - inputText.length);
		}
	}

    const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
            if (!postText.trim()) { // Kiểm tra nếu nội dung bài viết rỗng
				showToast("Warning", "Nội dung bài viết không được để trống", "warning");
				return;
			}
			handleCreatePost();
            
		}
	};

    const handleCreatePost = async () => {
		setLoading(true)
        try {
			const res = await fetch("/api/posts/create",{
				method: "POST",
				headers:{
					"Content-Type": "application/json"
				},
				body: JSON.stringify({postedBy: user._id, text: postText, img:imgUrl})
			})
			const data = await res.json();
	
			if(data.error){
				showToast("Error", data.error, "error")
				return
			}
			console.log(data)
			showToast("Success", "Post create succesfully", "success")
			if(username === user.username){
				setPosts([data, ...posts])
			}
			
			onClose();
			setPostText(""),
			setImgUrl("")
		} catch (error) {
			showToast("Error", error, "error")
		}
		finally{
			setLoading(false)
		}
    };
    
  return (
    <>
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        bg={useColorModeValue("gray.300", "gray.dark")}
        onClick={onOpen}
		size={{base:"sm", sm: "md", md:"lg"}} >
            <AddIcon/>
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} >
				<ModalOverlay />

				<ModalContent>
					<ModalHeader>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder='Post content goes here..'
								onChange={handleTextChange}
								value={postText}
                                onKeyDown={handleKeyDown}
							/>
							<Text fontSize='xs' fontWeight='bold' textAlign={"right"} m={"1"} color={"gray.800"}>
								{remainingChar}/{MAX_CHAR}
							</Text>

							<Input type='file' accept="image/png, image/jpeg" hidden ref={imageRef} onChange={handleImageChange} />

							<BsFillImageFill
								style={{ marginLeft: "5px", cursor: "pointer" }}
								size={16}
								onClick={() => imageRef.current.click()}
							/>
						</FormControl>

						{imgUrl && (
							<Flex mt={5} w={"full"} position={"relative"}>
								<Image src={imgUrl} alt='Selected img' />
								<CloseButton
									onClick={() => {setImgUrl("");}}
									bg={"gray.800"}
									position={"absolute"}
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme='blue' mr={3} onClick={handleCreatePost} isLoading={loading} >
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
    </>
  )
}

export default CreatePost
