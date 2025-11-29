import { RegisterForm } from '../RegisterForm';
import '../css/ContainerForm.css'

export const ShowRegister = ({ handleUserCreated, setShowRegister }) => {
  return (
    <section className='container__form'>
      <RegisterForm onUserCreated={handleUserCreated} />
      <p className="txt__account">
        ¿Ya tenés cuenta?{" "}
        <button className="btn__show" onClick={() => setShowRegister(false)}>
          Iniciar Sesión
        </button>
      </p>
    </section>
  );
};
