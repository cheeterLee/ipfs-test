import { ChangeEvent, FormEvent, useRef, useState } from "react"
import { Web3Storage } from "web3.storage"
import { Buffer } from 'buffer'

declare let process: {
	env: {
		VITE_API_TOKEN: string
	}
}

const client = new Web3Storage({ token: process.env.VITE_API_TOKEN })

function App() {
	const [uploadImage, setUploadImage] = useState<any>()
	const [imageFromIPFS, setImageFromIPFS] = useState<any>()

	const captureFile = (e: ChangeEvent) => {
		e.preventDefault()
		const target = e.target as HTMLInputElement
		if (!target.files) return
		setUploadImage(target.files[0])
	}

	const retrieveImageFromWeb3Storage = async (cid: string) => {
		let res = await client.get(`${cid}`)
		if (!res?.ok) {
			throw new Error(
				`failed to get ${cid} - [${res?.status}] ${res?.statusText}`
			)
		}
		const file = await res?.files()
		const bufferArray = await file[0].arrayBuffer()
		return (
			"data:image/png;base64," +
			Buffer.from(bufferArray).toString("base64")
		)
	}

	const uploadFile = async () => {
		const rootCid = await client.put([uploadImage])
		const res = await client.get(rootCid)
		if (res === null) return
		const imageUrl = await retrieveImageFromWeb3Storage(rootCid)
		console.log('imageUrl', imageUrl)
	}

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault()
		console.log("submitting....")
		console.log("current state", uploadImage)
		uploadFile()
	}

	return (
		<div
			className="App"
			style={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				gap: "3rem",
				justifyContent: "center",
				alignItems: "center",
			}}
		>
			<img src="https://via.placeholder.com/300/09f.png/fff" alt="" />
			<form onSubmit={handleSubmit}>
				<input type="file" onChange={captureFile} />
				<input type="submit" />
			</form>
		</div>
	)
}

export default App
