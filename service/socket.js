


import {io} from 'socket.io-client'
let server = process.env.NEXT_PUBLIC_SERVER_URL;
export const socket = io(server)