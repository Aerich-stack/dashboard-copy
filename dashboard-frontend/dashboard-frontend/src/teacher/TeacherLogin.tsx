import React from "react";
import LoginForm from "../components/LoginForm";

interface TeacherLoginProps {
  onLogin: (teacher: any) => void;
  onBack: () => void;
}

const TeacherLogin: React.FC<TeacherLoginProps> = ({ onLogin, onBack }) => {
  return (
    <LoginForm
      title="Teacher Login"
      role="teacher"
      onLogin={onLogin}
      onBack={onBack}
      demoInfo="Use your email and password to login"
    />
  );
};

export default TeacherLogin;

