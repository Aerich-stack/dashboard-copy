import React from "react";
import LoginForm from "../components/LoginForm";

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const handleLogin = () => {
    onLogin();
  };

  return (
    <LoginForm
      title="Admin Login"
      role="admin"
      onLogin={handleLogin}
      onBack={onBack}
      demoInfo="Demo Credentials: admin@school.com / admin123"
    />
  );
};

export default AdminLogin;

