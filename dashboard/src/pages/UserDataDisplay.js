import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/loadingSpinner/Loader';
import UserViewDetails from './UserViewDetails';


const UserDataDisplay = () => {
  const params = useParams();
  const { id } = params;
  
  // State to store the fetched data, loading state, and error state
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from the API
  async function fetchPatientDetailsById(id) {
    try {
      const response = await fetch(
        `https://clinic-ms-api.onrender.com/api/users/${id}`
      );
      if (!response.ok) {
        setError("Network Error");
        return null;
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      setError("Fetching Error");
      return null;
    }
  }

  useEffect(() => {
    // Fetch the data when the component mounts
    fetchPatientDetailsById(id).then((data) => {
      if (data) {
        // Update the state with the fetched data and set loading to false
        setPatientInfo(data);
      } else {
        console.log("Failed to fetch data.");
        setError("Failed to fetch data.")
      }
      setLoading(false); // Set loading to false once the data fetching process is complete
    });
  }, [id]);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {error ? (
            <p>Error: {error}</p>
          ) : (
            patientInfo && <UserViewDetails datas={patientInfo} />
          )}
        </>
      )}
    </>
  );
};

export default UserDataDisplay;
