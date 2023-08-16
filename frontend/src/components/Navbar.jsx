import React from 'react'
import './style.css'
import logo from '../images/pculogo.png'

import { Link } from 'react-router-dom';


const Navbar = ({text}) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  return (
    <div className='nav'>
      <div className="logo">
        <Link to="/" onClick={scrollToTop}> 
          <img src={logo} alt="logo loading..." />
        </Link>
      </div>
      
      <div className="links">
        {text}
      </div>
    </div>
  )
}

export default Navbar