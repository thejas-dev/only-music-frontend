import { atom } from 'recoil';


export const currentUserState = atom({
	key:"currentUserState",
	default:''
});

export const doctorLoginState = atom({
	key:"doctorLoginState",
	default:false
})

export const currentPatientState = atom({
	key:"currentPatientState",
	default:''
})

