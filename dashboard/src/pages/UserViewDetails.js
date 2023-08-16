import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Avatar, Container, Stack, Typography, Tabs, Tab, Box, Card, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import axios from 'axios';
import { useParams } from 'react-router-dom';
import Iconify from '../components/iconify';
import { AppWebsiteVisits } from '../sections/@dashboard/app';

// mpck
import account from '../_mock/account';

const UserViewDetails = ({ datas }) => {
  // State to store user's diagnosis data
  const [diagnoses, setDiagnoses] = useState([]);

  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams()
  const userId = params.id
  
  // diagnosis form states
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  // the doctor name would be added automatically 
  const { userInfo }  = useSelector((state) => state.auth)

  const [isDialogOpen, setIsDialogOpen] = useState(false); // State to manage the pop-up visibility
  const [selectedTab, setSelectedTab] = useState(0);

  const handleChangeTab = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  // Function to format the date of birth
  const formatDateOfBirth = (dob) => {
    const dateObj = new Date(dob);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  // function to format diagnosis date including the time
  const formatDiagnosisDate = (dob) => {
    const dateObj = new Date(dob);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };


  // Function to fetch the user's diagnosis data
  const fetchDiagnoses = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}/diagnoses`);
      setDiagnoses(response.data);
    } catch (error) {
      // Handle error if the API request fails
      console.error("Error fetching user's diagnosis:", error);
    }
  };

  //  Fetch the user's diagnosis data on component mount
  useEffect(() => {
    fetchDiagnoses();
  }, []);

    //  function to add diagnosis
  const handleFormSubmit = async () =>{
    // validate the form before submitting
    if (!name || !description) {
      toast.error("Please fill all required fields.")
      return;
    }
    
    try {

      // Set the loading state to true before making the API call
      setIsLoading(true);
      
      // Make the POST request to the backend to add the diagnosis
      const response = await axios.post(`http://localhost:5000/api/users/${userId}/diagnoses`, {
        name,
        description,
        diagnosingDoctor: userInfo.username, // Replace with the actual doctor's name
      });

      // Handle the response
      toast.success("Daignosis added sucessfully")
      console.log(response.data); // Log the response data or handle it as needed
      
        // Update the diagnoses state with the new diagnosis
      setDiagnoses([...diagnoses, response.data]);

      // Clear the form fields after successful submission
      setName("");
      setDescription("");
      // Close the dialog after successful submission
      handleCloseDialog();
    } catch (error) {
      // Handle any errors that occurred during the request
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An error occurred. Please try again later.");
      }
      } finally {
        // Set the loading state back to false after the API call is completed (whether success or error)
        setIsLoading(false);
      }
  }

  
  // Function to render the list of diagnoses or a message if there are no diagnoses
  const renderDiagnoses = () => {
    if (diagnoses.length === 0) {
      return (
        <Typography variant="body1" color="textSecondary" textAlign="left" my={3}>
          No diagnoses available for this user 😁.
        </Typography>
      );
    }
    return (
      <Stack direction="column" spacing={2}>
        {diagnoses.reverse().map((diagnosis) => (
          <Card key={diagnosis._id} sx={{ padding: '10px', width: "80%" }}>
            {/* diagnosis */}
            <Typography variant="h5" gutterBottom marginBottom={.5} color={'#212B36'}>
              {diagnosis.name}
            </Typography>
            <Stack direction="row" justifyContent={'space-between'} mb={1}>
              <Typography>{diagnosis.description}</Typography>
            </Stack>
            <Stack direction={"row"} spacing={3}>
              <Typography fontSize={"13px"} color={"gray"} fontWeight={700}>{diagnosis.diagnosingDoctor}</Typography>
              <Typography fontSize={"13px"} color={"gray"} fontWeight={700}>{formatDiagnosisDate(diagnosis.date)}</Typography>
            </Stack>
          </Card>
        ))}
      </Stack>
    );
  };

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4" gutterBottom>
          Patient Profile
        </Typography>
        {selectedTab === 1 && ( // Conditionally render the button
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenDialog}>
            New Diagnosis
          </Button>
        )}
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" marginBottom={3}>
        <Avatar alt='image loading....' src={account.studentPhoto} />
        <div>
          <Typography variant="subtitle2">
            {datas.firstName} {datas.lastName}
          </Typography>
          <Typography variant="body2">
            {datas.matric_number}
          </Typography>
        </div>
      </Stack>

      {/* Tabs */}
      <Stack direction="row" justifyContent={"space-between"} gap={10} mb={5}>
        <Box flex={2.5}>
          <Tabs
            value={selectedTab}
            onChange={handleChangeTab}
            centered={false}
            indicatorColor="secondary"
            textColor="primary"
            sx={{ mb: 3 }} // Add margin at the bottom to create space between tabs and content
          >
            <Tab label="Patient Information" />
            <Tab label="Daiagnosis" />
          </Tabs>

          {/* Tab Panels */}
          <Box>
            {selectedTab === 0 && (
              <Box>
                <Typography variant="h4" marginBottom={3} color={"#212B36"}>General Information</Typography>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Date of Birth </Typography>
                    <Typography> {formatDateOfBirth(datas.dateOfBirth)} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Blood Group </Typography>
                    <Typography> {datas.bloodGroup} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Department </Typography>
                    <Typography> {datas.department} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Address </Typography>
                    <Typography> {datas.address} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> State of Origin </Typography>
                    <Typography> {datas.stateOfOrigin} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Genotype </Typography>
                    <Typography> {datas.genotype} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Level </Typography>
                    <Typography> {datas.level} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> L.G.A </Typography>
                    <Typography> {datas.lga} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Nationality </Typography>
                    <Typography> {datas.nationality} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Religion </Typography>
                    <Typography> {datas.religion} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Sex </Typography>
                    <Typography> {datas.sex} </Typography>
                </Stack>

                <Typography variant="h4" gutterBottom marginBottom={3} color={"#212B36"}>Contact Information</Typography>
                
                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Email address </Typography>
                    <Typography> {datas.email} </Typography>
                </Stack>

                <Stack direction="row" justifyContent={"space-between"} mb={3}>
                    <Typography fontWeight={600}> Phone number </Typography>
                    <Typography> {datas.phoneNumber} </Typography>
                </Stack>

              </Box>
            )}
            {selectedTab === 1 && (
              <Box>
                {renderDiagnoses()}
              </Box>
            )}
          </Box>
        </Box>

        <Box flex={2}>
          <Card sx={{ }}>
          <AppWebsiteVisits
              title="Visits rate"
              // subheader="(+43%) than last year"
              chartLabels={[
                '01/01/2023',
                '02/01/2023',
                '03/01/2023',
                '04/01/2023',
                '05/01/2023',
                '06/01/2023',
                '07/01/2023',

              ]}

              chartData={[
                {
                  name: '200 level',
                  type: 'area',
                  fill: 'gradient',
                  data: [44, 55, 41, 67, 22, 43, 21,],
                },
              ]}
            />
          </Card>
        </Box>
      </Stack>
      
      {/* Pop-up Dialog */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>New Diagnosis</DialogTitle>
        <DialogContent>
          <form onSubmit={handleFormSubmit}>
            <TextField
              id="diagnosisName"
              label="Diagnosis Name/Code"
              variant="outlined"
              style={{marginTop: "10px"}}
              fullWidth
              value={name}
              onChange={e => setName(e.target.value)}
              // Add necessary event handlers and value state
            />
            <TextField
              id="diagnosisDescription"
              label="Diagnosis Description"
              variant="outlined"
              style={{marginTop: "15px"}}
              multiline
              rows={4}
              fullWidth
              value={description}
              onChange={e => setDescription(e.target.value)}
              // Add necessary event handlers and value state
            />
            {/* Add more input fields for relevant diagnosis information */}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button color="primary" type="submit" onClick={handleFormSubmit}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Add Diagnosis"}
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default UserViewDetails;
