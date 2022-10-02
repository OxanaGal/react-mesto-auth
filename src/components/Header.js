import { Switch, Route, Link, } from "react-router-dom";

function Header({ email, onSignOut }) {
  return (
    <>
      <header className="header">
        <div className="header__logo"></div>
        <Switch>
        <Route exact path="/sign-in">
            <Link to="sign-up" className="header__link shaded">
              Регистрация
            </Link>
          </Route>
          <Route exact path="/sign-up">
            <Link to="sign-in" className="header__link shaded">
              Войти
            </Link>
          </Route>
          <Route exact path="/">
            <div className="header__user-info">
              <p className="header__user-email">{email}</p>
              <Link to='sign-in' className="header__link shaded" onClick={onSignOut}>Выйти</Link>
            </div>
          </Route>
        </Switch>
      </header>
    </>
  )
}

export default Header;
