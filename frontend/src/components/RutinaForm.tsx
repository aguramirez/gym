import React, { useState } from 'react';
import axios from 'axios';
import RutinaDiaForm from './RutinaDiaForm';
import useDatos from '../services/useDatos';

type RutinaFormProps = {
  onSave: (rutina: { nombre: string; rutinaDias: any[] }) => void;
};

const RutinaForm: React.FC<RutinaFormProps> = ({ onSave }) => {
  const { ejercicios } = useDatos(); // Obtener los ejercicios desde el hook
  const [nombre, setNombre] = useState('');
  // const [dias, setDias] = useState<number>(1);
  const [rutinaDias, setRutinaDias] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleAddDia = (dia: any) => {
    setRutinaDias([...rutinaDias, dia]);
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    const rutinaData = { nombre, rutinaDias };
    console.log('JSON enviado:', JSON.stringify(rutinaData, null, 2)); // Verificar la estructura
    try {
      const response = await axios.post('http://localhost:8080/rutinas', rutinaData);
      console.log('Respuesta del backend:', response.data);
      onSave(response.data); // Notificar al componente padre con la rutina guardada
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
    }
  };

  return (
    <div className="p-4 bg-dark text-light">
      <h2 className="text-xl font-bold mb-4">Crear Rutina</h2>
      <div className="mb-3">
        <input
          className="form-control bg-secondary text-light"
          placeholder="Nombre de la rutina"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <div className="mb-3">
        {/* <input
          className="form-control bg-secondary text-light"
          placeholder="Cantidad de días"
          type="number"
          value={dias}
          onChange={(e) => setDias(Number(e.target.value))}
          min={1}
        /> */}
      </div>
      <button className="btn btn-primary mb-3" onClick={() => setModalOpen(true)}>Agregar Días</button>

      <ul className="list-group mb-3">
        {rutinaDias.map((dia, index) => (
          <li key={index} className="list-group-item bg-secondary text-light">
            {dia.nombre}
          </li>
        ))}
      </ul>

      <button className="btn btn-success" onClick={handleSubmit}>Guardar Rutina</button>

      {isModalOpen && (
        <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Agregar Día</h5>
                <button type="button" className="btn-close" onClick={() => setModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <RutinaDiaForm onSave={handleAddDia} ejercicios={ejercicios} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RutinaForm;