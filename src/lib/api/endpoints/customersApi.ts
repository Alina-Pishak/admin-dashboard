import { baseApi } from "@/lib/api/baseApi";
import type { Customer, ListResponse } from "@/types/entities";

const customersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<ListResponse<Customer>, void>({
      query: () => "/customers",
      providesTags: ["Customers"],
    }),
  }),
});

export const { useGetCustomersQuery } = customersApi;
