import axios from "axios";
import { useState } from "react";
import useDatos from "../services/useDatos";
import EjercicioForm, { NuevoEjercicio } from "./EjercicioForm";
import { FaTrash, FaEdit } from 'react-icons/fa';
import { CgAddR } from "react-icons/cg";
import { LuRefreshCcw } from "react-icons/lu";

const EjercicioList = () => {
    const { ejercicios, fetchEjercicios } = useDatos();
    const [showModal, setShowModal] = useState(false);
    const [editingEjercicio, setEditingEjercicio] = useState<NuevoEjercicio | null>(null);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleDelete = async (id?: number) => {
        try {
            await axios.delete(`http://localhost:8080/ejercicios/${id}`);
            fetchEjercicios(); // Refrescar la lista de ejercicios
        } catch (error) {
            console.error("Error al eliminar el ejercicio:", error);
        }
    };

    const handleEdit = (ejercicio: NuevoEjercicio) => {
        setEditingEjercicio(ejercicio);
        setShowModal(true); // Abrir modal de edición
    };

    const onSaveEjercicio = (nuevoEjercicio: NuevoEjercicio) => {
        // Si hay un ejercicio en edición, actualizamos, si no, es nuevo
        if (editingEjercicio) {
            // Actualización de ejercicio
            axios.put(`http://localhost:8080/ejercicios/${editingEjercicio.id}`, nuevoEjercicio)
                .then(() => {
                    fetchEjercicios(); // Refrescar lista
                    handleCloseModal(); // Cerrar modal
                })
                .catch((error) => console.error("Error al actualizar ejercicio:", error));
        } else {
            // Creación de nuevo ejercicio
            axios.post("http://localhost:8080/ejercicios", nuevoEjercicio)
                .then(() => {
                    fetchEjercicios(); // Refrescar lista
                    handleCloseModal(); // Cerrar modal
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
            {/* Modal */}
            {showModal && (
                <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{editingEjercicio ? "Editar Ejercicio" : "Nuevo Ejercicio"}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <EjercicioForm
                                    onSave={onSaveEjercicio} // Pasar la función para guardar el ejercicio
                                    initialData={editingEjercicio} // Pasar datos iniciales si estamos editando
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
                                    <td>{ejercicio.nombre}</td>
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
        </>
    );
}

export default EjercicioList;