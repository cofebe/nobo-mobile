import { useState } from 'react';
import {
  IonInput,
} from '@ionic/react';
import './Input.scss';

interface InputProps {
  className?: string;
  placeholder?: string;
  value?: string;
  //onBlur?: () => void;
  //onFocus?: () => void;
  onChange: (val: string) => void;
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  className = '',
  placeholder = '',
  value = '',
  onChange,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  errorMessage,
}) => {
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState<string>('');

  function change(ev: any) {
    const val = ev.detail.value || '';
    onChange(val);
    setInternalValue(val);
    setIsDirty(true);
  }

  return (
    <div className={'app-input-container ' + (invalid || errorMessage || (required && isDirty && !internalValue) ? 'invalid' : '')}>
      <IonInput
        className={className}
        placeholder={placeholder}
        value={value}
        onIonChange={(e) => change(e)}
        disabled={disabled}
        readonly={readonly}
        required={required}
      />
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : ''}
    </div>
  );
};

export default Input;
