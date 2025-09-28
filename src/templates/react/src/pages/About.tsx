export default function About() {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900">About <%= projectName %></h1>
        <div className="mt-6 prose prose-lg text-gray-600">
          <p>
            This project was created using <strong>fez-cli</strong>, a modern frontend scaffolding tool 
            that helps you quickly set up React and Vue projects with best practices.
          </p>
          
          <h2>Project Structure</h2>
          <p>
            This project follows a modern, scalable architecture:
          </p>
          <ul>
            <li><strong>components/</strong> - Reusable UI components</li>
            <li><strong>pages/</strong> - Route-level components</li>
            <li><strong>hooks/</strong> - Custom React hooks</li>
            <li><strong>utils/</strong> - Utility functions</li>
            <li><strong>types/</strong> - TypeScript type definitions</li>
            <li><strong>features/</strong> - Feature-based modules</li>
          </ul>
          
          <h2>Technologies Used</h2>
          <ul>
            <li>React 18 with TypeScript</li>
            <li>Vite for fast development and building</li>
            <li>React Router for client-side routing</li>
            <li>Tailwind CSS for styling</li>
            <li>ESLint for code quality</li>
          </ul>
        </div>
      </div>
    </div>
  )
}