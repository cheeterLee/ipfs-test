import { ChangeEvent, FormEvent, useRef, useState } from "react"
import { Web3Storage } from "web3.storage"
import { Buffer } from "buffer"

declare let process: {
	env: {
		VITE_API_TOKEN: string
	}
}

const client = new Web3Storage({ token: process.env.VITE_API_TOKEN })

function App() {
	const [uploadImage, setUploadImage] = useState<any>()
	const [displayImage, setDisplayImage] = useState<any>(
		"https://via.placeholder.com/300/09f.png/fff"
	)
	const [imageFromIPFS, setImageFromIPFS] = useState<any>()

	const captureFile = (e: ChangeEvent) => {
		e.preventDefault()
		const target = e.target as HTMLInputElement
		if (!target.files) return
		setUploadImage(target.files[0])
	}

	const retrieveImageFromIPFS = async (cid: string, imageName: string) => {
		const res = await fetch(`https://${cid}.ipfs.dweb.link/${imageName}`)
		const imageBlob = await res.blob()
		const imageFromWeb3 = URL.createObjectURL(imageBlob)
		console.log('imageFromWeb3', imageFromWeb3)
		return imageFromWeb3
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
		const rootCid = await client.put([uploadImage]) // Remember to use this as image url for rerender, the cid return from ipfs and rootCid does not match
		const res = await client.get(rootCid)
		if (res === null) return
		console.log("result", res)
		const imageObjectBack = await res.files()
		const { name } = imageObjectBack[0] 
		console.log(name)
		setDisplayImage(`https://${rootCid}.ipfs.w3s.link/${name}`)
		// const imageDisplayUrl = await retrieveImageFromIPFS(cid, name)
		// console.log('imageDisplayUrl', imageDisplayUrl)
		// setDisplayImage(imageDisplayUrl)

		// const imageUrl = await retrieveImageFromWeb3Storage(rootCid)
		// console.log('imageUrl', imageUrl)
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		console.log("submitting....")
		uploadFile()
		// console.log("current state", uploadImage)
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
			<img src={displayImage} alt="image" />
			<form onSubmit={handleSubmit}>
				<input type="file" onChange={captureFile} />
				<input type="submit" />
			</form>
		</div>
	)
}

export default App
