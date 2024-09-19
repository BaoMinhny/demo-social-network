import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
    useToast,
  } from '@chakra-ui/react';
  import { useState } from 'react';
  import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {  useSetRecoilState } from 'recoil';
import authScreenAtom from '../atoms/authAtom';
import userAtom from '../atoms/usersAtom';
import useShowToast from '../hooks/useShowtoast';
  
  export default function LoginCard() {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreen = useSetRecoilState(authScreenAtom);
    const [loading, setLoading] = useState(false);
    const setUser = useSetRecoilState(userAtom);

    const [inputs, setInputs] = useState({
        username:"",
        password:""
    })
   const showToast = useShowToast(); 

    const handleLogin = async () => {
        // console.log(inputs)
            try {   
              setLoading(true);
                const res= await fetch("/api/users/login",{
                    method:"POST",

                    headers:{
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify(inputs)
                })
                const data = await res.json()
                if(data.error){
                  showToast("Error", data.error, "error");
                  return; // kiểm tra nếu data user có lỗi thì ruturn lại không cho đi tiếp 
                }
                localStorage.setItem("user-threads", JSON.stringify(data));
			          setUser(data);
                console.log(data)
                
            } catch (error) {
                showToast("Error", error, "error");
                console.log(error)
            }
            finally{
              setLoading(false)
            }
    }
    return (
      <Flex
        align={'center'}
        justify={'center'}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'} textAlign={'center'}>
              Login
            </Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool features ✌️
            </Text>
          </Stack>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.dark')}
            boxShadow={'lg'}
            p={8}
            w={{
                base: "full",
                sm:"400px"
            }}
            >
            <Stack spacing={4}>
              
              <FormControl isRequired>
                <FormLabel>User name</FormLabel>
                <Input type="text"
                onChange={(e) => setInputs({...inputs, username:e.target.value})}
                value={inputs.username}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setInputs({...inputs, password: e.target.value})}
                  value={inputs.password} />
                  <InputRightElement h={'full'}>
                    <Button
                      variant={'ghost'}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }>
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  loadingText="Loging in"
                  size="lg"
                  bg={useColorModeValue("gray.600", "gray.700")}
                  color={'white'}
                  _hover={{
                    bg: useColorModeValue("gray.600", "gray.800"),
                  }}
                  onClick={handleLogin}
                  isLoading={loading}
                  >
                  Login
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={'center'}>
                  Dont't have account? <Link color={'blue.400'}
                  onClick={() => setAuthScreen("signup")}
                  >Sign Up</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    );
  }