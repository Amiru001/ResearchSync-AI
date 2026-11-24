import AuthLayout from "../../components/auth/AuthLayout";
import RegisterForm from "../../components/auth/RegisterForm";

const Register = () => {
  return (
    <AuthLayout
      title="Create Student Account"
      subtitle="Create your account to access ResearchSync AI"
    >
      <RegisterForm />
    </AuthLayout>
  );
};

export default Register;