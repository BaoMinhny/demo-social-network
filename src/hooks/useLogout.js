import React from 'react'
import { useSetRecoilState } from 'recoil'
import userAtom from '../atoms/usersAtom'
import useShowToast from './useShowtoast';

const useLogout = () => {
    const setUser = useSetRecoilState(userAtom);
    const showToast = useShowToast();

    const logout = async () =>{
		try {
			const res = await fetch("api/users/logout",{
				method: "POST",
				headers:{
					"Content-type": "application/json",
				}
			})
			const data = await res.json();

			if(data.error){
				showToast("Error", data.error, "error")
				return;
			}
			localStorage.removeItem("user-threads");
				setUser(null)
		} catch (error) {
			showToast("Error", error, "error")
		}
	};
    return logout
}

export default useLogout
