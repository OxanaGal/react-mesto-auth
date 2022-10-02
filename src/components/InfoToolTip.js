import SuccessRegIcon from '../images/SuccessRegIcon.png';
import FailRegIcon from '../images/FailRegIcon.png';

function InfoToolTip({isOpen, isSuccess, onClose}) {
  return (
    <div
      className={`popup popup_view_tooltip ${isOpen ? "popup__opened" : ""}`}
    >
      <div className="popup__container">
        {isSuccess ? (
          <div className="tooltip">
            <img
              src={`${SuccessRegIcon}`}
              alt="Регистрация прошла успешно."
              className="tooltip__image"
            />
            <p className="tooltip__message">
              Вы успешно зарегистрировались!
            </p>
          </div>
        ) : (
          <div className="tooltip">
            <img
              src={`${FailRegIcon}`}
              alt="Регистрация не была выполнена."
              className="tooltip__image"
            />
            <p className="tooltip__message">
              Что-то пошло не так! Попробуйте ещё раз.
            </p>
          </div>
        )}

        <button type="button" className="popup__btn popup__btn_action_close shaded" onClick={onClose}></button>
      </div>
    </div>
  );
}

export default InfoToolTip;
