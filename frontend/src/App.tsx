
import './App.css'

function App() {

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Inicio</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Saludos</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">ja</a>
              </li>
              <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container bg-secondary my-5 p-5">
        <div className="mb-3">
          <label htmlFor="exampleFormControlInput1" className="form-label">Usuario</label>
          <input
            type="text"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="DNI"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">Clave</label>
          <input
            type="password"
            className="form-control"
            id="exampleFormControlInput1"
            placeholder="******"
          />
        </div>
      </div>
    </>
  )
}

export default App
