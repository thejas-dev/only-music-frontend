import {TfiAngleDoubleRight} from 'react-icons/tfi';
import {useRecoilState} from 'recoil';
import {currentPatientState} from '../atoms/userAtom';
import {BsChatLeftText} from 'react-icons/bs'


export default function PatientCard({data,handleToggle,handleToggle2,handleClose}) {
	// body...
	const [currentPatient,setCurrentPatient] = useRecoilState(currentPatientState);


	return (
		<div 
		onClick={()=>{
			if(data.messageAlert){
				handleToggle2()	
			}else{
				handleToggle();
			}
			setCurrentPatient(data)
		}}
		className={`w-full z-1 rounded-xl shadow-xl ${data.therapyNeeded ? 'bg-red-500/90 hover:bg-sky-500/80' : data.messageAlert ? 'bg-sky-500 hover:bg-sky-400/80' : 'hover:bg-gray-700/10'}  cursor-pointer gap-2 transition duration-100 ease-out 
		flex px-5 items-center py-3 justify-between`}>
			<div className="flex items-center gap-2">
				<img src={data.profile} alt= "" className="rounded-full h-10 w-10 shadow-lg"/>
				<h1 className="text-xl ml-2 font-semibold text-gray-900">
					{data.username} {data.therapyNeeded && '(Therapy Needed)'}
				</h1>
			</div>
			<div className=" flex gap-5 items-center">
			
			{
				data.therapyNeeded ?
				<BsChatLeftText 
				onClick={()=>{handleToggle2();handleClose()}}
				className="h-7 w-7 z-2 text-gray-900 hover:text-sky-600 hover:scale-110 transition duration-100 ease-out"/>
				:
				data.messageAlert ? 
				<BsChatLeftText 
				onClick={handleToggle2}
				className="h-7 w-7 z-2 text-red-900 animate-pulse hover:text-sky-600 hover:scale-110 transition duration-100 ease-out"/>
				:
				<BsChatLeftText 
				onClick={handleToggle2}
				className="h-7 w-7 z-2 text-gray-500 hover:text-sky-600 hover:scale-110 transition duration-100 ease-out"/>
			}
			{
				data.therapyNeeded ?
				<TfiAngleDoubleRight className="h-7 w-7 text-gray-900"/>
				:
				data.messageAlert ? 
				<TfiAngleDoubleRight className="h-7 w-7 text-gray-900"/>
				:
				<TfiAngleDoubleRight className="h-7 w-7 text-gray-500"/>
			}
			</div>

			

		</div>

	)
}