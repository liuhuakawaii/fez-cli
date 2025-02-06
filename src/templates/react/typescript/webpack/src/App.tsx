import { useState } from 'react'

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold"><%= projectName %></h1>
      <div className="mt-8">
        <button 
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => setCount(prev => prev + 1)}
        >
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App 