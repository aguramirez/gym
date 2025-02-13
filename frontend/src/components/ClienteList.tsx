import useDatos from "../services/useDatos";
import "./ClienteList.css"; // Importa tu archivo CSS

const ClienteList = () => {
    const { clientes, fetchClientes } = useDatos();

    return (
        <div className="list-container">
            <h1 className="list-title">Lista de Clientes</h1>
            {clientes.length === 0 ? (
                <p>No hay clientes disponibles</p>
            ) : (
                <ul>
                    {clientes.map((cliente) => (
                        <li className="list-item" key={cliente.id}>
                            <span>{cliente.nombre}</span>
                        </li>
                    ))}
                </ul>
            )}
            <button className="refresh-button" onClick={fetchClientes}>
                Refrescar Clientes
            </button>
        </div>
    );
};

export default ClienteList;