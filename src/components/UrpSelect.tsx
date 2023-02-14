import React, { useRef, useEffect, useState } from "react";
import {
  IonButton,
  IonModal,
  IonItem,
  IonList,
  IonLabel,
  IonIcon,
} from "@ionic/react";
import { checkmarkOutline, chevronDownOutline } from "ionicons/icons";
import "./UrpSelect.css";

interface UrpSelectOption {
  value?: string;
  label: string;
}

interface UrpSelectProps {
  options: UrpSelectOption[];
  className?: string;
  value?: string[] | string;
  placeholder?: string;
  multiple?: boolean;
  disabled?: boolean;
  border?: boolean;
  onChange?: (val: string[]) => void;
}

const UrpSelect: React.FC<UrpSelectProps> = ({
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
    ? getSelectedOptions(
        Array.isArray(value) ? value : [value].filter((v) => v),
        options
      )
    : [];
  const [internalSelected, setInternalSelected] =
    useState<UrpSelectOption[]>(initialValues);
  const [internalSelectedString, setInternalSelectedValue] = useState<string>(
    getSelectedStringValue(initialValues)
  );

  useEffect(() => {
    const initialValues = value
      ? getSelectedOptions(
          Array.isArray(value) ? value : [value].filter((v) => v),
          options
        )
      : [];
    setInternalSelected(initialValues);
    setInternalSelectedValue(getSelectedStringValue(initialValues));
  }, [value, options]);

  const modal = useRef<HTMLIonModalElement>(null);

  function getSelectedOptions(
    values: string[],
    options: UrpSelectOption[]
  ): UrpSelectOption[] {
    const ret = values
      .map((v) => options?.find((o) => (o.value || o.label) === v))
      .filter((v) => v)
      .map((v) => v!);
    return ret;
  }

  function getSelectedStringValue(vals: UrpSelectOption[]) {
    if (!vals) {
      return "";
    }

    const stringVals = vals.map((v) => v.label || v.value);
    stringVals.sort();
    return stringVals.join(", ");
  }

  function selectedIndex(option: UrpSelectOption) {
    for (let i = 0, max = internalSelected.length; i < max; i++) {
      const o = internalSelected[i];
      if ((o.value || o.label) === (option.value || option.label)) {
        return i;
      }
    }

    return -1;
  }

  function isSelected(option: UrpSelectOption) {
    const ret = selectedIndex(option) !== -1;
    return ret;
  }

  function close() {
    // console.log('close');
    modal.current?.dismiss();
    if (multiple) {
      setInternalSelectedValue(getSelectedStringValue(internalSelected));
      if (onChange) {
        onChange(internalSelected.map((v) => v.value || v.label));
      }
    }
  }

  function cancel() {
    // console.log('cancel');
    modal.current?.dismiss();
  }

  function select(val: UrpSelectOption) {
    // console.log('select', val);
    let newSelected: UrpSelectOption[] = [];

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
        "urp-select" +
        (disabled ? " urp-select-disabled" : "") +
        (border ? " urp-select-border" : "") +
        (className ? " " + className : "")
      }
    >
      <div className="urp-select-container" onClick={(e) => open()}>
        <div
          className={
            "urp-select-label" +
            (internalSelectedString ? "" : " urp-select-label-empty")
          }
        >
          {internalSelectedString
            ? internalSelectedString
            : placeholder || "Select Option"}
        </div>
        <div className="urp-select-chevron">
          <IonIcon icon={chevronDownOutline}></IonIcon>
        </div>
      </div>
      <IonModal ref={modal} id="urp-select-modal">
        <div className="wrapper">
          <IonList lines="none">
            {options &&
              options?.map((o) => (
                <IonItem
                  key={o.value || o.label}
                  button={true}
                  detail={false}
                  onClick={() => select(o)}
                  className={isSelected(o) ? "urp-select-selected" : ""}
                >
                  <IonLabel>{o.label || o.value}</IonLabel>
                  <IonIcon icon={checkmarkOutline}></IonIcon>
                </IonItem>
              ))}
          </IonList>
        </div>
        {multiple ? (
          <div className="urp-select-button-container">
            <IonButton
              className="urp-select-button-select"
              onClick={(e) => close()}
            >
              Select
            </IonButton>
          </div>
        ) : (
          ""
        )}
        <div className="urp-select-button-container">
          <IonButton
            className="urp-select-button-cancel"
            onClick={(e) => cancel()}
          >
            Cancel
          </IonButton>
        </div>
      </IonModal>
    </div>
  );
};

export default UrpSelect;
