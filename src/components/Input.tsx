import { useState } from 'react';
import { IonInput } from '@ionic/react';
import { TextFieldTypes } from '@ionic/core';
import './Input.scss';

interface InputProps {
 className?: string;
 placeholder?: string;
 value?: string;
 onChange: (val: string) => void;
 disabled?: boolean;
 readonly?: boolean;
 invalid?: boolean;
 required?: boolean;
 small?: boolean;
 errorMessage?: string;
 type?: TextFieldTypes;
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
 small = false,
 errorMessage,
 type = 'text',
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
    'app-input-container ' +
    (invalid || errorMessage || (required && isDirty && !internalValue) ? 'invalid' : '') +
    (small ? ' small' : '')
   }
  >
   <IonInput
    className={className}
    placeholder={placeholder}
    value={value}
    onIonChange={e => change(e)}
    disabled={disabled}
    readonly={readonly}
    required={required}
    type={type}
   />
   {errorMessage ? <div className="error-message">{errorMessage}</div> : ''}
  </div>
 );
};

export default Input;
