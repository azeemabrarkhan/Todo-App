import Button from "../button/button";

type ButtonPropsType = {
  onSubmit: (email: string, password: string) => void;
  submitButtonText: string;
};

const Form = ({ onSubmit, submitButtonText }: ButtonPropsType) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const form = e.currentTarget;
    const elements = form.elements as typeof form.elements & {
      email: HTMLInputElement;
      password: HTMLInputElement;
    };

    const email = elements.email.value;
    const password = elements.password.value;

    onSubmit(email, password);
  };

  return (
    <form className="container" onSubmit={(e) => handleSubmit(e)}>
      <div className="row">
        <div className="column column-50 column-offset-25">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" placeholder="your.email@example.com" required />
        </div>
      </div>

      <div className="row">
        <div className="column column-50 column-offset-25">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" placeholder="your password" required />
        </div>
      </div>

      <div className="row">
        <div className="column column-50 column-offset-25" style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button type="submit" text={submitButtonText} />
        </div>
      </div>
    </form>
  );
};

export default Form;
