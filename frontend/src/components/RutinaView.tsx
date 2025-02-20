import React, { useState } from "react";
import EjercicioView from "./EjercicioView";

interface Ejercicio {
  id: number;
  nombre: string;
  video: string;
}

interface RutinaEjercicio {
  id: number;
  reps: number;
  sets: number;
  ejercicio: Ejercicio;
}

interface RutinaDia {
  id: number;
  nombre: string;
  rutinaEjercicios: RutinaEjercicio[];
}

interface Rutina {
  id: number;
  nombre: string;
  cliente?: any;
  rutinaDias?: any[];
}

const RutinaView: React.FC<{ rutina: Rutina; onClose: () => void }> = ({ rutina, onClose }) => {
  const [showDiaModal, setShowDiaModal] = useState<boolean>(false);
  const [showEjercicioModal, setShowEjercicioModal] = useState<boolean>(false);
  const [selectedDia, setSelectedDia] = useState<RutinaDia | null>(null);
  const [selectedEjercicio, setSelectedEjercicio] = useState<RutinaEjercicio | null>(null);

  const handleCloseDiaModal = () => setShowDiaModal(false);
  const handleShowDiaModal = (dia: RutinaDia) => {
    setSelectedDia(dia);
    setShowDiaModal(true);
  };

  const handleCloseEjercicioModal = () => setShowEjercicioModal(false);
  const handleShowEjercicioModal = (ejercicio: RutinaEjercicio) => {
    setSelectedEjercicio(ejercicio);
    setShowEjercicioModal(true);
  };

  return (
    <>
      <div className="modal show" style={{ display: "block" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <h5>{rutina.nombre}</h5>
              {rutina?.rutinaDias?.map((dia) => (
                <div key={dia.id}>
                  <button className="btn btn-link" onClick={() => handleShowDiaModal(dia)}>
                    {dia.nombre}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de RutinaDia */}
      {showDiaModal && selectedDia && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="btn-close" onClick={handleCloseDiaModal}></button>
              </div>
              <div className="modal-body">
                <h5>{selectedDia.nombre}</h5>
                {selectedDia.rutinaEjercicios.map((rutinaEjercicio) => (
                  <div key={rutinaEjercicio.id}>
                    <button
                      className="btn btn-link"
                      onClick={() => handleShowEjercicioModal(rutinaEjercicio)}
                    >
                      {rutinaEjercicio.ejercicio.nombre} - {rutinaEjercicio.reps} reps - {rutinaEjercicio.sets} sets
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de EjercicioView */}
      {selectedEjercicio && showEjercicioModal && (
        <EjercicioView ejercicio={selectedEjercicio.ejercicio} onClose={handleCloseEjercicioModal} />
      )}
    </>
  );
};

export default RutinaView;