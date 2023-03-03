import TheraphyCard from './TheraphyCard';
import {useState,useEffect} from 'react';
import {AiOutlineSend} from 'react-icons/ai'
import {currentUserState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import axios from 'axios';
import {socket} from '../service/socket';


export default function TheraphyComponent() {
	// body...
	const [message,setMessage] = useState('')
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);

	const sendMessage = async() => {
		if(message.length>3){
			let existingmessages = currentUser.messages;
			const msg = {
				name:currentUser.username,
				doctor:false,
				message:message,
				profile:currentUser.profile
			}
			setMessage('');
			const messages = [...existingmessages,msg];
			const updateMessageRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/updateMessages/${currentUser._id}`;
			const {data} = await axios.post(updateMessageRoute,{
				messages
			})
			setCurrentUser(data.user);
			socket.emit('newMessage');
		}
	}

	useEffect(()=>{
		socket.on('messageRefreshFromDoctor',(res)=>{
			fetchDataAgain();
		})
		return ()=>{
			socket.off('messageRefreshFromDoctor');
		}
	},[])

	const fetchDataAgain = async() => {
		const loginRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`;
		const username = currentUser.username		
		const {data} = await axios.post(loginRoute,{username:username});
		setCurrentUser(data.user);
	}


	const dataArray = [
		{disease:'Stress',price:'249',image:'https://media.istockphoto.com/id/1281326263/vector/stress-level-reduced-with-problem-and-pressure-solving-tiny-persons-concept-tired-from.jpg?s=612x612&w=0&k=20&c=cxAtecUf4_Yyzn8QYUg41MHNXzNPXli0Y1uT6RWhm1c='},
		{disease:'Depression',price:'599',image:'https://www.sleepfoundation.org/wp-content/uploads/2020/09/shutterstock_1502365082.jpg'},
		{disease:'Meditation',price:'199',image:'https://img.freepik.com/free-vector/organic-flat-people-meditating-illustration_23-2148906556.jpg?w=2000'},
		{disease:'Motivation',price:'299',image:'https://nationaltoday.com/wp-content/uploads/2021/10/Motivation-and-Inspiration-Day-640x514.jpg'},
		{disease:'Autism',price:'799',image:'https://imageio.forbes.com/specials-images/imageserve/61cc9dc17390740da6554667/Little-boy-and-a-colorful-brain-sketch/960x0.jpg?format=jpg&width=960'},
		{disease:'Sleeplessness',price:'99',image:'https://thumbs.dreamstime.com/b/sleeplessness-24366752.jpg'},

	]

	return (
		<div className="max-w-6xl min-h-screen mx-auto px-5 py-5 shadow-2xl">
			<h1 className="text-lg md:text-xl text-gray-900 font-semibold mb-10 mt-[100px]">
			<span className="md:text-2xl text-xl">Welcome to our Only Music.</span> <br/><br/>


<span className="text-sky-600"> Music therapy</span> is a type of therapy that uses music to improve physical, emotional, cognitive, and social well-being. It can be used to treat a variety of conditions, including <span className="text-orange-600"> chronic pain, dementia, autism, and PTSD, among others.</span>
<br/>
<span className="text-red-700"> Our music therapy tracks</span> are carefully composed and selected to promote relaxation, calmness, and positive emotions. Whether you're looking to improve your sleep quality, reduce stress and anxiety, or enhance your meditation practice, we have music tracks that can help.

We believe in the <span className="text-red-500"> power of music</span> to heal and transform, and we're passionate about sharing that power with others. We hope that our music therapy tracks will provide you with a source of comfort, inspiration, and healing.

	We look forward on helping people towards greater well-being.
			</h1>
			<div className="h-[2px] w-[80%] mx-auto bg-gray-500/20 mb-10"/>
			<h1 className="text-4xl text-blue-900 font-semibold mb-6">
				Our Music Therapy
			</h1>
			<div className="h-full w-full grid md:grid-cols-3 grid-cols-1 gap-5 px-4 mb-10">
				{
					dataArray.map((data)=>(
						<TheraphyCard data={data} key={data.price} />
					))
				}
			</div>
			<div className="h-[2px] w-[80%] mx-auto bg-gray-500/20 mt-14 mb-10"/>
			<h1 className="md:text-4xl text-xl text-blue-900 font-semibold mb-4">
				Talk with doctors
			</h1>
			<h1 className="md:text-xl text-gray-400 text-lg font-semibold mb-6 text-center">
				Your Queries will be stored and responded by one of our doctors soon
			</h1>
			<div className="flex flex-col gap-2 px-3 py-4">
				{
					currentUser?.messages?.map((message)=>(
						<div className="shadow-xl rounded-xl px-3 py-4 flex flex-col justify-center">
							<div className="flex">
								<img src={message.profile} alt=""
								className="rounded-full shadow-lg h-9 w-9"/>
								<h1 className={`text-xl ml-5 font-semibold ${message.doctor ? 'text-gray-900' : 'text-gray-400' }`}>
									{message.name}
								</h1>
							</div>
							<div className="flex pl-14">
								<p className="text-lg text-gray-700 font-semibold">
									{message.message}
								</p>
							</div>

						</div>
					))
				}
			</div>
			<div className="flex items-center rounded-xl shadow-xl border-[2px] border-gray-300 focus-within:border-gray-400 w-[98%] mt-5 mx-auto px-3 py-5 mb-5">
				<input type="text" value={message} onChange={(e)=>setMessage(e.target.value)}
				className="w-full text-lg font-semibold bg-transparent outline-none"
				placeholder="Tell about your issues..."
				/>
				<AiOutlineSend 
				onClick={sendMessage}
				className="h-7 w-7 text-gray-500 hover:text-sky-500 transition duration-100 ease-out cursor-pointer"/>
			</div>
		</div>
	)
}