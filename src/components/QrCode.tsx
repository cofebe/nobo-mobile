//import {
//  IonSelect,
//  IonSelectOption
//} from '@ionic/react';
import QRCode from 'react-qr-code';
import './QrCode.css';

interface QrCodeProps {
  value: string;
  name: string;
}

const QrCode: React.FC<QrCodeProps> = ({ value, name }) => {
  console.log("QrCode: ", value)
  return (
      <div className="qr-code-container">
        <p> {name} </p>
        <div className="qr-code" >
          <QRCode height="20" value={value} />
        </div>
        <div className="nobo-float-logo qr-code-nobo-float-logo">
          <img
            src="assets/images/nobo_logo_withtagline.png"
            width="83px"
            height="47px"
            alt="logo with tagline"
          />
        </div>
      </div>
  );
};

export default QrCode;
