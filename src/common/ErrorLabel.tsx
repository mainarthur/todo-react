import * as React from 'react';
import './ErrorLabel.scss';

type Props = {
  invalid?: boolean;
  className?: string;
  htmlFor?: string;
};

class ErrorLabel extends React.PureComponent<Props> {
  render(): JSX.Element {
    const {
      invalid, className, htmlFor, children,
    } = this.props;
    return (
      <label
        htmlFor={htmlFor}
        className={`error-label${invalid ? ' error-label_visible' : ''}${className ? ` ${className}` : ''}`}
      >
        {children}
      </label>
    );
  }
}
export default ErrorLabel;
