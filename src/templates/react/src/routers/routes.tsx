import Home from '../pages/Home'
import About from '../pages/About'
import NotFound from '../pages/NotFound'
import Layout from '../components/Layout'

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/about', element: <About /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
