import { IonContent } from "@ionic/react";
import "./OffersSection.css";
import { useHistory } from "react-router-dom";
import { getUniversities } from "../../data/university-full";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser";

interface OffersSectionProps {
  data: { title: string };
  className: string;
  offers: string[];
  myProfile: boolean;
  userId: number;
}

const OffersSection: React.FC<OffersSectionProps> = ({
  data,
  userId,
  className,
  offers,
  myProfile,
}) => {
  const history = useHistory();
  const universities = getUniversities();

  return (
    <div id="nobo-offers-section" className={"nobo-offsers-section " + className}>
      <IonContent>
        <div
          style={{
            display: "flex",
            marginBottom: "10px",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {offers.map((offer) => {
            let imgSrc = "assets/images/default-offer-logo.png";
            let schoolWebsite = "";
            for (let i = 0; i < universities.length; i += 1) {
              if (universities[i].name === offer) {
                schoolWebsite = universities[i].web_page;
                imgSrc = `${universities[i].img}`;
              }
            }
            return (
              <div key={schoolWebsite} className="nobo-offer-item">
                <img
                  className="logo-logo"
                  src={imgSrc}
                  width="80"
                  height="80"
                  alt="offer-logo"
                  onClick={(e) =>
                    InAppBrowser.create(schoolWebsite, "_blank", "location=yes")
                  }
                />
              </div>
            );
          })}
          {offers.length === 0 && myProfile && (
            <div className="nobo-highlight-add-media-container nobo-highlight-add-media-container">
              <p className="nobo-highlight-add-media-title">
                Uh! Looks like you haven’t added any offers to your account yet
              </p>
              <p
                className="nobo-highlight-add-media-text"
                onClick={(e) => {
                  e.preventDefault();
                  history.push(`edit-athlete/${userId}`);
                }}
              >
                Add Offers
              </p>
            </div>
          )}
          {offers.length === 0 && !myProfile && (
            <div className="nobo-highlight-add-media-container">
              <p className="nobo-highlight-add-media-title">
                Uh! Looks like the user hasn't added any academics yet
              </p>
            </div>
          )}
        </div>
      </IonContent>
    </div>
  );
};

export default OffersSection;
