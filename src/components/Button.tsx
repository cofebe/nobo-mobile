import {
  IonButton,
} from '@ionic/react';
import './Button.scss';

interface ProfileFollowButtonProps {
  label: string;
  type?: string;
  large?: boolean;
  onClick: (ev: any) => void;
}

const Button: React.FC<ProfileFollowButtonProps> = ({
  label,
  type = 'primary',
  large = false,
  onClick,
}) => {

  return (
    <IonButton
      onClick={(e) => onClick(e)}
      className={'app-button ' + type + ' ' + (large ? 'large' : '')}
    >
      {label}
    </IonButton>
  );
};

export default Button;
