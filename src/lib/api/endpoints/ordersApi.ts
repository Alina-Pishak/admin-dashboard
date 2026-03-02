import { baseApi } from "@/lib/api/baseApi";
import type { ListResponse, Order } from "@/types/entities";

const ordersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<ListResponse<Order>, void>({
      query: () => "/orders",
      providesTags: ["Orders"],
    }),
  }),
});

export const { useGetOrdersQuery } = ordersApi;
