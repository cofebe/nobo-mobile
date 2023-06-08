import { IonButton } from '@ionic/react';

interface ButtonProps {
  className?: string;
  labelOne: string;
  labelTwo: string;
  isToggled: boolean;
  onClick: (ev: any) => void;
}

const Toggle: React.FC<ButtonProps> = ({
  className,
  labelOne,
  labelTwo,
  onClick,
  isToggled,
}) => {
  function getClassName() {
    const classNames = ['app-button'];
    if (className) {
      classNames.push(className);
    }
    return classNames.join(' ');
  }

  return (
    <div className={getClassName()} onClick={e => onClick(e)} >
      <div className="toggle-switch-slider"></div>
      <span className={`toggle-switch-text ${isToggled ? 'off' : 'on'}`}>{labelOne}</span>
      <span className={`toggle-switch-text ${isToggled ? 'on' : 'off'}`}>{labelTwo}</span>
    </div>
  );
};

export default Toggle;
