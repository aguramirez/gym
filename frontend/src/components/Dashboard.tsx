import { useState, useEffect } from 'react';
import { FaUsers, FaList, FaDumbbell, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import ClienteList from './ClienteList';
import EjercicioList from './EjercicioList';
import RutinaList from './RutinaList';
import authService from '../services/authService';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Clientes');
  const navigate = useNavigate();
  
  // Verificar que el usuario tiene permisos de acceso
  useEffect(() => {
    const user = authService.getCurrentUser();
    
    if (!user) {
      navigate('/');
      return;
    }
    
    // Solo ADMIN y TRAINER pueden acceder al dashboard
    if (user.rol !== 'ADMIN' && user.rol !== 'TRAINER') {
      navigate(`/cliente/${user.clienteId}`);
    }
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1><FaDumbbell /></h1>
        <div className="user-section">
          <span className="user-name">
            Bienvenido {authService.getCurrentUser()?.nombre || 'Usuario'}!
          </span>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt />Salir
          </button>
        </div>
      </header>

      <div className="dashboard-main">
        <div className="segmented-control">
          <button 
            className={activeTab === 'Clientes' ? 'active' : ''} 
            onClick={() => setActiveTab('Clientes')}
          >
            <FaUsers /> Clientes
          </button>
          <button 
            className={activeTab === 'Rutinas' ? 'active' : ''} 
            onClick={() => setActiveTab('Rutinas')}
          >
            <FaList /> Rutinas
          </button>
          <button 
            className={activeTab === 'Ejercicios' ? 'active' : ''} 
            onClick={() => setActiveTab('Ejercicios')}
          >
            <FaDumbbell /> Ejercicios
          </button>
        </div>

        <div className="content-section">
          {activeTab === 'Clientes' && <ClienteList />}
          {activeTab === 'Rutinas' && <RutinaList />}
          {activeTab === 'Ejercicios' && <EjercicioList />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;