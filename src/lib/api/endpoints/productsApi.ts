import { baseApi } from "@/lib/api/baseApi";
import type { ListResponse, Product } from "@/types/entities";

const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ListResponse<Product>, void>({
      query: () => "/products",
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
