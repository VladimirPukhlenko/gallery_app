import * as yup from "yup";

export const registrationSchema = yup.object({
  fullName: yup
    .string()
    .required("This field is required")
    .min(5, "Too short full name")
    .max(90, "Too long full name"),
  password: yup
    .string()
    .required("This field is required")
    .min(5, "Too short password")
    .max(90, "Too long password"),
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter valid email"),
});
export type RegistrationData = yup.InferType<typeof registrationSchema>;
