import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';

// components
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------
import { useRegisterMutation } from '../../../slices/adminApiSlice';
import { setCredentials } from '../../../slices/authSlice';

export default function RegisterForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const [showPassword, setShowPassword] = useState(false);
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [address, setAddress] = useState('')
  const [contactNumber, setContactNumber] = useState('')
  const [email, setEmail] = useState('')
  const [sex, setSex] = useState('Male');

  const handleSexChange = (event) => {
    setSex(event.target.value);
  };

  useEffect(() => {
    if (userInfo) {
      navigate('/dashboard/app', { replace: true });
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault()

    try {
      const res = await register({ firstName, lastName, username, password, address, contactNumber, email, sex }).unwrap();
      dispatch(setCredentials(res));
      navigate('/dashboard/app', { replace: true });
    } catch (err) {
      // toast.error('Failed to register. Please check your credentials.');
      toast.error(err?.data?.message );
    }
  };

  return (
    <>
    <form onSubmit={submitHandler}>
        {/* first name and last name */}
        <Stack spacing={3} direction={"row"} sx={{ my: 2 }}>
          <TextField name="firstName" label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
          <TextField name="lastName" label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)}/>
        </Stack>

        {/* user name and password */}
        <Stack spacing={3} direction={"row"} sx={{ my: 2 }}>
          <TextField name="username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)}/>

          <TextField
            name="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/* house address */}
        <Stack spacing={3} direction={"column"} sx={{ my: 2 }}>
          <TextField name="address" label="House address" value={address} onChange={(e) => setAddress(e.target.value)}/>
        </Stack>

        {/* contact number and email address */}
        <Stack spacing={3} direction={"row"} sx={{ my: 2 }}>
          <TextField name="phoneNumber" label="Contact number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)}/>
          <TextField name="email" label="Email address" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </Stack>

        {/* gender selection */}
        <Stack spacing={3} direction={"column"} sx={{ my: 2 }}>
          <Select
            id=""  
            name='sex' 
            value={sex}
            onChange={handleSexChange}
          >
            <MenuItem value='Male'>Male</MenuItem>
            <MenuItem value='Female'>Female</MenuItem>
            <MenuItem value='Rather not say'>Rather not say</MenuItem>
        </Select>
        </Stack>

        <LoadingButton 
          fullWidth 
          size="large" 
          type="submit" 
          variant="contained" 
          // onClick={submitHandler} 
          sx={{ backgroundColor: '#9C6CC8',
          '&:hover': {
            backgroundColor: '#7E4F9C',
          },
          }}
          loading={isLoading} // Use the loading prop instead of isLoading
          disabled={isLoading} // Disable the button while loading
        >
          Register
        </LoadingButton>
      </form>
    </>
  );
}
