import React, { useState, useEffect } from "react";
import axios from "axios";
import RutinaDiaForm from "./RutinaDiaForm";
import useDatos from "../services/useDatos";

type RutinaFormProps = {
  onSave: (rutina: { id?: number; nombre: string; rutinaDias: any[] }) => void;
  rutina?: { id?: number; nombre: string; rutinaDias: any[] } | null;
};

const RutinaForm: React.FC<RutinaFormProps> = ({ onSave, rutina }) => {
  const { ejercicios } = useDatos();
  const [nombre, setNombre] = useState("");
  const [rutinaDias, setRutinaDias] = useState<any[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedDia, setSelectedDia] = useState<any>(null); // Día seleccionado para editar

  // Inicializar datos si se está editando una rutina
  useEffect(() => {
    if (rutina) {
      setNombre(rutina.nombre || "");
      setRutinaDias(rutina.rutinaDias || []);
    }
  }, [rutina]);

  // Manejar la creación o edición de un día
  const handleSaveDia = (dia: any) => {
    if (selectedDia) {
      // Editar día existente
      setRutinaDias((prev) =>
        prev.map((d) => (d.id === dia.id ? dia : d))
      );
    } else {
      // Agregar un nuevo día
      setRutinaDias([...rutinaDias, dia]);
    }
    setModalOpen(false);
    setSelectedDia(null);
  };

  const handleEditDia = (dia: any) => {
    setSelectedDia(dia); // Día seleccionado para editar
    setModalOpen(true);
  };

  const handleDeleteDay = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/rutina-dias/${id}`);
      setRutinaDias(rutinaDias.filter((dia) => dia.id !== id));
    } catch (error) {
      console.error("Error al borrar el día:", error);
    }
  };

  const handleSubmit = async () => {
    const rutinaData = {
      id: rutina?.id,
      nombre,
      rutinaDias: rutinaDias.map((dia) => ({
        ...dia,
        rutinaEjercicios: dia.rutinaEjercicios.map((ejercicio: any) => ({
          ...ejercicio,
          rutinaDiaId: dia.id,
        })),
      })),
    };

    try {
      const response = rutina?.id
        ? await axios.put(`http://localhost:8080/rutinas/${rutina.id}`, rutinaData)
        : await axios.post("http://localhost:8080/rutinas", rutinaData);

      onSave(response.data);
    } catch (error) {
      console.error("Error al guardar la rutina:", error);
    }
  };

  return (
    <div className="p-4 bg-dark text-light">
      <h2 className="text-xl font-bold mb-4">
        {rutina ? "Editar Rutina" : "Crear Rutina"}
      </h2>
      <div className="mb-3">
        <input
          className="form-control bg-secondary text-light"
          placeholder="Nombre de la rutina"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          setSelectedDia(null); // Crear un nuevo día
          setModalOpen(true);
        }}
      >
        {rutina ? "Actualizar Días" : "Agregar Días"}
      </button>

      <ul className="list-group mb-3">
        {rutinaDias.map((dia) => (
          <li key={dia.id} className="list-group-item bg-secondary text-light">
            <div className="d-flex justify-content-between align-items-center">
              <span>{dia.nombre}</span>
              <div>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditDia(dia)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteDay(dia.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <button className="btn btn-success" onClick={handleSubmit}>
        {rutina ? "Actualizar Rutina" : "Guardar Rutina"}
      </button>

      {isModalOpen && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedDia ? "Editar Día" : "Agregar Día"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <RutinaDiaForm
                  onSave={handleSaveDia}
                  ejercicios={ejercicios}
                  dia={selectedDia} // Pasar el día seleccionado para editar
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RutinaForm;