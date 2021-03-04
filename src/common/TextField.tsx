import * as React from 'react';
import { addTextFieldAction, setAnimationAction } from '../redux/actions/textFieldActions';
import { TextFieldState } from '../redux/reducers/textFieldReducer';
import ErrorLabel from './ErrorLabel';
import './TextField.scss';

interface DispatchProps {
  addTextField: typeof addTextFieldAction;
  setAnimation: typeof setAnimationAction;
}

type OwnProps = {
  className?: string;
  type?: string;
  id: string;
  placeholder: string;
  errorText?: string;
  invalid?: boolean;
  onChange?(ev: React.ChangeEvent<HTMLInputElement>): void;
  value?: string;
};

type Props = TextFieldState & OwnProps & DispatchProps;

class TextField extends React.Component<Props> {
  #prevValue: string = '';

  constructor(props: Props | Readonly<Props>) {
    super(props);

    props.addTextField(props.id);
  }

  onInputFocus = () => {
    this.setState({ animation: '_maximizing' });
  };

  onInputBlur = (ev: React.FocusEvent<HTMLInputElement>) => {
    const { target: { value } } = ev;

    if (value === '') {
      this.setState({ animation: '_minimizing' });
    }
  };

  render(): JSX.Element {
    const {
      id, type, placeholder, className, onChange, value, errorText, invalid,
    } = this.props;
    let { animation } = this.props;

    if (value === '' && this.#prevValue !== '' && animation === '_maximizing') {
      animation = '_minimizing';
    }

    this.#prevValue = value;

    return (
      <div
        className={className ? `textfield ${className}` : 'textfield'}
      >
        <div className="textfield__floating">
          <input
            className="textfield__input"
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            onChange={onChange}
            id={id}
            type={type}
            value={value}
            placeholder={placeholder}
          />
          <label htmlFor={id}>
            {placeholder}
          </label>
          <div className="textfield__border">
            <div
              className={`textfield__border_animated${animation ? ` textfield__border${animation}` : ''}`}
            />
          </div>
        </div>
        { errorText && <ErrorLabel invalid={invalid}>{errorText}</ErrorLabel>}
      </div>
    );
  }
}
export default TextField;
