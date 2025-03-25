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
  return `https://www.youtube.com/embed/${videoID}?autoplay=1&loop=1&playlist=${videoID}`; // Asegura que el video se repita
};

const transformYouTubeShortsLink = (link: string) => {
  const videoID = link.split("/")[4]; // Extrae el ID del short
  return `https://www.youtube.com/embed/${videoID}?autoplay=1&loop=1&playlist=${videoID}`; // Asegura que el video se repita
};

const transformInstagramReelLink = (link: string) => {
  const postID = link.split("/")[4]; // Extrae el ID del post
  return `https://www.instagram.com/p/${postID}/embed/`; // Reels no pueden ir en loop, pero los dejamos repetidamente accesibles
};

const EjercicioView: React.FC<EjercicioViewProps> = ({ ejercicio, onClose }) => {
  if (!ejercicio) return null;

  // Función para determinar el tipo de video y su correspondiente URL de incrustación
  const getEmbeddedVideoLink = (link: string) => {
    if (link.includes("youtube.com")) {
      // Si es un video normal de YouTube
      if (link.includes("shorts")) {
        // Si es un YouTube Short
        return transformYouTubeShortsLink(link);
      } else {
        // Video regular de YouTube
        return transformYouTubeLink(link);
      }
    } else if (link.includes("instagram.com")) {
      // Si es un Reel de Instagram
      return transformInstagramReelLink(link);
    }
    return ""; // Si no es un link reconocido
  };

  // Función para determinar los estilos del iframe según el tipo de video
  const getIframeStyles = (link: string) => {
    if (link.includes("shorts") || link.includes("instagram.com")) {
      return {
        width: "100%",
        height: "400px",  // Ajustar la altura para videos verticales
        maxWidth: "300px", // Ajustar el ancho para videos verticales
        margin: "0 auto",  // Centrar el iframe
        borderRadius: "8px", // Bordes redondeados
      };
    } else {
      return {
        width: "100%",
        height: "200px",  // Tamaño predeterminado para videos horizontales
      };
    }
  };

  return (
    <div
      className="modal show"
      style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="card" style={{ width: "21rem" }}>
              <div className="card-img-top">
                <iframe
                  style={getIframeStyles(ejercicio.video)}  // Estilos dinámicos
                  src={getEmbeddedVideoLink(ejercicio.video)}
                  title={ejercicio.nombre}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="card-body">
                <h5 className="card-title">{ejercicio.nombre}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EjercicioView;