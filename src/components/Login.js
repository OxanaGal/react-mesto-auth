import { useState } from "react";

function Login({onLogin}) {

  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setpassword(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onLogin(email, password);
  }
  return (
    <>
      <section className="auth">
        <h2 className="auth__title">Вход</h2>
        <form className="auth__form" onSubmit={handleSubmit}>
          <input
            onChange={handleEmailChange}
            className="auth__form-input"
            placeholder="Email"
            name="email"
            type="email"
            required
            value={email || ""}
            autoComplete="off"
          ></input>
          <input
            onChange={handlePasswordChange}
            className="auth__form-input"
            placeholder="Пароль"
            name="password"
            type="password"
            required
            value={password || ""}
            autoComplete="off"
          ></input>

          <button className="auth__btn auth__btn_action_save" type="submit">
            Войти
          </button>
        </form>
      </section>
    </>
  );
}

export default Login;
