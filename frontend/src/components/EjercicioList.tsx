import { useState } from "react";
import axios from "axios";
import useDatos from "../services/useDatos";
import EjercicioForm, { NuevoEjercicio } from "./EjercicioForm";
import EjercicioView from "./EjercicioView";
import { FaTrash, FaEdit } from "react-icons/fa";
import { CgAddR } from "react-icons/cg";
import { LuRefreshCcw } from "react-icons/lu";

const EjercicioList = () => {
  const { ejercicios, fetchEjercicios } = useDatos();
  const [showModal, setShowModal] = useState(false);
  const [editingEjercicio, setEditingEjercicio] = useState<NuevoEjercicio | null>(null);
  const [selectedEjercicio, setSelectedEjercicio] = useState<{
    id: number;
    nombre: string;
    video: string;
  } | null>(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleDelete = async (id?: number) => {
    try {
      await axios.delete(`http://localhost:8080/ejercicios/${id}`);
      fetchEjercicios();
    } catch (error) {
      console.error("Error al eliminar el ejercicio:", error);
    }
  };

  const handleEdit = (ejercicio: NuevoEjercicio) => {
    setEditingEjercicio(ejercicio);
    setShowModal(true);
  };

  const handleViewEjercicio = (ejercicio: { id: number; nombre: string; video: string }) => {
    setSelectedEjercicio(ejercicio);
  };

  const onSaveEjercicio = (nuevoEjercicio: NuevoEjercicio) => {
    if (editingEjercicio) {
      axios
        .put(`http://localhost:8080/ejercicios/${editingEjercicio.id}`, nuevoEjercicio)
        .then(() => {
          fetchEjercicios();
          handleCloseModal();
        })
        .catch((error) => console.error("Error al actualizar ejercicio:", error));
    } else {
      axios
        .post("http://localhost:8080/ejercicios", nuevoEjercicio)
        .then(() => {
          fetchEjercicios();
          handleCloseModal();
        })
        .catch((error) => console.error("Error al guardar el ejercicio:", error));
    }
  };

  return (
    <>
      <h1 className="list-title">Lista de Ejercicios</h1>
      <button className="btn btn-primary m-1" onClick={handleOpenModal}>
        <CgAddR />
      </button>
      <button className="btn btn-primary" onClick={fetchEjercicios}>
        <LuRefreshCcw />
      </button>
      {showModal && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingEjercicio ? "Editar Ejercicio" : "Nuevo Ejercicio"}
                </h5>
                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body">
                <EjercicioForm
                  onSave={onSaveEjercicio}
                  initialData={editingEjercicio}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="ejercicio-list-container">
        {ejercicios.length === 0 ? (
          <p>No hay ejercicios disponibles</p>
        ) : (
          <table className="table table-dark">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Editar</th>
                <th scope="col">Eliminar</th>
              </tr>
            </thead>
            <tbody>
              {ejercicios.map((ejercicio, index) => (
                <tr key={ejercicio.id}>
                  <th scope="row">{index + 1}</th>
                  <td>
                    <button
                      className="btn btn-link"
                      onClick={() =>
                        handleViewEjercicio({
                          id: ejercicio.id,
                          nombre: ejercicio.nombre,
                          video: ejercicio.video,
                        })
                      }
                    >
                      {ejercicio.nombre}
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEdit(ejercicio)}
                    >
                      <FaEdit />
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(ejercicio.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {selectedEjercicio && (
        <EjercicioView
          ejercicio={selectedEjercicio}
          onClose={() => setSelectedEjercicio(null)}
        />
      )}
    </>
  );
};

export default EjercicioList;