import useDatos from '../services/useDatos'

function RutinaList() {

    const {rutinas, fetchRutinas} = useDatos();
  return (
    <div>
            <h1 className="list-title">Lista de Rutinas</h1>
            {rutinas.length === 0 ? (
                <p>No hay clientes disponibles</p>
            ) : (
                <ul>
                    {rutinas.map((rutina) => (
                        <li className="list-item" key={rutina.id}>
                            <span>{rutina.nombre}</span>
                        </li>
                    ))}
                </ul>
            )}
            <button className="refresh-button"
                onClick={fetchRutinas}>Refrescar Rutinas</button>
        </div>
  )
}

export default RutinaList