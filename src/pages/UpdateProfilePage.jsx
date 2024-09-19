import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
    HStack,
    Avatar,
    AvatarBadge,
    IconButton,
    Center,
  } from '@chakra-ui/react';
  import { SmallCloseIcon } from '@chakra-ui/icons';
import { useState,useRef } from 'react';
import { useRecoilState } from 'recoil';
import userAtom from '../atoms/usersAtom';
import usePreviewImg from '../hooks/usePreviewimg';
import useShowToast from '../hooks/useShowtoast';
  
  export default function UpdateProfilePage(){
    const [user, setUser] = useRecoilState(userAtom)
    const showToast = useShowToast();

    const [inputs, setInputs] = useState({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      bio: user.bio,
      password:"",
      }) 
        // console.log(user)

      const fileRef = useRef(null);
  const {handleImageChange, imgUrl} = usePreviewImg();

        const handleSubmit = async (e) => {
          e.preventDefault();
          try {
            const res = await fetch(`/api/users/update/${user._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
            });
            const data = await res.json();
            if(data.error){
              showToast("Error", data.error,"error")
            }
            showToast("Success", "profile update successfully", "success")
            setUser(data)
            console.log(data)
          } catch (error) {
             showToast("Error", error, "error");
          }
        }

    return (
      <form onSubmit={handleSubmit}>
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        my={6}
        >
        <Stack
          spacing={4}
          w={'full'}
          maxW={'md'}
          bg={useColorModeValue('white', 'gray.dark')}
          rounded={'xl'}
          boxShadow={'lg'}
          p={6}
          my={12}>
          <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <FormLabel>User Icon</FormLabel>
                <Stack direction={['column', 'row']} spacing={6}>
                  <Center>
                    <Avatar size="xl" src={imgUrl || user.profilePic}>
                      <AvatarBadge
                          as={IconButton}
                          size="sm"
                          rounded="full"
                          top="-10px"
                          colorScheme="red"
                          aria-label="remove Image"
                          icon={<SmallCloseIcon />}
                        />
                      </Avatar>
                  </Center>
                  <Center w="full">
                      <Button w="full" onClick={ () =>fileRef.current.click() }>Change Avatar</Button>
                      < Input type='file' accept="image/png, image/jpeg" hidden ref={fileRef} onChange={handleImageChange}/>
                  </Center>
            </Stack>
          </FormControl>
          <FormControl>
						  <FormLabel>Full name</FormLabel>
						    <Input
                    value={inputs.fullName}
                    onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                    _placeholder={{ color: "gray.500" }}
                    type='text'
						    />
					</FormControl>
          <FormControl>
						  <FormLabel>User name</FormLabel>
						    <Input
                    value={inputs.username}
                    onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                    _placeholder={{ color: "gray.500" }}
                    type='text'
						    />
					</FormControl>
          <FormControl id="userName" isRequired>
              <FormLabel>Email Address</FormLabel>
              <Input
                  placeholder='your-email@example.com'
                  value={inputs.email}
                  onChange={(e) => setInputs({...inputs, email:e.target.value})}
                  _placeholder={{ color: 'gray.500' }}
                  type="text"
              />
          </FormControl>
          <FormControl isRequired>
              <FormLabel>Bio</FormLabel>
                <Input
                  placeholder='Your bio.'
                  value={inputs.bio}
                  onChange={(e) => setInputs({...inputs, bio:e.target.value})}
                  _placeholder={{ color: 'gray.500' }}
                  type="text"
                />
          </FormControl>
          <FormControl isRequired>
              <FormLabel>Password</FormLabel>
                <Input
                  placeholder='password'
                  value={inputs.password}
                  onChange={(e) => setInputs({...inputs, password:e.target.value})}
                  _placeholder={{ color: 'gray.500' }}
                  type="password"
                />
          </FormControl>
          <Stack spacing={6} direction={['column', 'row']}>
              <Button
                bg={'red.400'}
                color={'white'}
                w="full"
                _hover={{
                  bg: 'red.500',
                }}>
                    Cancel
              </Button>
            <Button
                  bg={'blue.400'}
                  color={'white'}
                  w="full"
                  _hover={{
                    bg: 'blue.500',
                    
                  }}
                type='submit'>
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
      </form>
    );
  }