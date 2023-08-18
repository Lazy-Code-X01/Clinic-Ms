import React from 'react'
import './style.css'

const FixedBanner = ({text, headText}) => {
  return (
    <div className='get_started'>
        <div className="get_started_content">
            <h1>{headText}</h1>
            <p>{text}</p>
        </div>
        <div className="overlay"></div>
    </div>
  )
}

export default FixedBanner