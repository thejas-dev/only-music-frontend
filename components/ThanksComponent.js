import {useRouter} from 'next/router';
import {AiOutlineHome} from 'react-icons/ai'
import {useEffect,useState} from 'react';
import Head from 'next/head';
import {useRecoilState} from 'recoil'
import {currentUserState} from '../atoms/userAtom'
import {socket} from '../service/socket';
import axios from 'axios';

export default function ThanksComponent() {
	// body...
	const [disease,setDisease] = useState('');
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const router = useRouter();
	

	useEffect(()=>{
		if(router.query.name){
			sendData();
		}
	},[router.query])

	const sendData = async() => {
		setDisease(router.query.disease)
		const {disease2,name,id} = router.query
		socket.emit('therapyBought',{
			disease:disease2,
			user:name
		})
		const TherapyRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/therapyNeeded/${id}`;
		const therapyNeeded = true;
		const therapy = disease2
		const {data} = await axios.post(TherapyRoute,{
			therapyNeeded,therapy
		})
		setCurrentUser(data.user);	
		const url = window.location.toString();
		window.location = url.split('?')[0]
	}

	return (
		<div className="max-w-6xl flex items-center flex-col justify-center min-h-screen mx-auto">
			<Head>
				<title>Payment</title>
			</Head>

			<div className=" border-[2px] border-gray-400/20 shadow-xl rounded-xl px-5 py-3 flex flex-col items-center gap-4">
				<h1 className="text-2xl text-gray-900 font-semibold">
					Thank you <span className="text-sky-500">{currentUser.username}</span> for Purchasing the {disease} Music Therapy
				</h1>
				<h1 className="text-gray-400 font-semibold md:text-lg text-md">
					More details will be sent to the provided number
				</h1>
				<h1 className="text-red-600 font-bold md:text-xl text-lg">
					{currentUser.number}
				</h1>
				<AiOutlineHome 
				onClick={()=>router.push('/')}
				className="h-9 w-9 text-sky-500 hover:text-sky-400 hover:scale-110 transition-all
				duration-100 ease-in-out cursor-pointer"/> 
			</div>
		</div>

	)
}