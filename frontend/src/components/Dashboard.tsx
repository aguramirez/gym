import { useState } from 'react';
import { FaSearch, FaUsers, FaList, FaDumbbell } from 'react-icons/fa'; // Íconos
import './Dashboard.css';
import ClienteList from './ClienteList';
import EjercicioList from './EjercicioList';
import RutinaList from './RutinaList';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('Clientes'); // Estado para el segmented control
  

  return (
    <div className="dashboard-container">
      {/* Título */}
      <h1>Administrador</h1>

      {/* Barra de búsqueda */}
      <div className="search-bar">
        <input type="text" placeholder="Buscar..." />
        <button className="search-button">
          <FaSearch />
        </button>
      </div>

      {/* Segmented Control */}
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

      {/* Contenido dinámico */}
      <div className="content">
        {activeTab === 'Clientes' && <ClienteList />}
        {activeTab === 'Rutinas' && <RutinaList />}
        {activeTab === 'Ejercicios' && <EjercicioList />}
      </div>

    </div>
  );
};

export default Dashboard;