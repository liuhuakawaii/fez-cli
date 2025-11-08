import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button from '@/components/Button'

export default function About() {
  useEffect(() => {
    console.log('About component mounted')
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
                About
              </span>
              <br />
              <span className="text-gray-900">liuhuakawaii-playground</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A modern, scalable React application built with best practices and cutting-edge technologies.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-100 mb-8">
            <div className="prose prose-lg max-w-none">
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">项目简介</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  This project was created using <strong className="text-indigo-600">fez-cli</strong>, a modern frontend scaffolding tool 
                  that helps you quickly set up React and Vue projects with best practices.
                </p>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">项目结构</h2>
                </div>
                <p className="text-gray-700 mb-4">
                  This project follows a modern, scalable architecture:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-gray-900">components/</strong>
                      <p className="text-sm text-gray-600 m-0">Reusable UI components</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-cyan-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-gray-900">pages/</strong>
                      <p className="text-sm text-gray-600 m-0">Route-level components</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-gray-900">hooks/</strong>
                      <p className="text-sm text-gray-600 m-0">Custom React hooks</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-gray-900">utils/</strong>
                      <p className="text-sm text-gray-600 m-0">Utility functions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-gray-900">types/</strong>
                      <p className="text-sm text-gray-600 m-0">TypeScript type definitions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <strong className="text-gray-900">features/</strong>
                      <p className="text-sm text-gray-600 m-0">Feature-based modules</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 m-0">技术栈</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'React 18 with TypeScript',
                    'Vite for fast development',
                    'React Router for routing',
                    'Tailwind CSS for styling',
                    'Axios with retry mechanism',
                    'ESLint for code quality',
                  ].map((tech, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-lg">
                      <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                      <span className="text-gray-700">{tech}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <Link to="/">
              <Button size="lg">
                返回首页
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}