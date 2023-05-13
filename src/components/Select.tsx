import React, { useRef, useEffect, useState } from 'react';
import { IonButton, IonModal, IonItem, IonList, IonLabel, IonIcon } from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import './Select.css';

interface SelectOption {
 value?: string;
 label: string;
}

interface SelectProps {
 options: SelectOption[];
 className?: string;
 value?: string[] | string;
 placeholder?: string;
 multiple?: boolean;
 disabled?: boolean;
 border?: boolean;
 onChange?: (val: string[]) => void;
}

const Select: React.FC<SelectProps> = ({
 className,
 options,
 placeholder,
 value,
 multiple,
 disabled,
 border,
 onChange,
}) => {
 const initialValues = value
  ? getSelectedOptions(Array.isArray(value) ? value : [value].filter(v => v), options)
  : [];
 const [internalSelected, setInternalSelected] = useState<SelectOption[]>(initialValues);
 const [internalSelectedString, setInternalSelectedValue] = useState<string>(
  getSelectedStringValue(initialValues)
 );

 useEffect(() => {
  const initialValues = value
   ? getSelectedOptions(Array.isArray(value) ? value : [value].filter(v => v), options)
   : [];
  setInternalSelected(initialValues);
  setInternalSelectedValue(getSelectedStringValue(initialValues));
 }, [value, options]);

 const modal = useRef<HTMLIonModalElement>(null);

 function getSelectedOptions(values: string[], options: SelectOption[]): SelectOption[] {
  const ret = values
   .map(v => options?.find(o => (o.value || o.label) === v))
   .filter(v => v)
   .map(v => v!);
  return ret;
 }

 function getSelectedStringValue(vals: SelectOption[]) {
  if (!vals) {
   return '';
  }

  const stringVals = vals.map(v => v.label || v.value);
  stringVals.sort();
  return stringVals.join(', ');
 }

 function selectedIndex(option: SelectOption) {
  for (let i = 0, max = internalSelected.length; i < max; i++) {
   const o = internalSelected[i];
   if ((o.value || o.label) === (option.value || option.label)) {
    return i;
   }
  }

  return -1;
 }

 function isSelected(option: SelectOption) {
  const ret = selectedIndex(option) !== -1;
  return ret;
 }

 function close() {
  // console.log('close');
  modal.current?.dismiss();
  if (multiple) {
   setInternalSelectedValue(getSelectedStringValue(internalSelected));
   if (onChange) {
    onChange(internalSelected.map(v => v.value || v.label));
   }
  }
 }

 function cancel() {
  // console.log('cancel');
  modal.current?.dismiss();
 }

 function select(val: SelectOption) {
  // console.log('select', val);
  let newSelected: SelectOption[] = [];

  if (!multiple) {
   newSelected.push(val);
  } else {
   const index = selectedIndex(val);
   if (index === -1) {
    newSelected = [...internalSelected, val];
   } else {
    internalSelected.splice(index, 1);
    newSelected = [...internalSelected];
   }
  }

  setInternalSelected(newSelected);
  if (!multiple) {
   modal.current?.dismiss();
   setInternalSelectedValue(getSelectedStringValue(newSelected));
   if (onChange) {
    onChange([val.value || val.label]);
   }
  }
 }

 function open() {
  if (!disabled) {
   modal.current?.present();
  }
 }

 return (
  <div
   className={
    'nobo-select' +
    (disabled ? ' nobo-select-disabled' : '') +
    (border ? ' nobo-select-border' : '') +
    (className ? ' ' + className : '')
   }
  >
   <div className="nobo-select-container" onClick={e => open()}>
    <div
     className={'nobo-select-label' + (internalSelectedString ? '' : ' nobo-select-label-empty')}
    >
     {internalSelectedString ? internalSelectedString : placeholder || 'Select Option'}
    </div>
    <div className="nobo-select-chevron">
     <img src="assets/images/arrow-down-filled.svg" alt="down" />
    </div>
   </div>
   <IonModal ref={modal} id="nobo-select-modal">
    <div className="wrapper">
     <IonList lines="none">
      {options &&
       options?.map(o => (
        <IonItem
         key={o.value || o.label}
         button={true}
         detail={false}
         onClick={() => select(o)}
         className={isSelected(o) ? 'nobo-select-selected' : ''}
        >
         <IonLabel>{o.label || o.value}</IonLabel>
         <IonIcon icon={checkmarkOutline}></IonIcon>
        </IonItem>
       ))}
     </IonList>
    </div>
    {multiple ? (
     <div className="nobo-select-button-container">
      <IonButton className="nobo-select-button-select" onClick={e => close()}>
       Select
      </IonButton>
     </div>
    ) : (
     ''
    )}
    <div className="nobo-select-button-container">
     <IonButton className="nobo-select-button-cancel" onClick={e => cancel()}>
      Cancel
     </IonButton>
    </div>
   </IonModal>
  </div>
 );
};

export default Select;
