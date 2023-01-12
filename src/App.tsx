import { ChangeEvent, FormEvent, useState } from "react"
import { create } from "ipfs-http-client"
import { Buffer } from "buffer"

const projectId = process.env.VITE_IPFS_PROJECT_ID
const projectSecret = process.env.VITE_IPFS_API_KEY
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64')

const ipfs = create({
	host: "ipfs.infuro.io",
	port: 5001,
	protocol: "https",
	headers: {
		auth,
	}
})

function App() {
	const [buffer, setBuffer] = useState<Uint8Array | null>(null)

	const captureFile = async (e: ChangeEvent<HTMLInputElement>) => {
		e.preventDefault()
		if (!e.target.files) return
		const file = await e.target.files[0].arrayBuffer()
		const abFile = new Uint8Array(file)
		setBuffer(abFile)
		console.log("buffer", abFile)
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		console.log("submitting....")
		console.log("buffer state", buffer)
		try {
			const result = await ipfs.add(buffer!)
			console.log(result)
		} catch (error) {
			console.log("error submitting", error)
		}
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
