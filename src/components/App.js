import { useEffect, useState } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { api } from '../utils/Api';
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import ConfirmationPopup from './ConfirmationPopup';
import { Route, Switch, useHistory, Redirect } from "react-router-dom";
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import InfoToolTip from './InfoToolTip';
import * as auth from '../utils/auth';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [isComfirmationPopupOpen, setIsConfirmationPopupOpen] = useState(false);

  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  // и таки useHistory нет 6 версии
  //const navigate = useNavigate();
  const history = useHistory();
  const [isInfoToolTipPopupOpen, setInfoToolTipPopupOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    console.log(isLoggedIn)
    if(isLoggedIn){
      setIsLoading(true);
    Promise.all([api.getUserInfo(), api.getInitialCards()])
      .then(([user, cards]) => {
        setCurrentUser(user);
        setCards(cards);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      })
    }
  }, [isLoggedIn])

  useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    //проверим существует ли токен в хранилище браузера localStorage
    if (jwt) {
      auth
        .checkToken(jwt)
        .then((res) => {
          setIsLoggedIn(true)
          setEmail(res.data.email)
          //navigate("/");
          history.push("/")
        })
        .catch((err) => {
          if (err.status === 400) {
            console.log("400 — Токен не передан или передан не в том формате");
          } else if (err.status === 401) {
            console.log("401 — Переданный токен некорректен");
          }
        });
    }
  }, [history]);

  const handleEditProfileClick = () => {
    setIsEditProfilePopupOpen(!isEditProfilePopupOpen)
  }

  const handleAddPlaceClick = () => {
    setIsAddPlacePopupOpen(!isAddPlacePopupOpen)
  }

  const handleEditAvatarClick = () => {
    setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen)
  }

  const handleDeleteCardClick = (card) => {
    setSelectedCard(card);
    setIsConfirmationPopupOpen(!isComfirmationPopupOpen);
  }

  const handleCardClick = (card) => {
    setSelectedCard(card)
    setIsImagePopupOpen(!isImagePopupOpen);
  }

  const closeAllPopups = () => {
    setIsEditProfilePopupOpen(false)
    setIsAddPlacePopupOpen(false)
    setIsEditAvatarPopupOpen(false)
    setIsImagePopupOpen(false)
    setIsConfirmationPopupOpen(false)
    setInfoToolTipPopupOpen(false)
  }

  const isOpen = isEditAvatarPopupOpen || isEditProfilePopupOpen || isAddPlacePopupOpen || selectedCard.isOpen || isComfirmationPopupOpen || isInfoToolTipPopupOpen

  useEffect(() => {
    function handleEscClose(event) {
      if (event.key === 'Escape') {
        closeAllPopups();
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscClose);
      return () => {
        document.removeEventListener('keydown', handleEscClose);
      }
    }
  }, [isOpen]);

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api.toggleLike(card._id, !isLiked)
      .then((newCard) => {
        const newCards = cards.map((c) => (c._id === card._id ? newCard : c));
        setCards(newCards);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleDeleteCard() {

    api.deleteCard(selectedCard._id)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== selectedCard._id));
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(data) {
    setIsLoading(true);
    api.patchUserProfile(data)
      .then((res) => {
        setCurrentUser(res);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleUpdateAvatar(avatar) {
    setIsLoading(true);
    api.patchUserAvatar(avatar)
      .then((res) => {
        console.log(res)
        setCurrentUser(res);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleAddPlaceSubmit(card) {
    setIsLoading(true);
    api.postNewCard(card)
      .then((res) => {
        setCards([res, ...cards]);
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(err))
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleRegisterSubmit(email, password) {
    auth
      .register(email, password)
      .then(() => {
        setInfoToolTipPopupOpen(true);
        setIsSuccess(true);
        //navigate("/sign-in");
        history.push("/sign-in")
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - некорректно заполнено одно из полей");
        }
        setInfoToolTipPopupOpen(true);
        setIsSuccess(false);
      });
  }

  function handleLoginSubmit(email, password) {
    auth
      .login(email, password)
      .then((res) => {
        localStorage.setItem("jwt", res.token)
        setIsLoggedIn(true)
        setEmail(email)
        //navigate("/")
        history.push("/")
      })
      .catch((err) => {
        if (err.status === 400) {
          console.log("400 - не передано одно из полей");
        } else if (err.status === 401) {
          console.log("401 - пользователь с email не найден");
        }
        setInfoToolTipPopupOpen(true);
        setIsSuccess(false);
      });
  }

  function handleSignOut() {
    localStorage.removeItem("jwt")
    setIsLoggedIn(false)
    //navigate("/sign-in")
    history.push("/sign-in")
  }

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>
        <Header email={email} onSignOut={handleSignOut} />


        <Switch>
          <ProtectedRoute
            exact
            path="/"
            isLoggedIn={isLoggedIn}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDeleteClick={handleDeleteCardClick}
            cards={cards}
            component={Main}
            isLoading={isLoading}
          />
          <Route path="/sign-in">
            <Login onLogin={handleLoginSubmit} />
          </Route>
          <Route path="/sign-up">
            <Register onRegister={handleRegisterSubmit} />
          </Route>
          <Route>
            {isLoggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
          </Route>
        </Switch>

        {/* <Routes> долго мучала 6 роут (」°ロ°)」 потом ещё помучаю, пока оставлю тут
        Но я его добью  ( ╯°□°)╯ ┻━━┻
          <Route path="/" element={<Header email={email} onSignOut={handleSignOut} />}>
          <Route
            index
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn} >
                <Main
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onEditAvatar={handleEditAvatarClick}
                  onCardClick={handleCardClick}
                  onCardLike={handleCardLike}
                  onCardDeleteClick={handleDeleteCardClick}
                  cards={cards}
                />
              </ProtectedRoute>
            }
          />
          <Route path="sign-in" element={<Login onLogin={handleLoginSubmit} />} />

          <Route path="sign-up" element={<Register onRegister={handleRegisterSubmit} />} />

          <Route element={isLoggedIn ? <Navigate to="/" /> : <Navigate to="/sign-in" />} />
        </Route>

          <Route path='*' element={<NotFound />}></Route>
        </Routes> */ }

        {isLoggedIn && <Footer />}

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} isLoading={isLoading} />
        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} isLoading={isLoading} />
        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} isLoading={isLoading} />
        <ConfirmationPopup isOpen={isComfirmationPopupOpen} onClose={closeAllPopups} onCardDelete={handleDeleteCard} isLoading={isLoading} />
        <InfoToolTip isOpen={isInfoToolTipPopupOpen} onClose={closeAllPopups} isSuccess={isSuccess} />

        <ImagePopup name="image-preview" card={selectedCard} isOpen={isImagePopupOpen} onClose={closeAllPopups} />
      </CurrentUserContext.Provider>
    </div >
  );
}

export default App;
