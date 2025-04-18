import * as Yup from "yup";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email Is Required"),
  password: Yup.string().required("Password Is Required"),
});

export default LoginSchema;
