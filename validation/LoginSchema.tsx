import * as Yup from "yup";

// This schema is used to validate the login form inputs
const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email Is Required"),
  password: Yup.string().required("Password Is Required"),
});

export default LoginSchema;
