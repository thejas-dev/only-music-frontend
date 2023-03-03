import {useRouter} from 'next/router';
import PaymentComponent from '../components/PaymentComponent';
import {currentUserState} from '../atoms/userAtom';
import {useRecoilState} from 'recoil'
import {useEffect} from 'react';


export default function payment() {
	// body...
	const [currentUser,setCurrentUser] = useRecoilState(currentUserState);
	const router = useRouter();


	useEffect(()=>{
		if(!currentUser){
			router.push('/signIn');
		}else if(!router.query){
			router.push('/');
		}else{
			var {disease} = router.query;
			disease = disease.toLowerCase();
			const paymentRoute = `${process.env.NEXT_PUBLIC_SERVER_URL}/pay`
			if(currentUser){
				fetch(`${paymentRoute}`,{
				method:'POST',
				headers:{
					'Content-Type':'application/json'
				},
				body:JSON.stringify({
					username:currentUser.username,
					id:currentUser._id,
					items:[
						{id:disease}
					]
				})
			}).then(res=>{
				if(res.ok) return res.json();
				return res.json().then(json=>Promise.reject(json))
			}).then(({url})=>{
				window.location = url;
			}).catch(e=>{
				console.error(e.error) 
			})
			}
		}
	},[])


	return (
		<div className="min-h-screen w-full bg-[#edfaef]">
			<PaymentComponent/>
		</div>

	)



}