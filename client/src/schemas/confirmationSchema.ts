import * as yup from "yup";

export const confirmationSchema = yup.object({
  key: yup
    .string()
    .required("This field is required")
    .min(5, "Length shoud be 5 symbols")
    .max(5, "Length shoud be 5 symbols"),
  password: yup
    .string()
    .required("This field is required")
    .min(5, "Too short password")
    .max(90, "Too long password"),
});

export type confirmationData = yup.InferType<typeof confirmationSchema>;
