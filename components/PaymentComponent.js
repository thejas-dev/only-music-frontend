import Head from 'next/head'
import Navbar from './Navbar'




export default function PaymentComponent() {
	// body...


	return (
		<div className="max-w-6xl flex items-center flex-col justify-center min-h-screen mx-auto">
			<Head>
				<title>Payment</title>
			</Head>

			<Navbar/>
			<div className=" border-[2px] border-gray-700 rounded-xl px-5 py-3 flex flex-col items-center gap-4">
				<h1 className="text-2xl text-sky-600 font-semibold">
					Waiting for Payment
				</h1>
				<img src="https://ik.imagekit.io/d3kzbpbila/loading-gif_6ZZ0dqfMG.gif?ik-sdk-version=javascript-1.4.3&updatedAt=1673616220454"
				alt=""
				className="h-10 w-10"
				/>
			</div>
		</div>

	)
}