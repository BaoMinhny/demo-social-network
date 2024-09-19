import React, { useState } from 'react'
import SignupCard from '../components/SignupCard'
import LoginCard from '../components/LoginCard'
import { useRecoilValue } from 'recoil'
import authScreenAtom from '../atoms/authAtom'

const Authpage = () => {

  const authScreenState = useRecoilValue(authScreenAtom)
  // const [value, setValue] = useState("login")
  console.log(authScreenState)
  return (
   <>{authScreenState === "login" ? <LoginCard/> : <SignupCard/>}</>
  )
}

export default Authpage
