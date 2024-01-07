import * as yup from "yup";

export const loginSchema = yup.object({
  password: yup.string().required("This field is required"),
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter valid email"),
});
export type LoginData = yup.InferType<typeof loginSchema>;
