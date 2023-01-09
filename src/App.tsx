import { useState } from "react"
import { Button } from "lofi-design"

function App() {

	return (
		<div className="App">
			<Button
				color="white"
				style={{ padding: 25 }}
        onClick={() => alert("You gon do this 2023!")}
			>
				Cool Btn
			</Button>
			

		</div>
	)
}

export default App
