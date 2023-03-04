import Navbar from './Navbar'
import {IoMdClose} from 'react-icons/io'
import {ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head'
import {useEffect,useState} from 'react';
import axios from 'axios'
import PatientCard from './PatientCard';
import {socket} from '../service/socket';
import {useRecoilState} from 'recoil';
import {doctorLoginState,currentPatientState,currentUserState} from '../atoms/userAtom';
import {useRouter} from 'next/router';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {AiOutlineSend} from 'react-icons/ai'


export default function DoctorComponent() {
	const [allPatients, setAllPatients] = useState([]);
	const [doctorLogin2,setDoctorLogin2] = useRecoilState(doctorLoginState);
	const [currentPatient,setCurrentPatient] = useRecoilState(currentPatientState);
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [revealButton,setRevealButton] = useState(false);
	const router = useRouter();
	const [open, setOpen] = useState(false);
	const [message,setMessage] = useState('');
	const [open2, setOpen2] = useState(false);

	const handleClose = () => {
		setOpen(false);
	};
	const handleToggle = () => {
		setOpen(!open);
	};
	const handleClose2 = () => {
		setOpen2(false);
	};
	const handleToggle2 = () => {
		setOpen2(!open2);
	};


	useEffect(()=>{
		if(!doctorLogin2){
			router.push('/signIn');
		}else{
			fetchData()
		}
	},[])

	const therapyProvide = async() => {
		const id = currentPatient._id
		const TherapyRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/therapyProvide/${id}`;
		const therapyNeeded = false;
		const therapyProvided = true;
		const {data} = await axios.post(TherapyRoute,{
			therapyNeeded,therapyProvided
		})
		fetchData();
		setRevealButton(false);
		handleClose();
	}

	const fetchData = async(req,res) => {
		const allPatientsRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/getAll`;

		const {data} = await axios.get(allPatientsRoute)
		console.log(data);
		setAllPatients(data.data.reverse())
	}

	console.log(allPatients)
	const toastOption={
		position: "bottom-right",
		autoClose: 5000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
		theme: "dark",
	}

	useEffect(()=>{
		socket.on('newPatient',(res)=>{
			displayName(res);
			fetchData();
		})
		socket.on('therapyAlert',(res)=>{
			alert(`Patient ${res.user} Bought the ${res.disease} music therapy`);
			fetchData();
		})
		socket.on('messageRefresh',(message)=>{
			console.log(message)
			fetchData();
		})
		return ()=>{
			socket.off('newPatient');
			socket.off('messageRefresh');
			socket.off('therapyAlert');
		}
	},[]);

	const displayName = (res) => {
		toast(`New Patient :- ${res.name}`,toastOption)
	}

	const sendMessage = async() => {
		if(message.length>1){
			let existingmessages = currentPatient.messages;
			const msg = {
				name:currentUser.username,
				doctor:true,
				message:message,
				profile:currentUser.profile
			}
			setMessage('');
			const messages = [...existingmessages,msg];
			handleClose2()
			const updateMessageRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/updateMessages/${currentPatient._id}`;
			const {data} = await axios.post(updateMessageRoute,{
				messages
			})
			fetchData()
			socket.emit('newMessageFromDoctor');
		}
	}


	return (
		<div className="max-w-6xl min-h-screen mx-auto">
			<Head>
				<title>Only Music Doctors</title>
			</Head>
			<Backdrop
			    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
			    open={open2}
			  >
			  	<IoMdClose 
		    	onClick={handleClose2}
		    	className="fixed h-10 w-10 md:top-10 top-4 cursor-pointer
		    	right-5 md:right-14 text-red-400"/>
		    		<div className="rounded-xl gap-2 shadow-xl border-[2px] border-gray-300/70 bg-green-100 md:w-[70%] w-[95%] h-[80%] overflow-y-scroll flex flex-col md:px-7 px-5 py-5">
		    			<h1 className="md:text-3xl text-xl text-red-900 flex items-center gap-4 mx-auto font-semibold">
		    			 {currentPatient.username}<img src={currentPatient.profile} className="rounded-full h-7 w-7"/>
		    			</h1>
		    			<div className="gap-2 flex flex-col flex-grow">
		    			{
		    				currentPatient?.messages?.map((message)=>(
		    					<div className="rounded-xl gap-4 flex items-center">
		    						<h1 className="md:text-xl text-lg font-semibold text-sky-500">
		    							{message.name} :-
		    						</h1>
		    						<p className="text-gray-700 md:text-lg text-md font-semibold">
		    							{message.message}
		    						</p>
		    					</div>
		    				))
		    			}
		    			</div>
		    			<div className="w-full mx-auto rounded-xl px-2 py-3 border-[2px] border-gray-300 focus-within:border-gray-400 flex items-center">
		    				<input type="text" value={message} onChange={(e)=>setMessage(e.target.value)}
		    				className="w-full outline-none bg-transparent font-semibold text-black" 
		    				placeholder="Type Message Here..."
		    				/>
		    				<AiOutlineSend 
		    				onClick={sendMessage}
		    				className="h-7 w-7 cursor-pointer hover:text-sky-500 transition duration-100 ease-out text-gray-500"/>
		    			</div>
		    		</div>
			 </Backdrop>
			<Backdrop
			    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
			    open={open}
			  >
			    	<IoMdClose 
			    	onClick={handleClose}
			    	className="fixed h-10 w-10 md:top-10 top-4 cursor-pointer
			    	right-5 md:right-14 text-red-400"/>

			    	<div className="rounded-xl gap-2 shadow-xl border-[2px] border-gray-300/70 bg-green-100 flex flex-col items-center md:px-7 px-5 py-5">
			    		<h1 className="md:text-lg text-md text-gray-400 font-serif">
			    			Patient's name
			    		</h1>
			    		<h1 className="md:text-4xl text-2xl text-gray-800 mb-1 font-semibold">
			    			{currentPatient.username}
			    		</h1>
			    		<h1 className="md:text-2xl text-lg text-red-400 mb-5 font-bold">
			    			{currentPatient.number}
			    		</h1>
			    		<div className="border-[2px] md:px-5 px-2 py-7 border-sky-500 rounded-xl grid grid-cols-2 gap-4">
			    			<div className="flex flex-col items-center">
			    				<h1 className="text-md text-gray-700 font-semibold">
			    					Therapy Needed
			    				</h1>
			    				<h1 className={`text-xl ${currentPatient.therapyNeeded ? 'text-red-500' : 'text-gray-700'} font-semibold`}>
			    					{currentPatient.therapyNeeded ? 'Yes' : 'No'}
			    				</h1>
			    			</div>
			    			<div className="flex flex-col border-l-[1px] border-gray-300 md:pl-5 pl-1 md:pr-5 items-center">
			    				<h1 className="text-md text-gray-700 font-semibold">
			    					Therapy Requested
			    				</h1>
			    				<h1 className={`text-xl ${currentPatient.therapy ? 'text-sky-500' : 'text-gray-700'} font-semibold`}>
			    					{currentPatient.therapy ? currentPatient.therapy : '~'}
			    				</h1>
			    			</div>
			    			<div className="flex mt-5 flex-col border-l-[1px] border-gray-300 md:pl-5 md:pr-5 items-center">
			    				<h1 className="text-md text-gray-700 font-semibold">
			    					Money Paid
			    				</h1>
			    				<h1 className={`text-xl ${currentPatient.therapyNeeded ? 'text-orange-500' : 'text-gray-700'} font-semibold`}>
			    					{currentPatient.therapyNeeded ? 'Yes' : 'No'}
			    				</h1>
			    			</div>
			    			<div className="flex mt-5 flex-col border-l-[1px] border-gray-300 md:pl-5 pl-1 md:pr-5 items-center">
			    				<h1 className="text-md text-gray-700 font-semibold">
			    					Therapy Provided
			    				</h1>
			    				<h1 className={`text-xl ${currentPatient.therapyProvided ? 'text-green-500' : 'text-red-700'} font-semibold`}>
			    					{currentPatient.therapyProvided ? 'Yes' : 'No'}
			    				</h1>
			    			</div>
			    		</div>
			    		{
			    			revealButton ?
			    			<>
			    			<button 
				    		onClick={()=>therapyProvide()}
				    		className="rounded-xl px-5 py-2 font-semibold mt-5 bg-green-500 w-full">Therapy Provided</button>
				    		<button 
				    		onClick={()=>setRevealButton(false)}
				    		className="rounded-xl px-5 py-2 font-semibold mt-2 bg-red-500 w-full">Cancel</button>
				    		</>
			    			:
				    		<button 
				    		onClick={()=>setRevealButton(true)}
				    		className="rounded-xl px-5 py-2 font-semibold mt-5 bg-sky-500 w-full">Update</button>			    			
			    		}
			    	</div>

			  </Backdrop>
			<div className="pt-[100px]">
				<h1 className="text-4xl text-gray-800 text-center font-semibold">
					<span className="text-sky-500"> Doctor</span><span className="text-red-500"> Eye</span>
				</h1>
				<div className="w-full flex flex-col gap-5 px-2 py-3">
					{
						allPatients.map((patient)=>(
							<PatientCard data = {patient} handleToggle={handleToggle} handleToggle2={handleToggle2} handleClose={handleClose} />
						))
					}
				</div>
			</div>
			<ToastContainer/>	
		</div>

	)
}