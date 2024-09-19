import { Avatar, Box, Flex, VStack,Text,Link, Portal } from "@chakra-ui/react"
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { Link as RouterLink } from "react-router-dom";  
import { Button, useToast } from "@chakra-ui/react";
import User from "../../../backend/models/user.model";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/usersAtom";
import { useState } from "react";
import useShowToast from "../hooks/useShowtoast";





const UserHeader = ({user}) => {

    const toast = useToast();
    const currentUser = useRecoilValue(userAtom)
    const [following, setFollowing] = useState(user.followers.includes(currentUser?._id));
    // console.log(following)
    const showToast = useShowToast();
    const [updating, setUpdating] = useState(false);

    const handleFollowUnFollow = async () => {

        if(!currentUser){
            showToast("Error", "Please login to follow", "error")
        }
        setUpdating(true);
        try {
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method:"POST",

                headers:{
                    "Content-Type": "application/json",
                },
               
            })
            const data = await res.json();
            if(data.error){
              showToast("Error", data.error, "error")
              return;
            }
            console.log(data)

            if(following){
                showToast("Success", `unfollowed ${user.name}` , "success");
                user.followers.pop();
            }
            else
            {
                showToast("Success", `Followed ${user.name}` , "success");
                user.followers.push(currentUser?._id);
            }
            setFollowing(!following)

          } catch (error) {
          showToast("Error", error.message, "error");
            console.log(error)
          }
          finally{
            setUpdating(false)
          }
    } 

    const copyURL = () => {
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(() =>{
            toast({
				title: "Success.",
				status: "success",
				description: "Profile link copied.",
				duration: 3000,
				isClosable: true,
			});
        })
    }



  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justify={"space-between"} w={"full"}>
            <Box    >
                <Text fontSize={"2xl"} fontWeight={"bold"}>
                        {user.fullName}
                </Text>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"sm"}>
                    {user.username}</Text>
                    <Text fontSize={"xs"} bg={"gray.dark"} color={"gray.light"} p={1} borderRadius={"full"}>threads.net</Text>
                </Flex>
            </Box>

            <Box>
                <Avatar
                name={user.fullName}
                src={user.profilePic}
                size={{
                    base: "md",
                    md :"lg"
                }}
                />
            </Box>
      </Flex>

    <Text>{user.bio}</Text>
        {
            currentUser?._id === user._id && (
                <Link as={RouterLink} to='/update'>
                    <Button size={"sm"}>Update Profile</Button>
                </Link>
            )
        }
         {
            currentUser?._id !== user._id && (
                    <Button size={"sm"} onClick={handleFollowUnFollow} isLoading={updating}>{following ? "Unfollow" : "Follow"}</Button>
            )
        }


      <Flex w={"full"} justify={"space-between"}>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} borderRadius={"full"}>{user.followers.length} followers</Text>
                <Box w="1"h="1" bg={"gray.light"} borderRadius={"full"}></Box>
                <Link color={"gray.light"}>instagram.com</Link>
            </Flex>
            <Flex>
                <Box className='icon-container'>
                    <BsInstagram size={24} cursor={"pointer"}/>
                </Box>

                <Box className='icon-container'>
                    <Menu>
                        <MenuButton>
                            <CgMoreO size={24} cursor={"pointer"}/>
                        </MenuButton>
                        <Portal>
                            <MenuList bg={"gray.dark"}>
                                <MenuItem bg={"gray.dark"} onClick={copyURL}>Copy Link</MenuItem>
                            </MenuList>
                        </Portal>
                    </Menu>
                </Box>
                
            </Flex>
      </Flex>
      <Flex w={"full"}>
                <Flex flex={1} borderBottom={"1.5px solid white"} justifyContent={"center"} padding="3" cursor={"pointer"}>
                    <Text fontWeight={"bold"}>Threads</Text>
                </Flex>
                <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} color={"gray.light"} padding="3" cursor={"pointer"} >
                    <Text fontWeight={"bold"}>Replies</Text>
                </Flex>
            </Flex>
    </VStack>
  )
}

export default UserHeader
