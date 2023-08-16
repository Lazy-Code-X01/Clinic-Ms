import { useState, useEffect } from "react"
import {Link, useNavigate} from 'react-router-dom'


import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';

import { toast } from 'react-toastify'
import Loader from "../components/Loader"

import { useRegisterMutation } from "../slices/userApiSlice"

import Navbar from '../components/Navbar'
import GetStarted from "../components/FixedBaner"
import Footer from "../components/Footer";

import './style.css'

const RegisterScreen = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [department, setDepartment] = useState('Computer Science')
    const [matricNumber, setMatricNumber] = useState('')
    const [email, setEmail] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [level, setLevel] = useState('100 Level')
    const [genotype, setGenotype] = useState('AS')
    const [bloodGroup, setBloodGroup] = useState('A')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [religion, setReligion] = useState('Christianity')
    const [stateOfOrigin, setStateOfOrigin] = useState('')
    const [lga, setLga] = useState('')
    const [nationality, setNationality] = useState('')
    const [sex, setSex] = useState('Male')
    const [address, setAddress] = useState('')
    const navigate = useNavigate()

    const [register, { isLoading }] = useRegisterMutation()

    const submitHandler = async (e) => {
        e.preventDefault()
            // frontend validation
            if (!firstName || !lastName || !matricNumber || !email ||  !phoneNumber || !stateOfOrigin  || !lga || !nationality || !address) {
                toast.error('Please fill in all required fields');
                return;
            }
            
            // Additional validation logic for specific fields
            if (phoneNumber.length !== 11) {
                toast.error('Phone number must be 11 digits');
                return;
            }
            if (matricNumber.length !== 8) {
                toast.error('Matric number must be 8 digits');
                return;
            }
            if (stateOfOrigin.length < 3) {
                toast.error('State of origin must be more than 3 characters');
                return;
            }
            if (lga.length < 3) {
                toast.error('LGA must be more than 3 characters');
                return;
            }
            if (address.length < 3) {
                toast.error('Adress Invalid')
                return;
            }
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                toast.error('Please enter a valid email address');
                return;
            }
              // Date validation
            const selectedDate = new Date(dateOfBirth);
            if (isNaN(selectedDate.getTime())) {
                toast.error('Please enter a valid date of birth');
                return;
            }



            try {
                const res = await register({ 
                    firstName, 
                    lastName, 
                    department, 
                    matric_number: matricNumber,
                    email,
                    phoneNumber,
                    level,
                    genotype,
                    bloodGroup,
                    dateOfBirth,
                    religion,
                    stateOfOrigin,
                    lga,
                    nationality,
                    sex,
                    address
                }).unwrap()
                navigate('/')
                toast.success('Registration successful')
                console.log('saved to db');
            } catch (err) {
                toast.error(err?.data?.message || err.error);
                console.log(err?.data?.message || err.error);
            }
        console.log('clicked');
    }

    const scrollToTop = () => {
        window.scrollTo(0, 0)
    }
    const buttonStyle = {
        backgroundColor: '#00023c',
        color: 'white', 
    };
    
  return (
    <> 
        <Navbar 
            text={<Link to={'/'} style={{color: '#fff', fontWeight: '600', textDecoration: 'none'}} onClick={scrollToTop}> Home </Link>}
        />

        <GetStarted 
            text={'Provide all required information to proceed'}
            headText={'Get Started'}
        />

        <div className="academicFormContainer">
            <div className="academicForm">
            <form onSubmit={submitHandler}>

                <div className="flex">
                    <div className="form-group">
                        <label htmlFor="first-name" className='inputLabel'>First name *</label>
                        <TextField
                            id="" 
                            placeholder='First Name' 
                            name="firstName"
                            variant="outlined" 
                            color='success' 
                            type={'text'}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="last-name" className='inputLabel'>Last name *</label>
                        <TextField 
                            id=""  
                            placeholder='Last Name' 
                            name="lastName"
                            variant="outlined" 
                            color='success' 
                            type={'text'} 
                            value={lastName}
                            onChange={(e)=> setLastName(e.target.value)}
                        />
                    </div>

                </div>

                <div className="line"></div>

                <div className="flex">
                    <div className="form-group">
                        <label htmlFor="department" className='inputLabel'>Department *</label>
                        <Select
                            // labelId="demo-simple-select-label"
                            
                            name='department' 
                            variant="outlined"
                            color='success'
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                        >
                            <MenuItem value='Computer Science'>Computer Science</MenuItem>
                            <MenuItem value='Software Engineering'>Software Engineering</MenuItem>
                            <MenuItem value='Cyber Security'>Cyber Security</MenuItem>
                            <MenuItem value='Physics with electronics'>Physics with electronics</MenuItem>
                            <MenuItem value='Accounting'>Accounting</MenuItem>
                            <MenuItem value='Biochemistry'>Biochemistry</MenuItem>
                            <MenuItem value='Microbiology'>Microbiology</MenuItem>
                            <MenuItem value='Business Administation'>Business Administation</MenuItem>
                            <MenuItem value='Mass Communication'>Mass Communication</MenuItem>
                            <MenuItem value='Accounting'>Accounting</MenuItem>
                            <MenuItem value='International Relations'>International Relations</MenuItem>
                            <MenuItem value='Economics'>Economics</MenuItem>
                        </Select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="matricNumber" className='inputLabel'>Matric Number *</label>
                        <TextField 
                            id=""  
                            placeholder='Enter matric number'
                            name="matricNumber"
                            variant="outlined" 
                            color='success' 
                            type={'text'} 
                            value={matricNumber}
                            onChange={(e)=> setMatricNumber(e.target.value)}
                        />
                    </div>

                </div>

                <div className="line"></div>

                <div className="flex">
                    <div className="form-group">
                        <label htmlFor="email" className='inputLabel'>Email *</label>
                        <TextField 
                            id=""  
                            placeholder='Enter email' 
                            name="email"
                            variant="outlined" 
                            color='success' 
                            type={'text'} 
                            value={email}
                            onChange={(e)=> setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                            <label htmlFor="phone" className='inputLabel'>Phone number *</label>
                            <TextField 
                             placeholder='Phone number' 
                             name='phone' 
                             variant="outlined" 
                             color='success' 
                             type={'number'} 
                             value={phoneNumber}
                             onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                    </div>
                </div>

                <div className="line"></div>
                                        
                <div className="form-group">
                    <label htmlFor="level" className='inputLabel'>Level *</label>
                    <Select
                        id=""  
                        name='level' 
                        variant="outlined"
                        color='success'
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                    >
                        <MenuItem value='100 Level'>100 Level</MenuItem>
                        <MenuItem value='200 Level'>200 Level</MenuItem>
                        <MenuItem value='300 Level'>300 Level</MenuItem>
                        <MenuItem value='400 Level'>400 Level</MenuItem>
                    </Select>
                </div>

                <div className="line"></div>

                <div className="flex">
                    <div className="form-group">
                        <label htmlFor="genotype" className='inputLabel'>Genotype *</label>
                        <Select id='genotype'  
                            name='genotype'
                            variant="outlined"
                            color='success'
                            value={genotype}
                            onChange={(e) => setGenotype(e.target.value)}
                        >
                            <MenuItem value='AS'>AS</MenuItem>
                            <MenuItem value='AA'>AA</MenuItem>
                            <MenuItem value='AC'>AC</MenuItem>
                            <MenuItem value='SS'>SS</MenuItem>
                        </Select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bloodGroup" className='inputLabel'>Blood group *</label>
                        <Select id='bloodGroup'  
                            name='bloodGroup'
                            variant="outlined"
                            color='success'
                            value={bloodGroup}
                            onChange={(e) => setBloodGroup(e.target.value)}
                        >
                            <MenuItem value='A'>A</MenuItem>
                            <MenuItem value='B'>B</MenuItem>
                            <MenuItem value='AB'>AB</MenuItem>
                            <MenuItem value='O'>O</MenuItem>
                        </Select>
                    </div>
                </div>

                <div className="line"></div>

                <div className="flex">
                    <div className="form-group">
                        <label htmlFor="dob" className='inputLabel'>Date of brith *</label>
                        <TextField 
                        placeholder='Date of birth' 
                        name='date' 
                        variant="outlined" 
                        color='success' 
                        type={'date'}
                        value={dateOfBirth}
                        onChange={(e) => setDateOfBirth(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="religion" className='inputLabel'>Religion *</label>
                        <Select
                            id="" 
                            name='' 
                            variant="outlined"
                            color='success'
                            value={religion}
                            onChange={(e) => setReligion(e.target.value)}
                        >
                            <MenuItem value='Christianity'>Christianity</MenuItem>
                            <MenuItem value='Islamic'>Islamic</MenuItem>
                            <MenuItem value='Others'>Others</MenuItem>
                        </Select>
                    </div>
                </div>

                <div className="line"></div>

                <div className="flex">
                    <div className="form-group">
                        <label htmlFor="stateOfOrigin" className='inputLabel'>State of origin *</label>
                        <TextField 
                        id="stateOfOrigin"  
                        placeholder='State of origin' 
                         
                        name='stateOfOrigin'   
                        variant="outlined" 
                        color='success' 
                        type={'text'}
                        value={stateOfOrigin}
                        onChange={(e) => setStateOfOrigin(e.target.value)}
                        />
                        {/* add a select option instead of manual typing */}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lga" className='inputLabel'>LGA *</label>
                        <TextField 
                        id=""  
                        placeholder='Local government area' 
                         
                        name='lga' 
                        variant="outlined" 
                        color='success' 
                        type={'text'} 
                        value={lga}
                        onChange={(e) => setLga(e.target.value)}
                        />
                        {/* based on the state selected fetch the local government area */}
                    </div>
                </div>
                
                <div className="line"></div>

                <div className="flex">
                    <div className="form-group">
                        <label htmlFor="nationality" className='inputLabel'>Nationality *</label>
                        <TextField 
                        placeholder='Nationality' 
                        name='nationality' 
                        variant="outlined" 
                        color='success' 
                        type={'text'}
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sex" className='inputLabel'>Sex *</label>
                        <Select
                            id=""
                            name='sex' 
                            variant="outlined"
                            color='success'
                            value={sex}
                            onChange={(e) => setSex(e.target.value)}
                        >
                            <MenuItem value='Male'>Male</MenuItem>
                            <MenuItem value='Female'>Female</MenuItem>
                            <MenuItem value='Rather not say'>Rather not say</MenuItem>
                        </Select>
                    </div>
                </div>

                <div className="line"></div>

                {/* address */}
                <div className="form-group">
                    <label htmlFor="address" className='inputLabel'>Address *</label>
                    <textarea 
                        name="address" 
                        id="address" 
                        cols="10" rows="5" 
                        placeholder='Address'
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    ></textarea>
                </div>

                {isLoading && <Loader />}

                <div className="form-group" style={{
                        marginBottom: '0px'
                    }}>
                        <Button variant="contained" color='success' className='formButton' type="submit" onClick={scrollToTop} style={buttonStyle}> Submit </Button>
                </div>
            </form>
            </div>
        </div>
        <Footer />
    </>
  )
}

export default RegisterScreen