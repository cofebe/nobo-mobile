import { IonContent, IonItem } from '@ionic/react';
import './ExperienceSection.css';
import { useHistory } from 'react-router-dom';

interface CoachingExperienceSectionProps {
  data: { title: string };
  className: string;
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

const CoachingExperienceSection: React.FC<CoachingExperienceSectionProps> = ({
  data,
  userId,
  className,
  experiencesString,
  myProfile,
}) => {
  //console.log('CoachingExperienceSection: ', experiencesString);
  const history = useHistory();
  let experiences: any[] = [];
  let noExperience = true;

  experiencesString?.forEach((e: string) => {
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
      <IonItem lines="none" className="nobo-section-item" detail={false} key={`${experience.startYear}-${experience.endYear}`}>
        <div>
          <div>{experience.position}</div>
          <div>
            {experience.team}
            <div className="nobo-dot">&#183;</div>
            {experience.startYear}-{experience.endYear}
          </div>
          <div>
            {experience.school}
            <div className="nobo-dot">&#183;</div>
            {experience.city}, {experience.state}
          </div>
        </div>
      </IonItem>
    );
  });

  if (noExperience) {
    if (myProfile) {
      experiences.push(
        <div className="nobo-highlight-add-media-container nobo-highlight-add-media-container" key="none">
          <p className="nobo-highlight-add-media-title">
            Uh! Looks like you haven’t added any coaching experiences to your
            account yet
          </p>
          <p
            className="nobo-highlight-add-media-text"
            onClick={(e) => {
              e.preventDefault();
              history.push(`edit-coach/${userId}`);
            }}
          >
            Add Coaching Experience
          </p>
        </div>
      );
    } else {
      experiences.push(
        <div className="nobo-highlight-add-media-container" key="none">
          <p className="nobo-highlight-add-media-title">
            Uh! Looks like the user hasn't added any stats yet
          </p>
        </div>
      );
    }
  }

  return (
    <div className={`${className} nobo-experience`}>
      <IonContent>{experiences}</IonContent>
    </div>
  );
};

export default CoachingExperienceSection;
