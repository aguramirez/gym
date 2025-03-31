import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import Login from "./Login.tsx";
import Dashboard from "./components/Dashboard.tsx";
import ClienteView from "./components/ClienteView.tsx";
import authService from "./services/authService";
import LoadingScreen from "./components/LoadingScreen";
import { useState } from "react";

// Componente para rutas protegidas
interface ProtectedRouteProps {
  element: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ element, requiredRole }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Pequeña demora para mostrar la pantalla de carga (más natural)
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Mientras verifica, mostrar pantalla de carga
  if (isChecking) {
    return <LoadingScreen message="Verificando acceso..." timeout={1000} />;
  }
  
  // Verificar si el usuario está autenticado
  if (!authService.isLoggedIn()) {  // Cambiado de isAuthenticated a isLoggedIn
    console.log("Usuario no autenticado, redirigiendo a login");
    return <Navigate to="/" replace />;
  }
  
  // Si se especifica un rol requerido, verificar que el usuario tenga ese rol
  if (requiredRole) {
    const user = authService.getCurrentUser();
    console.log("Verificando rol:", user?.rol, "Requerido:", requiredRole);
    
    if (!authService.hasRole(requiredRole)) {
      console.log("Usuario no tiene el rol requerido");
      // Redirigir a página de cliente si el usuario está autenticado pero no tiene el rol requerido
      if (user) {
        return <Navigate to={`/cliente/${user.id}`} replace />;  // Cambiado de clienteId a id
      }
      
      // Si por alguna razón no hay información de usuario, redirigir al login
      return <Navigate to="/" replace />;
    }
  }
  
  // Si todo está bien, mostrar el componente protegido
  return <>{element}</>;
};

// Componente principal de la aplicación
const App = () => {
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Inicializar el servicio de autenticación al cargar la aplicación
  useEffect(() => {
    console.log("Inicializando servicio de autenticación");
    
    const initializeApp = async () => {
      // Verificar si hay un token almacenado
      const token = localStorage.getItem('token');
      console.log("Token en localStorage:", token ? "Presente" : "Ausente");
      
      if (token) {
        const user = authService.getCurrentUser();
        console.log("Usuario almacenado:", user ? "Presente" : "Ausente");
        if (user) {
          console.log("Rol almacenado:", user.rol);
          console.log("Cliente ID almacenado:", user.id);
        }
      }
      
      // Ya no llamamos a initializeAuth() porque no existe en nuestro servicio
      
      // Pequeña demora para mostrar la pantalla de carga inicial
      setTimeout(() => {
        setIsInitializing(false);
      }, 2000);
    };
    
    initializeApp();
    
    // Añadir un interceptor global para manejar errores de autenticación
    const interceptorId = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response && error.response.status === 401) {
          console.log("Error 401: Sesión expirada o inválida");
          authService.logout();
          window.location.href = '/';
        }
        return Promise.reject(error);
      }
    );
    
    // Limpiar el interceptor al desmontar
    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, []);

  // Mostrar pantalla de carga mientras inicializa
  if (isInitializing) {
    return <LoadingScreen message="Iniciando aplicación..." />;
  }

  return (
    <Router>
      <Routes>
        {/* Ruta pública para login */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={<ProtectedRoute element={<Dashboard />} requiredRole="ADMIN" />} 
        />
        <Route 
          path="/cliente/:id" 
          element={<ProtectedRoute element={<ClienteView />} />} 
        />
        
        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);