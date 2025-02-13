import useDatos from "../services/useDatos";

const EjercicioList = () => {

    const { ejercicios, fetchEjercicios } = useDatos();
    return (
        <div>
            <h1 className="list-title">Lista de Ejercicios</h1>
            {ejercicios.length === 0 ? (
                <p>No hay clientes disponibles</p>
            ) : (
                <ul>
                    {ejercicios.map((ejercicio) => (
                        <li className="list-item" key={ejercicio.id}>
                            <span>{ejercicio.nombre}</span>
                        </li>
                    ))}
                </ul>
            )}
            <button className="refresh-button"
                onClick={fetchEjercicios}>Refrescar Ejercicios</button>
        </div>
    );
}

export default EjercicioList;