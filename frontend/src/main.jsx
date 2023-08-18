import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'

import store from './store.js'
import { Provider } from 'react-redux'

import App from './App.jsx'
import './index.css'
import './media.css'

import 'bootstrap/dist/css/bootstrap.min.css'
import RegisterScreen from './screens/RegisterScreen.jsx'
import OptionBox from './components/OptionBox.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<OptionBox />} />
      <Route path='/register' element={<RegisterScreen />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}> 
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>
)
