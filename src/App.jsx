import { useState } from 'react'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './App.css'
import Home from './pages/Home';
import Game from './pages/Game';

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/game/:id',
      element: <Game />
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
