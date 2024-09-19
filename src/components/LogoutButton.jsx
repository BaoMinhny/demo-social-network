import { Button } from "@chakra-ui/button";
import { useRecoilState, useSetRecoilState } from "recoil";
import userAtom from "../atoms/usersAtom";
import useShowToast from "../hooks/useShowtoast";
import {FiLogOut } from "react-icons/fi";


const LogoutButton = () => {
	const setUser = useSetRecoilState(userAtom);
	const showToast = useShowToast();


	const handleLogout = async () =>{
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
	}
	return (
		<Button position={"fixed"} top={"40px"} right={"30px"} size={"sm"} onClick={handleLogout}>
			<FiLogOut size={20} />
		</Button>
	);
};
export default LogoutButton;