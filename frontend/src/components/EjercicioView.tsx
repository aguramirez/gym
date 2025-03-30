import React from "react";
import { FaEdit } from "react-icons/fa";

interface Ejercicio {
  id: number;
  nombre: string;
  video: string;
}

interface EjercicioViewProps {
  ejercicio: Ejercicio;
  onClose: () => void;
  onEdit: () => void;
}

const EjercicioView: React.FC<EjercicioViewProps> = ({ ejercicio, onClose, onEdit }) => {
  // Función para formatear enlaces de video
  const getEmbedUrl = (url: string | undefined) => {
    if (!url) return "";
    
    // YouTube normal
    if (url.includes("youtube.com/watch")) {
        const videoId = url.split("v=")[1]?.split("&")[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // YouTube Shorts
    if (url.includes("youtube.com/shorts")) {
        const videoId = url.split("/shorts/")[1]?.split("?")[0];
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Instagram Reels / Posts (necesita incluir /embed/ en la URL)
    if (url.includes("instagram.com/")) {
        if (url.includes("/p/") || url.includes("/reel/")) {
            const parts = url.split("/");
            const id = parts[parts.indexOf("p") + 1] || parts[parts.indexOf("reel") + 1];
            if (id) return `https://www.instagram.com/p/${id}/embed/`;
        }
    }
    
    return url; // Si no se reconoce ningún patrón, devolver la URL original
  };

  // Función para determinar los estilos del iframe según el tipo de video
  const getIframeStyles = (link: string) => {
    const isVertical = link.includes("shorts") || link.includes("instagram.com");
    return {
      width: "100%",
      height: isVertical ? "600px" : "400px",
      maxWidth: isVertical ? "380px" : "100%",
      margin: "0 auto",
      borderRadius: "8px",
      border: "1px solid #ddd",
      display: "block"
    };
  };

  return (
    <div className="ejercicio-details">
      <div className="ejercicio-info">
        <div className="info-row">
          <strong>Nombre:</strong>
          <span>{ejercicio.nombre}</span>
        </div>
        
        {ejercicio.video && (
          <div className="info-row">
            <strong>URL del video:</strong>
            <a href={ejercicio.video} target="_blank" rel="noopener noreferrer">
              {ejercicio.video}
            </a>
          </div>
        )}
      </div>
      
      {ejercicio.video ? (
        <div className="video-container">
          <iframe
            style={getIframeStyles(ejercicio.video)}
            src={getEmbedUrl(ejercicio.video)}
            title={ejercicio.nombre}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      ) : (
        <div className="no-video">
          <p>No hay video disponible para este ejercicio</p>
        </div>
      )}
      
      <div className="modal-actions">
        <button 
          className="btn-primary"
          onClick={onEdit}
        >
          <FaEdit /> Editar Ejercicio
        </button>
      </div>
    </div>
  );
};

export default EjercicioView;