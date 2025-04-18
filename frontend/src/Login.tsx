import { useState, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaWhatsapp, FaInstagram } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import authService from "./services/authService";
import LoadingScreen from "./components/LoadingScreen";
import "./login.css";

const Login = () => {
  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const navigate = useNavigate();

  // Primera fase: mostrar la pantalla de carga inicial
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setShowLoadingScreen(false);
      // Comenzar a verificar autenticación después de la pantalla de carga
      checkAuthentication();
    }, 2500); // Duración de la pantalla de carga

    return () => clearTimeout(initialTimer);
  }, []);

  // Segunda fase: verificar si ya hay una sesión activa
  const checkAuthentication = async () => {
    try {
      // Pequeña demora para mostrar la pantalla de carga (más natural)
      await new Promise(resolve => setTimeout(resolve, 500));

      const user = authService.getCurrentUser();
      if (user) {
        // Si el usuario ya está autenticado, redirigir según su rol
        console.log("Usuario ya autenticado:", user);
        if (user.rol === "ADMIN" || user.rol === "TRAINER") {
          navigate("/dashboard");
        } else {
          navigate(`/cliente/${user.clienteId}`);
        }
      } else {
        setIsChecking(false);
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setIsChecking(false);
    }
  };

  const validateForm = (): boolean => {
    if (!nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    if (!dni.trim()) {
      setError("El DNI es obligatorio");
      return false;
    }
    return true;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login( nombre, dni );
      console.log("Respuesta de login:", response);

      // Muestra la pantalla de carga antes de redirigir
      setShowLoadingScreen(true);

      // Redirección basada en rol con un retraso para mostrar la pantalla de carga
      setTimeout(() => {
        if (response.rol === "ADMIN" || response.rol === "TRAINER") {
          console.log("Redirigiendo a dashboard");
          navigate("/dashboard");
        } else {
          console.log("Redirigiendo a vista de cliente");
          navigate(`/cliente/${response.clienteId}`);
        }
      }, 1500); // Tiempo suficiente para mostrar la pantalla de carga

    } catch (err: any) {
      console.error("Error de login:", err);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Credenciales incorrectas. Por favor, intente nuevamente.");
        } else {
          setError(`Error del servidor: ${err.response.data || "Intente más tarde"}`);
        }
      } else if (err.request) {
        setError("No hay respuesta del servidor. Verifique su conexión a internet.");
      } else {
        setError(`Error: ${err.message}`);
      }
      setIsLoading(false);
    }
  };

  // Si está mostrando la pantalla de carga inicial
  if (showLoadingScreen) {
    return <LoadingScreen message="Iniciando..." />;
  }

  // Si está verificando la autenticación, mostrar carga
  if (isChecking) {
    return (
      <div className="login-container">
        <div className="loading-overlay">
          <BiLoaderAlt className="login-spinner" />
          <p>Verificando sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <h1>FABIÁN</h1>
          <h2>COACH</h2>
        </div>

        <div className="form-container">
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="nombre">
                <FaUser className="input-icon" />
                <span className="input-label">Nombre de usuario</span>
              </label>
              <input
                id="nombre"
                type="text"
                className="input-field"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={isLoading}
                placeholder="Ingrese su nombre"
                autoComplete="off"
              />
            </div>

            <div className="input-group">
              <label htmlFor="dni">
                <FaLock className="input-icon" />
                <span className="input-label">DNI</span>
              </label>
              <div className="password-field-container">
                <input
                  id="dni"
                  type={showPassword ? "text" : "password"}
                  className="input-field"
                  value={dni}
                  onChange={(e) => setDni(e.target.value)}
                  disabled={isLoading}
                  placeholder="Ingrese su DNI"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  aria-label={showPassword ? "Ocultar DNI" : "Mostrar DNI"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <BiLoaderAlt className="btn-spinner" />
                  Iniciando sesión...
                </>
              ) : (
                "INGRESAR"
              )}
            </button>
          </form>

          <footer className="login-footer">
            <p>Para obtener acceso, contacte con el administrador</p>
            {/* <FaWhatsapp />
            <FaInstagram /> */}
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;