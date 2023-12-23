import { useState } from 'react';
import { IonTextarea } from '@ionic/react';
import './Textarea.scss';

interface InputProps {
  className?: string;
  rows?: number;
  placeholder?: string;
  value?: string;
  onChange: (val: string) => void;
  maxlength?: number,
  disabled?: boolean;
  readonly?: boolean;
  invalid?: boolean;
  required?: boolean;
  autocapitalize?: string;
  spellcheck?: boolean;
  autoGrow?: boolean;
  errorMessage?: string;
}

const Textarea: React.FC<InputProps> = ({
  className = '',
  rows = 3,
  placeholder = '',
  value = '',
  onChange,
  maxlength,
  disabled = false,
  readonly = false,
  required = false,
  invalid = false,
  autocapitalize = '',
  spellcheck = false,
  autoGrow = false,
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
    <div
      className={
        'app-textarea-container ' +
        (invalid || errorMessage || (required && isDirty && !internalValue) ? 'invalid' : '')
      }
    >
      <IonTextarea
        className={className}
        placeholder={placeholder}
        value={value}
        rows={rows}
        onIonChange={e => change(e)}
        disabled={disabled}
        readonly={readonly}
        required={required}
        autocapitalize={autocapitalize}
        spellcheck={spellcheck}
        autoGrow={autoGrow}
        maxlength={maxlength}
      />
      {errorMessage ? <div className="error-message">{errorMessage}</div> : ''}
    </div>
  );
};

export default Textarea;
