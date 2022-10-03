import SuccessRegIcon from '../images/SuccessRegIcon.png';
import FailRegIcon from '../images/FailRegIcon.png';

function InfoToolTip({ isOpen, isSuccess, onClose }) {
  return (
    // в прошлом спринте мы с одногруппниками обнаружили, что при использование такой записи
    //  ${isOpen && "popup__opened"}` в стили пападает false https://disk.yandex.ru/d/cu21oQQzgzFTsg
    // поэтому везде тернарники

    <div className={`popup popup_view_tooltip ${isOpen ? "popup__opened" : ""}`}>
      <div className="popup__container">
        <div className="tooltip">
          <img
            src={isSuccess ? `${SuccessRegIcon}` : `${FailRegIcon}`}
            alt={
              isSuccess
                ? "Регистрация прошла успешно."
                : "Регистрация не была выполнена."
            }
            className="tooltip__image"
          />
          <p className="tooltip__message">
            {isSuccess
              ? "Вы успешно зарегистрировались!"
              : "Что-то пошло не так! Попробуйте ещё раз."}
          </p>
        </div>

        <button type="button" className="popup__btn popup__btn_action_close shaded" onClick={onClose}></button>
      </div>
    </div >
  );
}

export default InfoToolTip;
