
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonRow,
  IonCol,
  useIonViewWillEnter,
  IonButton,

} from "@ionic/react";
import "cropperjs/dist/cropper.css";
import "./SelectBrands.scss";
import Button from "../components/Button";
import "cropperjs/dist/cropper.css";
import { UserService } from "../services/UserService";
import Search from "../components/Search";
import Checkbox from "../components/Checkbox";
import { loadingStore } from "../loading-store";





interface Data {
  _id: string
  name: string
  url: string
}

interface Brands {
  matched: any
  map: any


}


const SelectBrands: React.FC = () => {
  const userService = new UserService()
  const history = useHistory();
  const [brandSelected, setBrandSelected] = useState("")
  const [brandsItems, setBrandItems] = useState<Brands[]>([])
  const [brandName, setBrandName] = useState("")
  const [brandId, setBrandId] = useState("")




  useIonViewWillEnter(() => {
    userService.getBrands()
      .then((brands: Brands) => {
        localStorage.setItem("brands", JSON.stringify(brands))
        setBrandItems([brands.matched])
      })

      .catch((error) => { console.log("err, ", error) })
  })

  const handleTicker = (arg: string, brandId: string) => {
    setBrandId(brandId)
    setBrandSelected(arg);
    // console.log(experienceOption);
    const alaia = () => {
      setBrandName("Azzedine Alaia");

    };
    const aquazzura = () => {
      setBrandName("Aquazzura");

    };
    const amina = () => {
      setBrandName("Amina Muaddi");

    };

    const armani = () => {
      setBrandName("Armani");

    };
    const apple = () => {
      setBrandName("Apple");

    };
    const ap = () => {
      setBrandName("Audemars Piguet");

    };

    switch (arg) {
      case "Azzedine Alaia":
        alaia();

        break;

      case "Aquazzura":
        aquazzura();

        break;

      case "Amina Muaddi":
        amina();

        break;
      case "Apple":
        apple();

        break;
      case "Armani":
        armani();

        break;
      case "Audemars Piguet":
        ap();

        break;

      default:
        break;
    }


  }

  const handleSubmit = async () => {
    
// console.log(typeof(brandOption), brandOption)
  console.log("sending brandId and token..... ",brandId)

    const userToken = localStorage.getItem("appUserToken");
    if (userToken) {
      const token = JSON.parse(userToken);
      loadingStore.increment("SelectBrand:timeout");
      userService
        .selectBrand(token, brandId)
        .then(res => res)
        .then((brand: Data) => { 
          // console.log(brand) 
          history.push("/onboarding-post")
          loadingStore.decrement("SelectBrand:timeout");

        })
        .catch((err: any) => {
          loadingStore.decrement("SelectBrand:timeout");
          console.log("SelectBrand error", err);
        });
    } else {
      return console.log("no token found");
    }
  };



  // console.log( brandId)


  return (
    <IonPage className="select-brands-main-container">
      <IonContent className="select-brands-ion-content">
        <div className="select-brands-header">
          <img
            onClick={() => {
              history.goBack();
            }}
            className="select-brands-back-btn"
            style={{ color: "black" }}
            height={23}
            src="assets/images/arrow-left.svg"
            alt="logo"
          />

          <img
            className="select-brands-nobo-logo"
            src="assets/images/nobo_logo.png"
            alt="logo"
          />
        </div>

        <IonRow>
          <IonCol className="select-brands-title">SELECT BRANDS</IonCol>
        </IonRow>
        <IonRow className="select-brands-desc-container">
          <IonCol className="select-brands-desc">
            Let other people know your favourite brands to trade, buy, or sell
          </IonCol>
        </IonRow>
        <div className="select-brands-search-container" >
          <Search
            className="select-brands-search"
            onChange={(e) => (console.log(e))}
          />
        </div>
        <div className="select-brands-body-container" >

          <IonRow className="select-brand-img-container" >
            {brandsItems[0]?.map((brands: Data) => (
              <IonCol className="select-brand-img-col" key={brands._id} size="5" >
                <img
                  onClick={() => {

                    handleTicker(brands.name, brands._id)
                  }}
                  src={brands.url}
                  alt="Alaia"
                />

                <div className="select-brand-checkbox">
                  <Checkbox value={brandName === brands.name} onChange={() => { }} />
                </div>
              </IonCol>
            ))}
          </IonRow>
        </div>


        {brandSelected === "" && (<IonRow className={"select-brands-skip-container"}>
          <IonButton fill='outline' className="select-brands-skip-text"
            onClick={() => {

            }}
          >SKIP FOR NOW</IonButton>
        </IonRow>)}

        <div className={brandSelected === ""?  "select-brands-btn-container":"select-brands-btn-container2"}>
          <Button
            // className='profile-picture-btn'
            label="NEXT"
            large
            onClick={handleSubmit}
            disabled={brandSelected === ""}
          />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SelectBrands;



