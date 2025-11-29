import { LoginForm } from '../LoginForm';
import '../css/ContainerForm.css'

export const ShowLogin = ({ handleLoginSuccess, setShowRegister }) => {
  return (
    <section className='container__form'>
      <LoginForm onLoginSuccess={handleLoginSuccess} />
      <p className="txt__account">
        ¿No tenés cuenta?{" "}
        <button className="btn__show" onClick={() => setShowRegister(true)}>
          Registrate
        </button>
      </p>
    </section>
  );
};
