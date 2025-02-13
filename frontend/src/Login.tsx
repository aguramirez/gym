import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Íconos de ojo
import './login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h1>Bienvenido</h1>
      <div className="form-container">
        <input type="text" placeholder="Nombre" className="input-field" />
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Contraseña"
            className="input-field"
          />
          <button
            type="button"
            className="toggle-password"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        <button type="submit" className="submit-button">Iniciar Sesión</button>
      </div>
    </div>
  );
};

export default Login;