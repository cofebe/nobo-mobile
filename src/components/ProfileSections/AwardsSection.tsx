import { IonContent, IonItem } from "@ionic/react";
import "./AwardsSection.css";
import { useHistory } from "react-router-dom";

interface AwardsSectionProps {
  data: { title: string };
  className: string;
  awardsString: any;
  myProfile: boolean;
  userId: number;
}

export interface Award {
  award: string;
  description: string;
}

const AwardsSection: React.FC<AwardsSectionProps> = ({
  data,
  userId,
  className,
  awardsString,
  myProfile,
}) => {
  console.log("Awards: ", awardsString);
  const history = useHistory();
  let awards: any[] = [];
  let showAward = false;

  awardsString.forEach((a: string) => {
    if (a === "") return;
    let award: Award = JSON.parse(a);

    if (
      award.award !== undefined &&
      award.award !== "" &&
      award.description !== undefined &&
      award.description !== ""
    ) {
      showAward = true;
      awards.push(
        <IonItem lines="none" className="urp-section-item" detail={false}>
          <div className="urp-section-item-label">{award.award}</div>
          <div>{award.description}</div>
        </IonItem>
      );
    }
  });

  if (!showAward && myProfile) {
    awards.push(
      <div className="urp-highlight-add-media-container urp-highlight-add-media-container">
        <p className="urp-highlight-add-media-title">
          Uh! Looks like you haven’t added any awards to your account yet
        </p>
        <p
          className="urp-highlight-add-media-text"
          onClick={(e) => {
            e.preventDefault();
            history.push(`edit-athlete/${userId}`);
          }}
        >
          Add Awards
        </p>
      </div>
    );
  }

  if (!showAward && !myProfile) {
    awards.push(
      <div className="urp-highlight-add-media-container">
        <p className="urp-highlight-add-media-title">
          Uh! Looks like the user hasn't added any awards yet
        </p>
      </div>
    );
  }

  return <div className={className + " urp-awards-section"}><IonContent>{awards}</IonContent></div>;
};

export default AwardsSection;
