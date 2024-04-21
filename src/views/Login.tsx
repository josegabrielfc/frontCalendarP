import React, { useEffect, useState } from "react";
import "../styles/LoginSignup.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";

interface Props {
  action: string;
  emailIcon: string;
  passwordIcon: string;
  onActionChange: (newAction: string) => void;
}

const Login: React.FC<Props> = ({
  action,
  emailIcon,
  passwordIcon,
  onActionChange,
}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleActionChange = (newAction: string) => {
    onActionChange(newAction);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setUserData((prevData) => ({
      ...prevData,
      [field]: event.target.value,
    }));
  };

  const handleRegisterClick = async () => {
    try {
      if (
        userData.name === "" ||
        userData.email === "" ||
        userData.password === ""
      ) {
        alert("Todos los campos son necesarios");
      } else {
        const registro = await registerUser(userData);
        alert("Se ha agregado satisfactoriamente el usuario");
        console.log(registro);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    }
  };

  return (
    <div className="container-login">
      <div className="header">
        <div className="text">Ingresar</div>
        <div className="underline"></div>
      </div>
      <div className="inputs">
        <div className="input">
          <img src={emailIcon} alt="Email" />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => handleInputChange(e, "email")}
          />
        </div>
        <div className="input">
          <img src={passwordIcon} alt="Password" />
          <input
            type="password"
            placeholder="Contraseña"
            value={userData.password}
            onChange={(e) => handleInputChange(e, "password")}
          />
        </div>
      </div>
        <div className="forgot-password">
          Olvidaste tu Contraseña? <span>Presiona Aqui!</span>
        </div>
      <div className="submit-container">
        <div
          className={action === "Registrarse" ? "submit gray" : "submit"}
          onClick={handleRegisterClick}
        >
          Registrarse
        </div>
        <div
          className={action === "Ingresar" ? "submit gray" : "submit"}
          onClick={() => handleActionChange("Ingresar")}
        >
          Ingresar
        </div>
      </div>
    </div>
  );
};

export default Login;
