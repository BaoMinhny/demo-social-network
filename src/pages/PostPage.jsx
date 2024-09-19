import { Avatar, Flex,Image,Text,Box,Divider,Button, Spinner } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { BsThreads, BsThreeDots } from 'react-icons/bs'
import Actions from '../components/Actions'
import Comment from '../components/Comment'
import useGetUserProfile from '../hooks/useGetUserProfile'
import useShowToast from '../hooks/useShowtoast'
import { useNavigate, useParams } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from '../atoms/usersAtom'
import { DeleteIcon } from '@chakra-ui/icons'
import postsAtom from '../atoms/postAtom'


const PostPage = () => {
    
    const {user, loading} = useGetUserProfile();
    const showToast = useShowToast();
    const [posts, setPosts] = useRecoilState(postsAtom)
    const {pid} = useParams();
    const currentUser = useRecoilValue(userAtom);
    const navigate = useNavigate();


    const currentPost = posts[0];
    
    useEffect(() => {
        const getPost = async () => {
			try {
				const res = await fetch(`/api/posts/${pid}`);
				const data = await res.json();
                console.log(data)
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				console.log(data)
                setPosts([data]);
			} catch (error) {
				showToast("Error", error.message, "error");
			}
		};

		getPost();
	},[showToast, pid, setPosts]);
   

    const handleDeletePost = async () => {
        try {
            if(!window.confirm("Are you sure you want to delete this post")) return;
                const res = await fetch(`/api/posts/delete/${currentPost._id}`, {
                    method: "DELETE",
                });
                const data = await res.json();
                if(data.error){
                    showToast("Error", data.error, "error");
                    return;
                }
                showToast("Success", "Posted deleted", "success");
                navigate(`/${user.username}`)
        } catch (error) {
                showToast("Error", error.message, "error");
        }
    }

    if(!user && loading) {
        return(
            <Flex justifyContent={"center"}>
                <Spinner size={"xl"}/>
            </Flex>
        )
    }

    if(!currentPost) return null;
    console.log("curentPost", currentPost)
  return (
    <>
    <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
            <Avatar src={user.profilePic}  size={"md"} name='Bao Minh'/>
            <Flex>
                <Text fontSize={"sm"} fontWeight={"bold"}>
                    {user.username}
                </Text>
                <Image src='/verified.png' w={4} h={4} ml={4}/>
            </Flex>
        </Flex>
            <Flex gap={4} alignItems={"center"}>
				<Text fontSize={"xs"} color={"gray.light"} width={36} textAlign={"right"} >
						{formatDistanceToNow(new Date(currentPost.createdAt))} ago
				</Text>
						{currentUser?._id === user._id && <DeleteIcon size={20} onClick={handleDeletePost} />}

			</Flex>
    </Flex>
    <Flex>
        <Text my={3} textAlign={"left"}>{currentPost.text}</Text>
    </Flex>

    <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
		<Image src={currentPost.img} w={"full"} />
	</Box>

    <Flex gap={3} my={1}>
		<Actions post={currentPost}/>
	</Flex>

            {/* <Flex gap={2} alignItems={"center"}>
								<Text color={"gray.light"} fontSize='sm'>
									123 replies
								</Text>

								<Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>

								<Text color={"gray.light"}>
									456 likes
								</Text>
	        </Flex> */}
            <Divider my={4} />

			<Flex justifyContent={"space-between"}>
				<Flex gap={2} alignItems={"center"}>
					<Text fontSize={"2xl"}>👋</Text>
					<Text color={"gray.light"}>Get the app to like, reply and post.</Text>
				</Flex>
				<Button>Get</Button>
		    </Flex>

            <Divider my={4}/>
            
            {currentPost.replies.map(reply => (
                    <Comment
                        key={reply._id}
                        reply={reply}
                        lastReply={reply._id == currentPost.replies[currentPost.replies.length - 1 ]._id}
                    />
        
            ))}
            
    </>
  )
}

export default PostPage


