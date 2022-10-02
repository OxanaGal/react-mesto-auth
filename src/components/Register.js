import { useState } from "react";
import { Link } from "react-router-dom";

function Register({onRegister}) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }

  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onRegister(email, password);
  }
  return (
    <section className="auth">
      <h2 className="auth__title">Регистрация</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__form-input"
          placeholder="Email"
          name="email"
          type="email"
          required
          value={email || ""}
          onChange={handleEmailChange}
          autoComplete="off"
          ></input>
        <input
          className="auth__form-input"
          placeholder="Пароль"
          name="password"
          type="password"
          required
          value={password || ""}
          onChange={handlePasswordChange}
          autoComplete="off"
          ></input>

        <button className="auth__btn auth__btn_action_save" type="submit">
          Зарегистрироваться
        </button>
        <div className="auth__signup">
          <p className="auth__signup-text">Уже зарегистрированы?</p>
          <Link to="sign-in" className="auth__signup-text auth__signup-link shaded">
            Войти
          </Link>
        </div>

      </form>
    </section>
  );
}

export default Register;
