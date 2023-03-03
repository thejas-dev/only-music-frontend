import {useState,useEffect} from 'react';
import Head from 'next/head'
import {useRouter} from 'next/router';
import axios from 'axios';
import {useRecoilState} from 'recoil';
import {GiHospitalCross} from 'react-icons/gi';
import {GoPerson} from 'react-icons/go';
import {currentUserState,doctorLoginState} from '../atoms/userAtom';
import {socket} from '../service/socket';

export default function SignInComponent() {
	// body...
	const [name,setName] = useState('');
	const [number,setNumber] = useState(''); 
	const [password,setPassword] = useState('');
	const [loading,setLoading] = useState(false);
	const [doctor,setDoctor] = useState(false);
	const router = useRouter();
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const [doctorLogin2,setDoctorLogin2] = useRecoilState(doctorLoginState);
	const registerRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`
	const loginRoutes = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`
	const doctorLogin = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/doctorLogin`
	const doctorRegister = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/doctorRegister`;

	const submitForm = async() => {
		if(!doctor){
			if(number.length > 9){
				setLoading(true);
				const {data} = await axios.post(loginRoutes,{
					username:name,
				});
				if(data.status === false){
					const {data} = await axios.post(registerRoute,{
						username:name,
						number:number
					})
					localStorage.setItem('only-music',name)
					setCurrentUser(data.user);
					socket.emit('joinwebsite',{
						name:name
					})
					if(data.user){
						router.push('/')
					}
				}else{
					localStorage.setItem('only-music',name)
					setCurrentUser(data?.user);
					if(data.user){
						router.push('/')
					}
				}
			}			
		}else{
			if(password.length > 3 ){
				setLoading(true);
				const {data} = await axios.post(doctorLogin,{
					username:name,
					password:password
				})
				if(data.status === false){
					const {data} = await axios.post(doctorRegister,{
						username:name,
						password:password
					})
					const userdata = {
						username:name,
						password:password
					}
					localStorage.setItem('only-music-doctor',JSON.stringify(userdata))
					setCurrentUser(data.doctor);
					setDoctorLogin2(true);
					if(data.doctor){
						router.push('/doctor')
					}
				}else{
					const userdata = {
						username:name,
						password:password
					}
					localStorage.setItem('only-music-doctor',JSON.stringify(userdata))
					setCurrentUser(data.doctor);
					setDoctorLogin2(true);
					if(data.doctor){
						router.push('/doctor');
					}
				}
			}
		}
	}

	useEffect(()=>{
		const fetch = async() => {
			if(localStorage.getItem('only-music')){
				const loginRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`;
				const username = localStorage.getItem('only-music')
				const {data} = await axios.post(loginRoute,{username:username});
				if(data.status === false){

				}else{
					setCurrentUser(data.user)
					router.push('/')
				}
			}			
		}
		fetch()
	},[])



	return (
		<>
		<Head>
		    <title>Only Music Login</title>
		    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css" integrity="sha512-5A8nwdMOWrSz20fDsjczgUidUBR8liPYU+WymTZP1lmY9G6Oc7HlZv156XqnsgNUzTyMefFTcsFH/tnJE/+xBg==" crossorigin="anonymous" referrerpolicy="no-referrer" />		   
		</Head>
		<div className="body bg-[url('https://www.erikaslighthouse.org/wp-content/uploads/2020/02/wes-hicks-MEL-jJnm7RQ-unsplash-scaled.jpg')]">
			<div className="h-full w-full bg-black/80 flex items-center justify-center flex-col">
			<h1 className="text-3xl text-gray-100 font-bold mb-10">{
				doctor ? 
				"Doctor's Login"
				:
				"Patient's Login"
			}</h1>
		    <div class="box">
		        <span></span>
		        <span></span>
		        <span></span>
		        <span></span>
		      <div class="form">
		         <form method="get" onSubmit={(e)=>e.preventDefault()} class="form">
		            <div class="input-box">
		                <i class="fa fa-user icon ml-[80px]"></i>
		                <input 
		                onChange={(e)=>setName(e.target.value)}
		                value={name}
		                type="text" name="name" id="name"   size="30" maxLength="30"   required/>
		                <label for="name">{
		                	doctor?
		                	"Username"
		                	:
		                	"Patient's Name"
		                }</label>
		                
		            </div>
		            <div class="input-box">
		                {
		                	doctor?
		                	<i class="fa fa-lock icon ml-[80px]" aria-hidden="true"></i>
		                	:
		                	<i class="fa fa-phone icon ml-[80px]" aria-hidden="true"></i>
		                }
		                <input 
		                onChange={(e)=>{
		                	if(doctor){
		                		setPassword(e.target.value)
		                	}else{
		                		setNumber(e.target.value)
		                	}
		                }}
		                value={doctor ? password : number}
		                type={doctor ? 'password' : 'tel'} name="number" id="number" title="Patient mobile number" size="10" maxlength="10" required/>
		                <label for="password">{
		               		doctor?
		               		"Password"
		               		:
		                	"Phone Number"
		                }</label>
		            </div>
		            <div class="button">
		                <button 
		                onClick={submitForm}
		                className={`start-button ${loading ? "bg-[#0f82b8]" : "bg-green-600"}`} value="start">{
		                	loading ? 
		                	'Wait'
		                	:
		                	doctor?
		                	'Login'
		                	:
		                	'Connect'
		                }</button>
		            </div>
		         </form>
		      </div>
		    </div>
		    <div className="mt-5 w-full flex items-center justify-center">
		    	<h1 
		    	onClick={()=>setDoctor(!doctor)}
		    	className="text-lg text-sky-500 hover:text-sky-400 cursor-pointer ">
		    		{
		    			doctor ? 
		    			<span className="flex items-center gap-2 font-semibold" >Patient's Login <GoPerson className="h-5 w-5"/></span>
		    			:
		    			<span className="flex items-center gap-2 font-semibold">Doctor's Login <GiHospitalCross className="h-5 w-5 "/></span>
		    		}
		    	</h1>
		    </div>
		    </div>
		</div>
    
</>

	)
}