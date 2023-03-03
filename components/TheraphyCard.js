import {AiOutlineRight} from 'react-icons/ai';
import {useRouter} from 'next/router';


export default function TheraphyCard({data}) {
	// body...
	const router = useRouter()


	const redirect = () => {
		router.push(`/payment?disease=${data.disease}`);
	}

	return (
		<div className="w-full flex flex-col border-[2px] border-gray-900/10 hover:bg-gray-400/10 transition-all ease-out shadow-xl p-5 rounded-xl">
			<div className="w-full flex items-center justify-center">
				<img src={data.image} alt=""
				className="w-[170px] h-[170px] rounded-full shadow-md"
				/>
			</div>
			<div className="mt-2 flex flex-col items-center">
				<h1 className="text-gray-900 text-2xl">{data.disease}</h1>
				<h1 className="text-gray-700 mt-5 text-lg">₹ {data.price}</h1>
			</div>
			<div 
			onClick={redirect}
			className="mt-5 flex items-center justify-center gap-2 cursor-pointer">
				<h1 className="text-blue-500 text-xl font-semibold hover:text-blue-400">Consult now</h1>
				<AiOutlineRight className="mt-[5px] h-5 w-5 text-sky-500 hover:text-sky-400"/>
			</div>
		</div>

	)
}