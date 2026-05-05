import * as yup from "yup";

export const loginSchema = yup
  .object({
    email: yup
      .string()
      .trim()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  })
  .required();

export const productFormSchema = yup
  .object({
    name: yup
      .string()
      .trim()
      .min(2, "Product info must be at least 2 characters")
      .required("Product info is required"),
    category: yup.string().required("Category is required"),
    stock: yup
      .string()
      .matches(/^\d+$/, "Stock must be a whole number")
      .required("Stock is required"),
    suppliers: yup.string().trim().required("Suppliers is required"),
    price: yup
      .string()
      .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid price")
      .required("Price is required"),
  })
  .required();

export const supplierFormSchema = yup
  .object({
    name: yup.string().trim().required("Suppliers info is required"),
    address: yup.string().trim().required("Address is required"),
    company: yup.string().trim().required("Company is required"),
    deliveryDate: yup.string().required("Delivery date is required"),
    amount: yup
      .string()
      .matches(/^\d+(\.\d{1,2})?$/, "Enter a valid amount")
      .required("Amount is required"),
    status: yup.string().required("Status is required"),
  })
  .required();
