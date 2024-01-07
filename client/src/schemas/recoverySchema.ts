import * as yup from "yup";

export const recoverySchema = yup.object({
  email: yup
    .string()
    .required("This field is required")
    .email("Please enter valid email"),
});
export type recoveryData = yup.InferType<typeof recoverySchema>;
