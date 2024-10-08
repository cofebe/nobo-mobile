import React, { useRef, useEffect, useState } from 'react';
import { IonButton, IonModal, IonItem, IonList, IonLabel, IonIcon } from '@ionic/react';
import { checkmarkOutline } from 'ionicons/icons';
import './Select.css';

export interface SelectOption {
  value?: any;
  label: string;
}

interface SelectOptionInternal {
  selected: boolean;
  value: any;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  className?: string;
  value?: any[] | any;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  border?: boolean;
  onChange?: (val: any[]) => void;
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
  const [internalOptions, setInternalOptions] = useState<SelectOptionInternal[]>([]);
  const [internalSelectedString, setInternalSelectedValue] = useState<string>('');

  useEffect(() => {
    let selectedString: string[] = [];
    const internalOptions = options.map(o => {
      let selected = false;
      if (value) {
        if (Array.isArray(value)) {
          selected = !!value.find(v => v === o.value);
        } else {
          selected = value == o.value;
        }
      }
      const soi = {
        label: o.label,
        value: o.value === undefined ? o.label : o.value,
        selected,
      };
      if (selected) {
        selectedString.push(o.label);
      }
      return soi;
    });
    setInternalOptions(internalOptions);
    setInternalSelectedValue(selectedString.join(', '));
    //console.log('options', options, 'value', value, 'internalOptions', internalOptions);
  }, [value, options]);

  const modal = useRef<HTMLIonModalElement>(null);

  function close() {
    // console.log('close');
    modal.current?.dismiss();
    if (multiple) {
      if (onChange) {
        onChange(internalOptions.filter(o => !!o.selected).map(o => o.value));
      }
    }
  }

  function cancel() {
    // console.log('cancel');
    modal.current?.dismiss();
  }

  function select(val: SelectOptionInternal) {
    console.log('select', val);

    if (!multiple) {
      for (const option of internalOptions) {
        option.selected = false;
      }
    }
    val.selected = !val.selected;
    setInternalOptions(internalOptions);

    if (!multiple) {
      modal.current?.dismiss();
      if (onChange) {
        onChange(internalOptions.filter(o => !!o.selected).map(o => o.value));
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
          className={
            'nobo-select-label' + (internalSelectedString ? '' : ' nobo-select-label-empty')
          }
        >
          {internalSelectedString || placeholder || 'Select Option'}
        </div>
        <div className="nobo-select-chevron">
          <img src="assets/images/arrow-down-filled.svg" alt="down" />
        </div>
      </div>
      <IonModal ref={modal} id="nobo-select-modal">
        <div className="wrapper">
          <IonList lines="none">
            {internalOptions?.map(o => (
              <IonItem
                key={o.label}
                button={true}
                detail={false}
                onClick={() => select(o)}
                className={!!o.selected ? 'nobo-select-selected' : ''}
              >
                <IonLabel>{o.label}</IonLabel>
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
