
import './App.css'
import Login from './pages/login/Login'

import Register from './pages/signup/Register'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './context/AuthContext'
import UserPage from './pages/UserPage'
import Header from './components/Header'
import { Container,Box, Flex } from '@chakra-ui/react'
import PostPage from './pages/PostPage'
import AuthPage from './pages/AuthPage'
import { useRecoilState, useRecoilValue } from 'recoil'
import userAtom from './atoms/usersAtom'
import Homepage from './pages/Homepage'
import LogoutButton from './components/LogoutButton'
import UpdateProfilePage from './pages/UpdateProfilePage'
import CreatePost from './pages/CreatePost'
import ChatPage from './pages/ChatPage'


function App() {
		// const {authUser} = useAuthContext();
		const {pathname} = useLocation
		const user = useRecoilValue(userAtom);
		
  return (
	<Box position={"relative"} w='full'>
    <Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "720px"}>
			<Header/>
			<Routes>	
				<Route path='/' element={user ? <Homepage/> : <Navigate to="/auth" />}  />
				<Route path='/auth' element={!user ? <AuthPage/> : <Navigate to="/" />}/>
				<Route path='/update' element={user ? <UpdateProfilePage/> : <Navigate to="/auth" />}  />
				<Route
						path='/:username'
						element={
							user ? (
								<>
									<UserPage />
									<CreatePost />
								</>
							) : (
								<UserPage />
							)
						}
					/>
					
				<Route path='/:username/post/:pid' element={<PostPage/>}></Route>
				
				<Route path='/chat' element={user ? <ChatPage/> : <Navigate to={"/auth"}/>}></Route>
			</Routes>	
			{user && <LogoutButton/>}
			<Toaster />
	</Container>
				
			
    </Box>
  )
}

export default App
