import * as React from 'react';
import ErrorLabel from './ErrorLabel';
import './TextField.scss';

type Props = {
  className?: string;
  type?: string;
  id: string;
  placeholder: string;
  errorText?: string;
  invalid?: boolean;
  onChange?(ev: React.ChangeEvent<HTMLInputElement>): void;
  value?: string;
};

type State = {
  animation: string;
};

class TextField extends React.Component<Props, State> {
  #prevValue: string = '';

  constructor(props: Props | Readonly<Props>) {
    super(props);
    this.state = {
      animation: '',
    };
  }

  onInputFocus() {
    this.setState({ animation: '_maximizing' });
  }

  onInputBlur(ev: React.FocusEvent<HTMLInputElement>) {
    const { target: { value } } = ev;

    if (value === '') {
      this.setState({ animation: '_minimizing' });
    }
  }

  render(): JSX.Element {
    const {
      id, type, placeholder, className, onChange, value, errorText, invalid,
    } = this.props;
    let { animation } = this.state;

    if (value === '' && this.#prevValue !== '' && animation === '_maximizing') {
      animation = '_minimizing';
    }

    this.#prevValue = value;

    return (
      <div className={className ? `textfield ${className}` : 'textfield'}>
        <div className="textfield__floating">
          <input
            className="textfield__input"
            onFocus={() => this.onInputFocus()}
            onBlur={(e) => this.onInputBlur(e)}
            {...{
              onChange, id, type, value, placeholder,
            }}
          />
          <label htmlFor={id}>{placeholder}</label>
          <div className="textfield__border"><div className={`textfield__border_animated${animation ? ` textfield__border${animation}` : ''}`} /></div>
        </div>
        { errorText && <ErrorLabel invalid={invalid}>{errorText}</ErrorLabel>}
      </div>
    );
  }
}
export default TextField;
