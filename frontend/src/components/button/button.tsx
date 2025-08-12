type ButtonPropsType = {
  onClick?: () => void;
  isDisabled?: boolean;
  text?: string;
  type?: "button" | "submit" | "reset";
  isSecondary?: boolean;
};

const Button = ({ onClick, isDisabled, text, type, isSecondary }: ButtonPropsType) => {
  return (
    <div>
      <button
        className={`button ${isSecondary ? "secondary" : ""}`}
        onClick={onClick}
        disabled={isDisabled}
        type={type || "button"}
      >
        {text}
      </button>
    </div>
  );
};

export default Button;
