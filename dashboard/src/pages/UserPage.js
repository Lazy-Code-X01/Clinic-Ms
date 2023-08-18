import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios'; // Import axios
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

import { filter, sample } from 'lodash';


import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
// mpck
import account from '../_mock/account';
// components
import Label from '../components/label';
import LoadingSpinner from '../components/loadingSpinner/Loader';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import useUsers from '../hooks/useUsers';
import users from '../_mock/user';

import UserDataDisplay from './UserDataDisplay';

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'company', label: 'Department', alignRight: false },
  { id: 'role', label: 'Matric Number', alignRight: false },
  { id: 'isVerified', label: 'Email', alignRight: false },
  { id: 'status', label: 'Phone', alignRight: false },
  { id: '' },
];

// Function to handle network errors
const handleNetworkError = (error) => {
  console.error('Network error:', error);
  toast.error('Failed to fetch data. Please check your internet connection and try again.');
};


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// // Function to search by matric number
function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => {
      const matricNumber = _user.matric_number.toLowerCase();
      return matricNumber.indexOf(query.toLowerCase()) !== -1;
    });
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const navigate = useNavigate()


  // const USERLIST = useUsers();
  const [userData, setUserData] = useState(null); // New state variable for user data

  const [selectedUserId, setSelectedUserId] = useState(null);
  // eslint-disable-next-line camelcase
  const [open, setOpen] = useState(null);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [loading, setLoading] = useState(false); // New state for loading
  const [openDialog, setOpenDialog] = useState(false); // New state for dialog
  const [formData, setFormData] = useState({ // New state for form data
    firstName: '',
    lastName: '',
    department: '',
    matric_number: '',
    email: '',
    phoneNumber: '',
    level: '',
    genotype: '',
    bloodGroup: '',
    dateOfBirth: '',
    religion: '',
    stateOfOrigin: '',
    lga: '',
    nationality: '',
    sex: '',
    address: '',
  });

  // Use the useUsers hook
  const { USERLIST, loader, error } = useUsers();

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

    // Function to get a random avatar URL from the mock data
  const getRandomAvatarUrl = () => {
    const avatarUrls = filteredUsers.map((user) => user.avatarUrl);
    return sample(avatarUrls);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleFormSubmit = () => {
  // Validate the form data before submitting
  if (!formData.firstName || !formData.lastName || !formData.department || !formData.matric_number || !formData.email || !formData.phoneNumber) {
    // Show an error message or toast indicating that required fields are missing
    // Replace the alert with a proper error notification mechanism, like using a Toast component.
    toast('Please fill all required fields.');
    return;
  }
  // Make a POST request to the server with the form data
  axios
    .post('https://clinic-ms-api.onrender.com/api/users', formData)
    .then((response) => {
      setLoading(false); // Hide the loading spinner
      toast.success("User added successfully")
      console.log('User added successfully:', response.data); // Log the response from the server (Replace with your actual handling logic)
      setOpenDialog(false); // Close the dialog after form submission
    })
    .catch((error) => {
      setLoading(false); // Hide the loading spinner
      toast.error("Error adding user")
      console.error('Error adding u2ser:', error); // Log the error (Replace with your actual error handling logic)
      // Show an error message or toast indicating that something went wrong
      // Replace the alert with a proper error notification mechanism, like using a Toast component.
      alert('Error adding user. Please try again later.');
    });
  };

  const handleViewUser = async () => {
    if (!selectedUserId) {
      return; // No user selected, return early
    }
    try {
      const response = await axios.get(`https://clinic-ms-api.onrender.com/api/users/${selectedUserId}`);
      setUserData(response.data);
      // console.log(userData);
    } catch (err) {
      console.error(err);
      handleNetworkError(err); // Handle network error
      setUserData(null);
    }
  };
  useEffect(() => {
    // This code block will be executed whenever `userData` is updated.
    console.log(userData);
  }, [userData]);


  return (
    <>
        {loader ? (
          <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30vh' }}>
            <LoadingSpinner />
          </Container>
        ) : error ? (
          <Container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '30vh' }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Container>
        ) : (
        <>
          <Helmet>
            <title> Patients | Tbase😈 MS </title>
          </Helmet>

        {/* {userData && <UserDataDisplay userData={userData} />} */}

          <Container>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
              <Typography variant="h4" gutterBottom>
                Patients
              </Typography>
              <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleDialogOpen}>
                New Patient
              </Button>
            </Stack>

            <Card>
              <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

              
              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <UserListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      rowCount={USERLIST.length}
                      numSelected={selected.length}
                      onRequestSort={handleRequestSort}
                      onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, lol) => {
                        // eslint-disable-next-line camelcase
                        const { _id, firstName, lastName, department, email, phoneNumber, matric_number } = row;
                        const {avatarUrl} = lol
                        const selectedUser = selected.indexOf(firstName) !== -1;

                        return (
                          <TableRow hover key={_id} tabIndex={-1} lastName="checkbox" selected={selectedUser}>
                            <TableCell padding="checkbox">
                              <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, firstName)} />
                            </TableCell>

                            <TableCell component="th" scope="row" padding="none">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar alt={firstName} src={account.studentPhoto} />
                                <Typography variant="subtitle2" noWrap>
                                  {`${lastName} ${firstName}`}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">{department}</TableCell>
                            {/* eslint-disable-next-line camelcase */}
                            <TableCell align="left">{matric_number}</TableCell>

                            <TableCell align="left">{email}</TableCell>

                            <TableCell align="left">{phoneNumber}</TableCell>

                            <TableCell align="right">
                              <IconButton size="large" color="inherit" 
                                  onClick={(event) => {
                                    setSelectedUserId(_id);
                                    handleOpenMenu(event);
                                  }}
                              >
                                <Iconify icon={'eva:more-vertical-fill'} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {emptyRows > 0 && (
                        <TableRow style={{ height: 53 * emptyRows }}>
                          <TableCell colSpan={6} />
                        </TableRow>
                      )}
                    </TableBody>

                    {isNotFound && (
                      <TableBody>
                        <TableRow>
                          <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                            <Paper
                              sx={{
                                textAlign: 'center',
                              }}
                            >
                              <Typography variant="h6" paragraph>
                                Not found
                              </Typography>

                              <Typography variant="body2">
                                No results found for &nbsp;
                                <strong>&quot;{filterName}&quot;</strong>.
                                <br /> Try checking for typos or using complete words.
                              </Typography>
                            </Paper>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    )}
                  </Table>
                </TableContainer>
              </Scrollbar>

              <TablePagination
                rowsPerPageOptions={[5, 10, 15, 25, 50]}
                component="div"
                count={USERLIST.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Card>
          </Container>

          <Popover
            open={Boolean(open)}
            anchorEl={open}
            onClose={handleCloseMenu}
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
              sx: {
                p: 1,
                width: 140,
                '& .MuiMenuItem-root': {
                  px: 1,
                  typography: 'body2',
                  borderRadius: 0.75,
                },
              },
            }}
          >
            <Link to={`/dashboard/patients/viewDetails/${selectedUserId}`} style={{textDecoration: "none", color: "#212B36"}}>
              <MenuItem 
                onClick={handleViewUser}>
                <Iconify icon={'carbon:view-filled'} sx={{ mr: 2 }} />
                View
              </MenuItem>
            </Link>
            

            {/* <MenuItem sx={{ color: 'error.main' }}>
              <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
              Delete
            </MenuItem> */}
          </Popover>

          {/* Dialog to create a new patient */}
          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>New Patient</DialogTitle>
            <DialogContent>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Matric Number"
                name="matric_number"
                value={formData.matric_number}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Level"
                name="level"
                value={formData.level}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Genotype"
                name="genotype"
                value={formData.genotype}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State of Origin"
                name="stateOfOrigin"
                value={formData.stateOfOrigin}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="LGA"
                name="lga"
                value={formData.lga}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Sex"
                name="sex"
                value={formData.sex}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={handleFormSubmit} color="primary">
                Submit
              </Button>
            </DialogActions>
          </Dialog>

        {userData && <UserDataDisplay userData={userData} />}

        </>
      )}
    </>
  );
}
