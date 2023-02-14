import { IonContent, IonItem } from '@ionic/react';
import './MeasurementsSection.css';
import { useHistory } from 'react-router-dom';

interface MeasurementsSectionProps {
  data: { title: string };
  className: string;
  measurementData?: MeasurementData;
  myProfile: boolean;
  userId: number;
}

export interface MeasurementData {
  wingspan?: string;
  vertical?: string;
  threeConeDrill?: string;
  squat?: string;
  shuttleTime?: string;
  fortyYardDash?: string;
  bench?: string;
  laneAgilityDrill?: string;
  shuttleRun?: string;
  threeForthsCourtSprint?: string;
  standingReach?: string;
  blockJump?: string;
  attackJump?: string;
  batSpeed?: string;
  armVelocity?: string;
  exitVelocity?: string;
  sixtyYardDash?: string;
  mileRun?: string;
  powerballToss?: string;
  shotSpeed?: string;
  tenYardSplit?: string;
}

const MeasurementsSection: React.FC<MeasurementsSectionProps> = ({
  data,
  userId,
  className,
  measurementData,
  myProfile,
}) => {
  console.log('MeasurementData: ', measurementData);
  const history = useHistory();
  let measurementsList = [];

  if (
    measurementData?.wingspan !== undefined &&
    measurementData?.wingspan !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Wingspan</div>
        <div>{measurementData?.wingspan}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.vertical !== undefined &&
    measurementData?.vertical !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Vertical</div>
        <div>{measurementData?.vertical}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.attackJump !== undefined &&
    measurementData?.attackJump !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Attack Jump</div>
        <div>{measurementData?.attackJump}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.powerballToss !== undefined &&
    measurementData?.powerballToss !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Powerball Toss</div>
        <div>{measurementData?.powerballToss}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.shotSpeed !== undefined &&
    measurementData?.shotSpeed !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Shot Speed</div>
        <div>{measurementData?.shotSpeed}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.tenYardSplit !== undefined &&
    measurementData?.tenYardSplit !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Ten Yard Split</div>
        <div>{measurementData?.tenYardSplit}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.blockJump !== undefined &&
    measurementData?.blockJump !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Block Jump</div>
        <div>{measurementData?.blockJump}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.standingReach !== undefined &&
    measurementData?.standingReach !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Standing Reach</div>
        <div>{measurementData?.standingReach}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.laneAgilityDrill !== undefined &&
    measurementData?.laneAgilityDrill !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Lane Agility Drill</div>
        <div>{measurementData?.laneAgilityDrill}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.shuttleRun !== undefined &&
    measurementData?.shuttleRun !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Shuttle Run</div>
        <div>{measurementData?.shuttleRun}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.threeForthsCourtSprint !== undefined &&
    measurementData?.threeForthsCourtSprint !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Three Fourths Court Sprint</div>
        <div>{measurementData?.threeForthsCourtSprint}</div>
      </IonItem>
    );
  }

  if (measurementData?.bench !== undefined && measurementData?.bench !== '') {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Bench</div>
        <div>{measurementData?.bench}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.armVelocity !== undefined &&
    measurementData?.armVelocity !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Arm Velocity</div>
        <div>{measurementData?.armVelocity}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.batSpeed !== undefined &&
    measurementData?.batSpeed !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Bat Speed</div>
        <div>{measurementData?.batSpeed}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.exitVelocity !== undefined &&
    measurementData?.exitVelocity !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Exit Velocity</div>
        <div>{measurementData?.exitVelocity}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.sixtyYardDash !== undefined &&
    measurementData?.sixtyYardDash !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Sixty Yard Dash</div>
        <div>{measurementData?.sixtyYardDash}</div>
      </IonItem>
    );
  }

  if (measurementData?.squat !== undefined && measurementData?.squat !== '') {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Squat</div>
        <div>{measurementData?.squat}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.mileRun !== undefined &&
    measurementData?.mileRun !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Mile Run</div>
        <div>{measurementData?.mileRun}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.fortyYardDash !== undefined &&
    measurementData?.fortyYardDash !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>40 Yd Dash</div>
        <div>{measurementData?.fortyYardDash}</div>
      </IonItem>
    );
  }

  if (measurementData === undefined && myProfile) {
    measurementsList.push(
      <div className="urp-highlight-add-media-container urp-highlight-add-media-container">
        <p className="urp-highlight-add-media-title">
          Uh! Looks like you haven’t added any measurements to your account yet
        </p>
        <p
          className="urp-highlight-add-media-text"
          onClick={(e) => {
            e.preventDefault();
            history.push(`edit-athlete/${userId}`);
          }}
        >
          Add Measurements
        </p>
      </div>
    );
  }

  if (
    measurementData?.shuttleTime !== undefined &&
    measurementData?.shuttleTime !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Shuttle Time</div>
        <div>{measurementData?.shuttleTime}</div>
      </IonItem>
    );
  }

  if (
    measurementData?.threeConeDrill !== undefined &&
    measurementData?.threeConeDrill !== ''
  ) {
    measurementsList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>3 Cone Drill</div>
        <div>{measurementData?.threeConeDrill}</div>
      </IonItem>
    );
  }

  if (measurementData === undefined && !myProfile) {
    measurementsList.push(
      <div className="urp-highlight-add-media-container">
        <p className="urp-highlight-add-media-title">
          Uh! Looks like the user hasn't added any measurements yet
        </p>
      </div>
    );
  }
  return (
    <div className={className}>
      <IonContent scrollY={true}>{measurementsList}</IonContent>
    </div>
  );
};

export default MeasurementsSection;
