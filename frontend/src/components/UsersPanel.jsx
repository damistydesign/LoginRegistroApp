import '../css/UsersPanel.css'

export const UsersPanel = ({ cerrarSesion, users }) => {
  return (
    <section className="main__panel">
      <header className="header__panel">
        <h1>Panel de Usuarios (Privado)</h1>
        <button onClick={cerrarSesion} className='btn__session' style={{ background: "red" }}>
          Cerrar Sesión
        </button>
      </header>

      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              <strong>{user.username}</strong> <small>({user.email})</small>
            </li>
          ))
        ) : (
          <p>Cargando usuarios o lista vacía...</p>
        )}
      </ul>
    </section>
  );
};
