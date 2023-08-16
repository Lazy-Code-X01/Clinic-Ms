import React from 'react'
import './style.css'
import { Typography } from '@mui/material'
import logo from '../images/pculogo.png'
import { Link } from 'react-router-dom';
const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }
  return (
    <div className='footer'>
        <div className="logo">
            <Link to="/" onClick={scrollToTop}>
             <img src={logo} alt="logo" />
            </Link>
            <Typography className='text' >Precious Corner Stone - Clinical Portal</Typography>
        </div>
        <div className="line"></div>
        <Typography className='copyright' fontSize={'14px'} color='grey' >© 2021 Precious Corner Stone. All rights reserved.</Typography>
    </div>
  )
}

export default Footer