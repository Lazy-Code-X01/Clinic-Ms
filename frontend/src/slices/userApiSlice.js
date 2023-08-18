import { apiSlice } from "./apiSlice";

const USERS_URL = 'https://clinic-ms-api.onrender.com/api/users/'

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data
            })
        }),
    })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation } = usersApiSlice