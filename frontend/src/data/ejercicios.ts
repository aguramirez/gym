// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import RutinaDiaForm from "./RutinaDiaForm";
// import useDatos from "../services/useDatos";

// type RutinaFormProps = {
//   onSave: (rutina: { id?: number; nombre: string; rutinaDias: any[] }) => void;
//   rutina?: { id?: number; nombre: string; rutinaDias: any[] } | null;
// };

// const RutinaForm: React.FC<RutinaFormProps> = ({ onSave, rutina }) => {
//   const { ejercicios } = useDatos();
//   const [nombre, setNombre] = useState("");
//   const [rutinaDias, setRutinaDias] = useState<any[]>([]);
//   const [isModalOpen, setModalOpen] = useState(false);

//   // Inicializar datos si se está editando una rutina
//   useEffect(() => {
//     if (rutina) {
//       setNombre(rutina.nombre || "");
//       setRutinaDias(rutina.rutinaDias || []);
//     }
//   }, [rutina]);

//   const handleAddDia = (dia: any) => {
//     setRutinaDias([...rutinaDias, dia]);
//     setModalOpen(false);
//   };

//   const handleSubmit = async () => {
//     const rutinaData = {
//       id: rutina?.id, // Si es una rutina existente, incluye su ID
//       nombre,
//       rutinaDias: rutinaDias.map((dia) => ({
//         ...dia,
//         rutinaEjercicios: dia.rutinaEjercicios.map((ejercicio: any) => ({
//           ...ejercicio,
//           rutinaDiaId: dia.id, // Asegurar referencia
//         })),
//       })),
//     };

//     console.log("JSON enviado:", JSON.stringify(rutinaData, null, 2));
//     try {
//       const response = rutina?.id
//         ? await axios.put(`http://localhost:8080/rutinas/${rutina.id}`, rutinaData)
//         : await axios.post("http://localhost:8080/rutinas", rutinaData);

//       console.log("Respuesta del backend:", response.data);
//       onSave(response.data);
//     } catch (error) {
//       console.error("Error al guardar la rutina:", error);
//     }
//   };

//   return (
//     <div className="p-4 bg-dark text-light">
//       <h2 className="text-xl font-bold mb-4">
//         {rutina ? "Editar Rutina" : "Crear Rutina"}
//       </h2>
//       <div className="mb-3">
//         <input
//           className="form-control bg-secondary text-light"
//           placeholder="Nombre de la rutina"
//           value={nombre}
//           onChange={(e) => setNombre(e.target.value)}
//         />
//       </div>
//       <button
//         className="btn btn-primary mb-3"
//         onClick={() => setModalOpen(true)}
//       >
//         {rutina ? "Actualizar Días" : "Agregar Días"}
//       </button>

//       <ul className="list-group mb-3">
//         {rutinaDias.map((dia, index) => (
//           <li key={index} className="list-group-item bg-secondary text-light">
//             {dia.nombre}
//           </li>
//         ))}
//       </ul>

//       <button className="btn btn-success" onClick={handleSubmit}>
//         {rutina ? "Actualizar Rutina" : "Guardar Rutina"}
//       </button>

//       {isModalOpen && (
//         <div
//           className="modal show"
//           style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
//         >
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Agregar Día</h5>
//                 <button
//                   type="button"
//                   className="btn-close"
//                   onClick={() => setModalOpen(false)}
//                 ></button>
//               </div>
//               <div className="modal-body">
//                 <RutinaDiaForm onSave={handleAddDia} ejercicios={ejercicios} />
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RutinaForm;