import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({ baseUrl: 'https://clinic-ms-api.onrender.com/api/admin' });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Admin'],
  endpoints: (builder) => ({
    // Define  API endpoints here
  }),
});
