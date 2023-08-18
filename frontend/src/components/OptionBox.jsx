import React from 'react'
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';


import FixedBanner from './FIxedBaner'
import Footer from './Footer'

import './style.css'
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const OptionBox = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  return (
    <>
    <Navbar 
      text={<Link to={'/register'} style={{color: '#fff', fontWeight: '600', textDecoration: 'none'}} onClick={scrollToTop}> Get Started </Link>}
    />
    <FixedBanner  
        headText={'Welcome 😃'}
    />
      <div className="optionBoxContainer">
        <div className="optionBox">
          <div className="btn-container">
            <Link to={"https://clinic-ms.vercel.app/"} target='_blank' onClick={scrollToTop}>
              <Button variant="outlined" color='success' className='btn'>
                Clinical Staff
              </Button>
            </Link>
          </div>

            <Typography className='text' fontSize={'14px'}> OR </Typography>
           
            <div className="btn-container">
              <Link to='/register' onClick={scrollToTop}>
                <Button variant="outlined" color='primary' className='btn'>
                  Student Reg.
                </Button>
              </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default OptionBox