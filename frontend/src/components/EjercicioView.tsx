import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import './EjercicioView.css'

interface Ejercicio {
  id: number;
  nombre: string;
  video: string;
}

interface EjercicioViewProps {
  ejercicio: Ejercicio;
  onClose: () => void;
  onEdit?: () => void;
}

const EjercicioView: React.FC<EjercicioViewProps> = ({ ejercicio, onClose, onEdit }) => {
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState<boolean>(true);
  
  // Función para detectar tipo de video basado en la URL
  const getVideoType = (url: string | undefined): 'youtube' | 'youtube-shorts' | 'instagram' | 'unknown' => {
    if (!url) return 'unknown';
    
    if (url.includes("youtube.com/watch")) return 'youtube';
    if (url.includes("youtube.com/shorts") || url.includes("youtu.be/")) return 'youtube-shorts';
    if (url.includes("instagram.com/")) return 'instagram';
    
    return 'unknown';
  };

  // Función para formatear enlaces de video
  const getEmbedUrl = (url: string | undefined): string => {
    if (!url) return "";
    
    // YouTube normal
    if (url.includes("youtube.com/watch")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // YouTube Shorts o enlaces acortados de YouTube
    if (url.includes("youtube.com/shorts") || url.includes("youtu.be/")) {
      let videoId;
      if (url.includes("youtube.com/shorts")) {
        videoId = url.split("/shorts/")[1]?.split("?")[0];
      } else {
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      }
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Instagram Reels / Posts
    if (url.includes("instagram.com/")) {
      // Cambiar a versión mejorada para Instagram que funcione
      if (url.includes("/p/") || url.includes("/reel/")) {
        // Extraer el ID del post o reel
        let id;
        if (url.includes("/p/")) {
          id = url.split("/p/")[1]?.split("/")[0];
        } else {
          id = url.split("/reel/")[1]?.split("/")[0];
        }
        
        // URL de incrustación corregida
        if (id) {
          // Para Instagram, vamos a ofrecer un enlace en su lugar
          // ya que la incrustación puede ser problemática
          return url;
        }
      }
    }
    
    return url; // Si no se reconoce ningún patrón, devolver la URL original
  };

  // Tipo de video actual
  const videoType = getVideoType(ejercicio.video);
  const embedUrl = getEmbedUrl(ejercicio.video);
  const isInstagram = videoType === 'instagram';
  const isVertical = videoType === 'youtube-shorts' || videoType === 'instagram';

  // Manejador para errores de carga de iframe
  const handleIframeError = () => {
    setVideoError(true);
    setIsVideoLoading(false);
  };

  // Manejador para cuando el iframe carga correctamente
  const handleIframeLoad = () => {
    setIsVideoLoading(false);
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
            <a 
              href={ejercicio.video} 
              target="_blank" 
              rel="noopener noreferrer"
              className="video-link"
            >
              {ejercicio.video.length > 50 
                ? ejercicio.video.substring(0, 50) + '...' 
                : ejercicio.video}
              <FaExternalLinkAlt size={12} style={{ marginLeft: '4px' }} />
            </a>
          </div>
        )}
      </div>
      
      {ejercicio.video ? (
        <div className={`video-container ${isVertical ? 'vertical' : 'horizontal'}`}>
          {isVideoLoading && (
            <div className="video-loading">
              <div className="spinner"></div>
              <p>Cargando video...</p>
            </div>
          )}
          
          {isInstagram ? (
            // Para Instagram mostramos un mensaje y un botón para abrir en lugar de un iframe
            <div className="instagram-message">
              <p>Para ver este reel de Instagram, por favor haz clic en el botón de abajo:</p>
              <a 
                href={ejercicio.video} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-accent"
              >
                Ver en Instagram <FaExternalLinkAlt size={12} />
              </a>
            </div>
          ) : videoError ? (
            // Si hay error al cargar el iframe
            <div className="video-error">
              <p>No se pudo cargar el video.</p>
              <a 
                href={ejercicio.video} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-accent"
              >
                Ver en el sitio original <FaExternalLinkAlt size={12} />
              </a>
            </div>
          ) : (
            // Mostramos el iframe normal para YouTube
            <iframe
              className={isVertical ? 'vertical-video' : 'horizontal-video'}
              src={embedUrl}
              title={ejercicio.nombre}
              allowFullScreen
              loading="lazy"
              onError={handleIframeError}
              onLoad={handleIframeLoad}
            ></iframe>
          )}
        </div>
      ) : (
        <div className="no-video">
          <p>No hay video disponible para este ejercicio</p>
        </div>
      )}
      
      {/* {onEdit && (
        <div className="modal-actions">
          <button 
            className="btn-primary"
            onClick={onEdit}
          >
            <FaEdit /> Editar Ejercicio
          </button>
        </div>
      )} */}
    </div>
  );
};

export default EjercicioView;