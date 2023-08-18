// hooks/useUsers.js
import { useState, useEffect } from 'react';

const useUsers = () => {
  const [USERLIST, setUsers] = useState([]);
  const [allDiagnosis, setAllDiagnosis] = useState([])
  const [loader, setLoader] = useState(true); // New state for loading
  const [error, setError] = useState(null); // New state for error handling

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://clinic-ms-api.onrender.com/api/users/getUser'); // Replace this with your API endpoint URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setUsers(data);
        setLoader(false); // Set loading to false after the data is fetched
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching users:', error.message);
        setLoader(false); // Set loading to false in case of an error
        setError('Failed to fetch data. Please try again later.'); // Set the error message
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchDiagnosis = async () => {
      try {
        const response = await fetch('https://clinic-ms-api.onrender.com/api/users/getDiagnosis'); // Replace this with your API endpoint URL
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAllDiagnosis(data);
        setLoader(false); // Set loading to false after the data is fetched
        setError(null); // Clear any previous errors
      } catch (error) {
        console.error('Error fetching Diagnosis:', error.message);
        setLoader(false); // Set loading to false in case of an error
        setError('Failed to fetch data. Please try again later.'); // Set the error message
      }
    };

    fetchDiagnosis();
  }, []);


  return { USERLIST, allDiagnosis, loader, error }; // Return users array, loading state, and error message
};

export default useUsers;