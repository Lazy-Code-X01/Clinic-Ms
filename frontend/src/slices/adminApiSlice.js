import { apiSlice } from "./apiSlice";

const USERS_URL = '/api/admin'

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data
            })
        }),
    })
})

export const { useLoginMutation } = adminApiSlice