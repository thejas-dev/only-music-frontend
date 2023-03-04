import {useRecoilState} from 'recoil'
import {useEffect} from 'react';
import {currentUserState,doctorLoginState} from '../atoms/userAtom'
import {useRouter} from 'next/router';
import axios from 'axios';


export default function Navbar() {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [doctorLogin2,setDoctorLogin2] = useRecoilState(doctorLoginState);
	const router = useRouter();

	useEffect(()=>{
		const fetch = async() => {
			if(localStorage.getItem('only-music') || localStorage.getItem('only-music-doctor')){
				// if(localStorage.getItem('only-music')){
				if(!doctorLogin2){
					const loginRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`;
					const username = localStorage.getItem('only-music')
					const {data} = await axios.post(loginRoute,{username:username});
					if(data.status === false){
						if(localStorage.getItem('only-music-doctor')){
							if(!currentUser){
								router.push('/signIn')
							}
						}else{
							router.push('/signIn')
						}
					}else{
						setCurrentUser(data.user)
					}				
				}
				// }else{
				// 	const loginRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/doctorLogin`;
				// 	const {username,password} = JSON.parse(localStorage.getItem('only-music-doctor'));
				// 	const {data} = await axios.post(loginRoute,{username:username,password:password});
				// 	if(data.status === false){
				// 		router.push('/signIn')
				// 	}else{
				// 		setCurrentUser(data.doctor)
				// 		router.push('/doctor')
				// 	}
				// }
			}else{
				router.push('/signIn');
			}			
		}
		fetch()
	},[])


	const logout = () => {
		localStorage.removeItem('only-music')
		router.push('/signIn');
	}


	return (
		<div className="fixed w-full bg-green-100/50 backdrop-blur-md shadow-xl top-0  ">
			<div className="max-w-6xl mx-auto px-5 py-3 flex items-center">
				<div className="w-[50%] flex md:gap-5 gap-2 items-center justify-start">
					<img src="https://cdn-icons-png.flaticon.com/512/3844/3844724.png"
					alt=""
					className="h-9 w-9 rounded-full"/>
					<h1 className="text-2xl font-bold">
						<span className="text-red-400">Only</span> <span className="text-blue-400">Music</span>
					</h1>
				</div>
				<div className="w-[50%] flex md:gap-5 gap-2 items-center justify-end">
					<h1 className="text-xl text-green-900 font-semibold">
						{currentUser?.username}
					</h1>
					<img 
					onClick={logout}
					className="h-8 w-8 rounded-full cursor-pointer"  
					src={currentUser?.profile}
					alt=""
					/>
				</div>
			</div>

		</div>

	)
}