import { baseApi } from "@/lib/api/baseApi";
import type { ListResponse, Supplier } from "@/types/entities";

const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<ListResponse<Supplier>, void>({
      query: () => "/suppliers",
      providesTags: ["Suppliers"],
    }),
  }),
});

export const { useGetSuppliersQuery } = suppliersApi;
