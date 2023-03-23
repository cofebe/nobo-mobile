import { useHistory } from 'react-router-dom';
import {
  IonHeader,
} from '@ionic/react';
import './Header.scss';

interface HeaderProps {
  showBackButton?: boolean;
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({
  showBackButton = true,
  title,
  subtitle,
  children,
}) => {
  const history = useHistory();

  return (
    <IonHeader className="page-header">
      {showBackButton && (
        <img
          src="assets/images/arrow-left.svg"
          className="back-arrow"
          alt="back"
          onClick={() => {
            history.goBack();
          }}
        />
      )}
      <div className="titles">
        {subtitle ? (
          <>
            <div className="subtitle">{subtitle}</div>
            <div className="title">{title}</div>
          </>
        ) : (
          <div className="title">{title}</div>
        )}
      </div>
      {children}
    </IonHeader>
  );
};

export default Header;
