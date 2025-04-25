import * as Yup from "yup";

// this schema is used to validate the register form inputs
const RegisterSchema = Yup.object().shape({
  name: Yup.string().min(2, "Too short").required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must include at least one uppercase letter")
    .matches(/[a-z]/, "Must include at least one lowercase letter")
    .matches(/[0-9]/, "Must include at least one number")
    .matches(
      /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "Must include at least one special character"
    ),
});

export default RegisterSchema;
