import { IonButton } from '@ionic/react';
import './Button.scss';

interface ButtonProps {
  className?: string;
  label: string;
  type?: string;
  large?: boolean;
  disabled?: boolean;
  onClick: (ev: any) => void;
}

const Button: React.FC<ButtonProps> = ({
  className,
  label,
  type = 'primary',
  large = false,
  disabled = false,
  onClick,
}) => {
  function getClassName() {
    const classNames = ['app-button'];
    if (type) {
      classNames.push(type);
    }
    if (large) {
      classNames.push('large');
    }
    if (className) {
      classNames.push(className);
    }
    return classNames.join(' ');
  }

  return (
    <IonButton onClick={e => onClick(e)} className={getClassName()} disabled={disabled}>
      {label}
    </IonButton>
  );
};

export default Button;
