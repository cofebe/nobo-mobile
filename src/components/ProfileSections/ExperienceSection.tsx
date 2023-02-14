import { IonContent, IonItem } from "@ionic/react";
import "./ExperienceSection.css";
import { useHistory } from "react-router-dom";
import { getSportPosition } from "../../data/sport-positions";

interface ExperienceSectionProps {
  data: { title: string };
  className: string;
  sport: string;
  experiencesString: any;
  myProfile: boolean;
  userId: number;
}

export interface Experience {
  position?: string;
  team?: string;
  school?: string;
  city?: string;
  state?: string;
  startYear?: string;
  endYear?: string;
}

const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  data,
  userId,
  className,
  sport,
  experiencesString,
  myProfile,
}) => {
  console.log("ExperienceSection: ", experiencesString);
  const history = useHistory();
  let experiences: any[] = [];
  let noExperience = true;

  experiencesString.forEach((e: string) => {
    let experience: Experience = JSON.parse(e);
    if (
      !experience.position ||
      !experience.city ||
      !experience.state ||
      !experience.startYear ||
      !experience.endYear
    ) {
      return;
    }

    noExperience = false;

    experiences.push(
      <IonItem lines="none" className="urp-section-item" detail={false}>
        <div>
          <div>{getSportPosition(sport, experience.position)}</div>
          <div>
            {experience.team}
            <div className="urp-dot">&#183;</div>
            {experience.startYear}-{experience.endYear}
          </div>
          <div>
            {experience.school}
            <div className="urp-dot">&#183;</div>
            {experience.city}, {experience.state}
          </div>
        </div>
      </IonItem>
    );
  });

  if (noExperience) {
    if (myProfile) {
      experiences.push(
        <div className="urp-highlight-add-media-container urp-highlight-add-media-container">
          <p className="urp-highlight-add-media-title">
            Uh! Looks like you haven’t added any experiences to your account yet
          </p>
          <p
            className="urp-highlight-add-media-text"
            onClick={(e) => {
              e.preventDefault();
              history.push(`edit-athlete/${userId}`);
            }}
          >
            Add Experiences
          </p>
        </div>
      );
    } else {
      experiences.push(
        <div className="urp-highlight-add-media-container">
          <p className="urp-highlight-add-media-title">
            Uh! Looks like the user hasn't added any experiences yet
          </p>
        </div>
      );
    }
  }

  return <div className={`${className} urp-experience`}><IonContent>{experiences}</IonContent></div>;
};

export default ExperienceSection;
