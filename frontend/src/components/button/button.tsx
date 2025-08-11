import styles from "./button.module.css";

type ButtonPropsType = {
  onClick: () => void;
  isDisabled?: boolean;
  text?: string;
};

export const Button = ({ onClick, isDisabled, text }: ButtonPropsType) => {
  return (
    <div className={styles["button-container"]}>
      <button className={styles.button} onClick={onClick} disabled={isDisabled}>
        {text && <div className={styles.content}>{text}</div>}
      </button>
    </div>
  );
};
