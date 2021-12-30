import { createEffect, createSignal } from "solid-js"

export default function Home() {
	const [isDown, setIsDown] = createSignal(false)
	const [count, setCount] = createSignal(0)
	let intervalRef

	createEffect(() => {
		if (isDown()) {
			intervalRef = setInterval(() => {
				setCount(count() + 1)
			}, 100)
		} else {
			clearInterval(intervalRef)
		}
	})

	return (
		<section class="bg-gray-100 text-gray-700 p-8">
			<h1 class="text-2xl font-bold">Home</h1>
			<p class="mt-4">This is the home page.</p>

			<div class="flex items-center space-x-2">
				<button
					class="border rounded-lg px-2 border-gray-900"
					onMouseDown={() => {
						console.log("DOWN")
						setIsDown(true)
					}}
					onMouseUp={() => setIsDown(false)}
				>
					-
				</button>

				<output class="p-10px">Count: {count}</output>

				<button
					class="border rounded-lg px-2 border-gray-900"
					onMouseDown={() => {
						console.log("DOWN")
						setIsDown(true)
					}}
					onMouseUp={() => setIsDown(false)}
				>
					+
				</button>
			</div>
		</section>
	)
}
