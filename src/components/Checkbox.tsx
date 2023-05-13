//import { useState } from 'react';
import './Checkbox.scss';

interface InputProps {
 className?: string;
 label?: string;
 value?: boolean;
 onChange: (val: boolean) => void;
 disabled?: boolean;
 readonly?: boolean;
 errorMessage?: string;
}

const Checkbox: React.FC<InputProps> = ({
 className = '',
 label = '',
 value = false,
 onChange,
 disabled = false,
 readonly = false,
 errorMessage,
}) => {
 function toggle() {
  onChange(!value);
 }

 return (
  <div className={'app-checkbox-container ' + (errorMessage ? 'invalid' : '')}>
   <div
    className="checkbox"
    onClick={e => {
     e.preventDefault();
     e.stopPropagation();
     toggle();
    }}
   >
    <div className="image">
     <img src={`assets/images/checkmark-${value ? 'checked' : 'unchecked'}.svg`} alt="checkbox" />
    </div>
    {label ? <div className="label">{label}</div> : ''}
   </div>
   <div className="error-message">{errorMessage}</div>
  </div>
 );
};

export default Checkbox;
