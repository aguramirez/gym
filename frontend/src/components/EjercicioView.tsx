import React from "react";

interface EjercicioViewProps {
  ejercicio: {
    id: number;
    nombre: string;
    video: string;
  } | null;
  onClose: () => void;
}

const transformYouTubeLink = (link: string) => {
    const videoID = link.split("v=")[1]?.split("&")[0]; // Extrae el ID del video
    return `https://www.youtube.com/embed/${videoID}`;
  };

const EjercicioView: React.FC<EjercicioViewProps> = ({ ejercicio, onClose }) => {
  if (!ejercicio) return null;

  return (
    <div
      className="modal show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            {/* <h5 className="modal-title">{ejercicio.nombre}</h5> */}
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="card" style={{ width: "21rem" }}>
              <div className="card-img-top">
                <iframe
                  width="100%"
                  height="200"
                  src={transformYouTubeLink(ejercicio.video)}
                  title={ejercicio.nombre}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="card-body">
                <h5 className="card-title">{ejercicio.nombre}</h5>
                {/* <p className="card-text">
                  Este es el video asociado al ejercicio.
                </p>
                <button className="btn btn-primary" onClick={onClose}>
                  Cerrar
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EjercicioView;