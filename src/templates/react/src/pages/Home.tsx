import Button from '@/components/Button'

export default function Home() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to <%= projectName %>
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A modern React application built with TypeScript, Vite, and Tailwind CSS.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button>
            Get Started
          </Button>
          <Button variant="outline">
            Learn More
          </Button>
        </div>
      </div>
      
      <div className="mt-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">TypeScript</h3>
            <p className="mt-2 text-gray-600">
              Built with TypeScript for better development experience and type safety.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Vite</h3>
            <p className="mt-2 text-gray-600">
              Lightning fast build tool with hot module replacement.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Tailwind CSS</h3>
            <p className="mt-2 text-gray-600">
              Utility-first CSS framework for rapid UI development.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}