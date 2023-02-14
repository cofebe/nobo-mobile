import { IonContent, IonItem } from "@ionic/react";
import "./AcademicsSection.css";
import { useHistory } from "react-router-dom";

interface AcademicsSectionProps {
  data: { title: string };
  className: string;
  academicData?: AcademicData;
  myProfile: boolean;
  userId: number;
}

export interface AcademicData {
  gpa?: string;
  sat?: string;
  act?: string;
  extracurriculars?: string[];
  transcript?: string;
}

const AcademicsSection: React.FC<AcademicsSectionProps> = ({
  data,
  userId,
  className,
  academicData,
  myProfile,
}) => {
  const history = useHistory();

  const academicList = [];

  if (academicData?.gpa !== "") {
    academicList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>GPA</div>
        <div>{academicData?.gpa}</div>
      </IonItem>
    );
  }

  if (academicData?.sat !== "") {
    academicList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>SAT Score</div>
        <div>{academicData?.sat}</div>
      </IonItem>
    );
  }

  if (academicData?.act !== "") {
    academicList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>ACT Score</div>
        <div>{academicData?.act}</div>
      </IonItem>
    );
  }

  if (academicData?.extracurriculars !== []) {
    academicData?.extracurriculars?.forEach((ec) => {
      if (ec !== "") {
        academicList.push(
          <IonItem lines="none" className="urp-section-item urp-academics-item" detail={false}>
            <div>Extracurricular</div>
            <div>{ec}</div>
          </IonItem>
        );
      }
    });
  }

  if (academicData?.transcript === "uploaded") {
    academicList.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>Transcripts</div>
        <div>Checked</div>
      </IonItem>
    );
  }

  if (myProfile && academicList.length === 0) {
    academicList.push(
      <div className="urp-highlight-add-media-container urp-highlight-add-media-container">
        <p className="urp-highlight-add-media-title">
          Uh! Looks like you haven’t added any academics to your account yet
        </p>
        <p
          className="urp-highlight-add-media-text"
          onClick={(e) => {
            e.preventDefault();
            history.push(`edit-athlete/${userId}`);
          }}
        >
          Add Academics
        </p>
      </div>
    );
  }

  if (!myProfile && academicList.length === 0) {
    academicList.push(
      <div className="urp-highlight-add-media-container">
        <p className="urp-highlight-add-media-title">
          Uh! Looks like the user hasn't added any academics yet
        </p>
      </div>
    );
  }

  return <div className={className}>
    <IonContent>{academicList}</IonContent></div>;
};

export default AcademicsSection;
