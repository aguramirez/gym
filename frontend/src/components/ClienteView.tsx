import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FaSignOutAlt, FaUser, FaDumbbell, FaAngleDown, FaAngleUp, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import authService from "../services/authService";
import "./clienteView.css";

// Tipos de datos
interface Ejercicio {
    id: number;
    nombre: string;
    video?: string;
}

interface ClienteRutinaEjercicio {
    id: number;
    reps: number;
    sets: number;
    notas?: string;
    ejercicioId: number;
    ejercicioNombre: string;
    ejercicioVideo?: string;
}

interface ClienteRutinaDia {
    id: number;
    nombre: string;
    clienteRutinaEjercicios: ClienteRutinaEjercicio[];
}

interface ClienteRutina {
    id: number;
    nombre: string;
    rutinaId: number;
    clienteRutinaDias: ClienteRutinaDia[];
}

interface Cliente {
    id: number;
    nombre: string;
    dni: string;
    telefono: string;
}

const ClienteView = () => {
    const { id } = useParams<{ id: string }>();
    const clienteId = Number(id);
    const navigate = useNavigate();

    // Estados
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [clienteRutinas, setClienteRutinas] = useState<ClienteRutina[]>([]);
    const [selectedRutina, setSelectedRutina] = useState<ClienteRutina | null>(null);
    const [expandedDias, setExpandedDias] = useState<Record<number, boolean>>({});
    const [expandedEjercicios, setExpandedEjercicios] = useState<Record<number, boolean>>({});
    const [editingEjercicio, setEditingEjercicio] = useState<number | null>(null);
    const [notasText, setNotasText] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Función para extraer el valor de las notas
    const extractNotasText = (notasValue: string | undefined): string => {
        if (!notasValue) return "";

        // Comprobar si las notas están en formato JSON
        if (notasValue.trim().startsWith('{') && notasValue.includes('"notas":')) {
            try {
                // Intentar parsear el JSON
                const notasObj = JSON.parse(notasValue);
                if (notasObj && notasObj.notas !== undefined) {
                    return notasObj.notas;
                }
            } catch (e) {
                console.warn("Error al parsear notas JSON:", e);
            }
        }

        // Si no es JSON o hay error, devolver el texto tal cual
        return notasValue;
    };

    // Función para mostrar las notas (usada en la interfaz)
    const displayNotas = (ejercicio: ClienteRutinaEjercicio) => {
        return extractNotasText(ejercicio.notas);
    };

    // Verificar autenticación y obtener el usuario actual
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            navigate("/");
            return;
        }

        // Asegurar que el usuario solo puede ver su propio perfil
        if (clienteId !== currentUser.clienteId && currentUser.rol !== "ADMIN" && currentUser.rol !== "TRAINER") {
            navigate(`/cliente/${currentUser.clienteId}`);
        }
    }, [clienteId, navigate]);

    // Obtener datos del cliente
    useEffect(() => {
        const fetchClienteData = async () => {
            if (isNaN(clienteId)) {
                setError("ID de cliente inválido");
                setIsLoading(false);
                return;
            }
            
            try {
                setIsLoading(true);
                // Modificar esta línea para incluir el token en el header manualmente
                const response = await axios.get<Cliente>(
                    `http://localhost:8080/clientes/${clienteId}`,
                    {
                        headers: {
                            'Authorization': authService.getToken()
                        }
                    }
                );
                setCliente(response.data);
                setError(null);
            } catch (err: any) {
                console.error("Error al obtener datos del cliente:", err);
                setError("No se pudo cargar la información del cliente");
            } finally {
                setIsLoading(false);
            }
        };

        fetchClienteData();
    }, [clienteId]);

    // Obtener rutinas del cliente
    useEffect(() => {
        const fetchRutinasCliente = async () => {
            if (isNaN(clienteId)) return;
            
            try {
                setIsLoading(true);
                const response = await axios.get<ClienteRutina[]>(
                    `http://localhost:8080/cliente-rutinas/rutinas`,
                    { 
                        params: { clienteId },
                        headers: {
                            'Authorization': authService.getToken()
                        }
                    }
                );
                
                if (Array.isArray(response.data)) {
                    setClienteRutinas(response.data);
                    
                    // Si hay rutinas y no hay una seleccionada, seleccionar la primera
                    if (response.data.length > 0 && !selectedRutina) {
                        setSelectedRutina(response.data[0]);
                    }
                    
                    setError(null);
                } else {
                    console.warn("No se encontraron rutinas");
                    setClienteRutinas([]);
                }
            } catch (err: any) {
                console.error("Error al obtener rutinas del cliente:", err);
                setError("No se pudieron cargar las rutinas");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRutinasCliente();
    }, [clienteId]);

    // Manejar el cierre de sesión
    const handleLogout = () => {
        authService.logout();
        navigate("/");
    };

    // Funciones para el acordeón
    const toggleDia = (diaId: number) => {
        setExpandedDias(prev => ({
            ...prev,
            [diaId]: !prev[diaId]
        }));
    };

    const toggleEjercicio = (ejercicioId: number) => {
        setExpandedEjercicios(prev => ({
            ...prev,
            [ejercicioId]: !prev[ejercicioId]
        }));
    };

    // Cambiar de rutina
    const handleSelectRutina = (rutina: ClienteRutina) => {
        setSelectedRutina(rutina);
        setExpandedDias({});
        setExpandedEjercicios({});
        setEditingEjercicio(null);
    };

    // Iniciar edición de notas
    const handleEditNotas = (ejercicio: ClienteRutinaEjercicio) => {
        setEditingEjercicio(ejercicio.id);
        setNotasText(extractNotasText(ejercicio.notas));
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setEditingEjercicio(null);
    };

    // Guardar notas
    const handleSaveNotas = async (ejercicioId: number) => {
        if (isSaving) return;

        setIsSaving(true);
        try {
            await axios.put(
                `http://localhost:8080/cliente-rutinas/ejercicios/${ejercicioId}/notas`,
                { notas: notasText },
                {
                    headers: {
                        'Authorization': authService.getToken()
                    }
                }
            );

            // Actualizar estado local
            setClienteRutinas(prevRutinas =>
                prevRutinas.map(rutina => ({
                    ...rutina,
                    clienteRutinaDias: rutina.clienteRutinaDias.map(dia => ({
                        ...dia,
                        clienteRutinaEjercicios: dia.clienteRutinaEjercicios.map(ejercicio =>
                            ejercicio.id === ejercicioId
                                ? { ...ejercicio, notas: notasText }
                                : ejercicio
                        )
                    }))
                }))
            );

            // Si la rutina actual tiene el ejercicio actualizado, actualizarlo también
            if (selectedRutina) {
                setSelectedRutina(prevRutina => {
                    if (!prevRutina) return null;

                    return {
                        ...prevRutina,
                        clienteRutinaDias: prevRutina.clienteRutinaDias.map(dia => ({
                            ...dia,
                            clienteRutinaEjercicios: dia.clienteRutinaEjercicios.map(ejercicio =>
                                ejercicio.id === ejercicioId
                                    ? { ...ejercicio, notas: notasText }
                                    : ejercicio
                            )
                        }))
                    };
                });
            }

            setEditingEjercicio(null);
        } catch (error) {
            console.error("Error al guardar notas:", error);
            alert("No se pudieron guardar las notas. Inténtelo de nuevo.");
        } finally {
            setIsSaving(false);
        }
    };

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

    // Componente de carga
    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="spinner-wrapper">
                    <BiLoaderAlt className="spinner-icon" />
                </div>
                <p>Cargando...</p>
            </div>
        );
    }

    // Componente de error
    if (error) {
        return (
            <div className="error-container">
                <div className="error-icon">❌</div>
                <h3>Error</h3>
                <p>{error}</p>
                <button className="btn-primary" onClick={handleLogout}>
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="cliente-view-container">
            {/* Header */}
            <header className="cliente-header">
                <div className="user-info">
                    <FaUser className="user-icon" />
                    <h2>{cliente?.nombre || "Usuario"}</h2>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                    <FaSignOutAlt /> Cerrar Sesión
                </button>
            </header>

            {/* Contenido principal */}
            <div className="cliente-content">
                {/* Sidebar con rutinas */}
                <div className="rutinas-sidebar">
                    <h3>Mis Rutinas</h3>

                    {clienteRutinas.length === 0 ? (
                        <div className="no-rutinas">
                            <p>No tienes rutinas asignadas</p>
                            <small>Contacta a tu entrenador para que te asigne una rutina</small>
                        </div>
                    ) : (
                        <ul className="rutinas-list">
                            {clienteRutinas.map(rutina => (
                                <li
                                    key={rutina.id}
                                    className={`rutina-item ${selectedRutina?.id === rutina.id ? 'active' : ''}`}
                                    onClick={() => handleSelectRutina(rutina)}
                                >
                                    <FaDumbbell className="rutina-icon" />
                                    <span>{rutina.nombre}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Contenido principal - rutina seleccionada */}
                <div className="rutina-content">
                    {selectedRutina ? (
                        <div className="rutina-detail">
                            <h2 className="rutina-title">{selectedRutina.nombre}</h2>

                            {/* Acordeón de días */}
                            <div className="accordion">
                                {selectedRutina.clienteRutinaDias.map(dia => (
                                    <div key={dia.id} className="accordion-item">
                                        {/* Cabecera del día */}
                                        <div
                                            className={`accordion-header ${expandedDias[dia.id] ? 'active' : ''}`}
                                            onClick={() => toggleDia(dia.id)}
                                        >
                                            <h3>{dia.nombre}</h3>
                                            <span className="ejercicio-count">
                                                {dia.clienteRutinaEjercicios.length} ejercicios
                                            </span>
                                            {expandedDias[dia.id] ? <FaAngleUp /> : <FaAngleDown />}
                                        </div>

                                        {/* Contenido del día (ejercicios) */}
                                        {expandedDias[dia.id] && (
                                            <div className="accordion-content">
                                                {dia.clienteRutinaEjercicios.map(ejercicio => (
                                                    <div key={ejercicio.id} className="ejercicio-item">
                                                        {/* Cabecera del ejercicio */}
                                                        <div
                                                            className={`ejercicio-header ${expandedEjercicios[ejercicio.id] ? 'active' : ''}`}
                                                            onClick={() => toggleEjercicio(ejercicio.id)}
                                                        >
                                                            <h4>{ejercicio.ejercicioNombre}</h4>
                                                            <div className="ejercicio-meta">
                                                                <span>{ejercicio.sets} series</span>
                                                                <span>{ejercicio.reps} repeticiones</span>
                                                                {expandedEjercicios[ejercicio.id] ? <FaAngleUp /> : <FaAngleDown />}
                                                            </div>
                                                        </div>

                                                        {/* Contenido del ejercicio */}
                                                        {expandedEjercicios[ejercicio.id] && (
                                                            <div className="ejercicio-content">
                                                                {/* Video */}
                                                                {ejercicio.ejercicioVideo && (
                                                                    <div className="video-container">
                                                                        <iframe
                                                                            src={getEmbedUrl(ejercicio.ejercicioVideo)}
                                                                            title={ejercicio.ejercicioNombre}
                                                                            allowFullScreen
                                                                            frameBorder="0"
                                                                            loading="lazy"
                                                                        ></iframe>
                                                                    </div>
                                                                )}

                                                                {/* Notas */}
                                                                <div className="notas-section">
                                                                    <div className="notas-header">
                                                                        <h5>Mis Notas:</h5>

                                                                        {editingEjercicio !== ejercicio.id && (
                                                                            <button
                                                                                className="edit-button"
                                                                                onClick={() => handleEditNotas(ejercicio)}
                                                                            >
                                                                                <FaEdit /> Editar
                                                                            </button>
                                                                        )}
                                                                    </div>

                                                                    {editingEjercicio === ejercicio.id ? (
                                                                        <div className="notas-editor">
                                                                            <textarea
                                                                                value={notasText}
                                                                                onChange={(e) => setNotasText(e.target.value)}
                                                                                placeholder="Añade notas sobre pesos, sensaciones, progreso..."
                                                                            />
                                                                            <div className="editor-buttons">
                                                                                <button
                                                                                    className="save-button"
                                                                                    onClick={() => handleSaveNotas(ejercicio.id)}
                                                                                    disabled={isSaving}
                                                                                >
                                                                                    {isSaving ? (
                                                                                        <BiLoaderAlt className="spinner-icon small" />
                                                                                    ) : (
                                                                                        <FaSave />
                                                                                    )}
                                                                                    Guardar
                                                                                </button>
                                                                                <button
                                                                                    className="cancel-button"
                                                                                    onClick={handleCancelEdit}
                                                                                >
                                                                                    <FaTimes /> Cancelar
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="notas-content">
                                                                            {ejercicio.notas ? (
                                                                                <p>{displayNotas(ejercicio)}</p>
                                                                            ) : (
                                                                                <p className="no-notes">
                                                                                    No hay notas para este ejercicio.
                                                                                    Haz clic en "Editar" para añadir.
                                                                                </p>
                                                                            )}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="empty-state">
                            <FaDumbbell className="empty-icon" />
                            <h3>No hay rutinas seleccionadas</h3>
                            <p>Selecciona una rutina del menú lateral para ver sus detalles</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClienteView;