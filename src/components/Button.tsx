import {
  IonButton,
} from '@ionic/react';
import './Button.scss';

interface ButtonProps {
  label: string;
  type?: string;
  large?: boolean;
  disabled?: boolean;
  onClick: (ev: any) => void;
}

const Button: React.FC<ButtonProps> = ({
  label,
  type = 'primary',
  large = false,
  disabled = false,
  onClick,
}) => {

  return (
    <IonButton
      onClick={(e) => onClick(e)}
      className={'app-button ' + type + ' ' + (large ? 'large' : '')}
      disabled={disabled}
    >
      {label}
    </IonButton>
  );
};

export default Button;
