import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Profile } from '../data/profile';
import { Swiper, SwiperSlide } from 'swiper/react';
import {
  IonButtons,
  IonContent,
  IonItem,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonCol,
  IonText,
  useIonViewWillEnter,
  useIonLoading,
} from '@ionic/react';
import './ExploreList.css';
import ExploreListItem from '../components/ExploreListItem';
import { ExploreService } from '../services/ExploreService';
import UrpHeader from '../components/UrpHeader';
import { loadingOptions } from '../util';
import SortWidget from '../components/SortWidget';

const ExploreList: React.FC = () => {
  const exploreService = new ExploreService();

  const [presentLoading, dismissLoading] = useIonLoading();
  const [noPlayersFound, setNoPlayersFound] = useState(false);
  // const [sortType, setSortType] = useState("");
  // const [isCoach, setIsCoach] = useState(false);
  // const [isTrainer, setIsTrainer] = useState(false);
  let [messages, setMessages] = useState<Profile[]>([]);
  //const [countries, setCountries] = useState<string[]>([]);
  const [searchState, setSearchStates] = useState<string>('');
  const [searchAccountType, setAccountType] = useState<string>('');
  const [searchSchool, setSearchSchool] = useState<string>('');
  const [searchCountry, setSearchCountries] = useState<string>('');
  const [searchSport, setSearchSport] = useState<string>('');
  const [searchPosition, setSearchPosition] = useState<string>('');
  const [searchClass, setSearchClass] = useState<string>('');
  const [searchRank, setSearchRank] = useState<string>('');
  const [searchAward, setSearchAward] = useState<string>('');

  let [page, setPage] = useState<number>(0);
  let atBottomOfFeedListElem: HTMLElement | null;

  const history = useHistory();
  const location = useLocation();

  useIonViewWillEnter(() => {
    messages = [];
    setMessages(messages);
    loadResults(0);

    if (!atBottomOfFeedListElem) {
      atBottomOfFeedListElem = document.querySelector('#atBottomOfFeedListExplore');
    }
  });

  function loadResults(pg: number) {
    page = pg;
    setPage(pg);

    if (!page && atBottomOfFeedListElem) {
      atBottomOfFeedListElem.style.display = 'block';
    }

    // const msgs = getMessages();
    // setMessages(msgs);
    console.log('Search: ', location);

    let searchString = '';
    let searchAccountType = '';
    let searchState = '';
    let searchSchool = '';
    let searchCountry = '';
    let searchSport = '';
    let searchPosition = '';
    let searchClass = '';
    let searchRank = '';
    let searchAward = '';

    if (location !== undefined && location.search !== undefined) {
      console.log('Searchstring: ', location.search);
      // searchString = location.search.substring(1);
      const searchParams = new URLSearchParams(location.search);
      console.log(searchParams.values());

      if (searchParams.has('search')) {
        searchString = searchParams.get('search') || '';
      }
      if (searchParams.has('accountType')) {
        searchAccountType = searchParams.get('accountType') || '';
        setAccountType(searchAccountType);
      }
      if (searchParams.has('state')) {
        searchState = searchParams.get('state') || '';
        setSearchStates(searchState);
      }
      if (searchParams.has('school')) {
        searchSchool = searchParams.get('school') || '';
        setSearchSchool(searchSchool);
        console.log(searchSchool);
      }
      if (searchParams.has('country')) {
        searchCountry = searchParams.get('country') || '';
        setSearchCountries(searchCountry);
      }
      if (searchParams.has('sport')) {
        searchSport = searchParams.get('sport') || '';
        setSearchSport(searchSport);
      }
      if (searchParams.has('position')) {
        searchPosition = searchParams.get('position') || '';
        setSearchPosition(searchPosition);
      }
      if (searchParams.has('class')) {
        searchClass = searchParams.get('class') || '';
        setSearchClass(searchClass);
      }
      if (searchParams.has('rank')) {
        searchRank = searchParams.get('rank') || '';
        setSearchRank(searchRank);
      }
      if (searchParams.has('award')) {
        searchAward = searchParams.get('award') || '';
        setSearchAward(searchAward);
      }
    }

    let storage: any = window.localStorage.getItem('persistedState');
    let user = JSON.parse(storage);

    let userId = 1;

    if (user !== null) {
      userId = user.user['user_id'];
    }

    let req = {
      user_id: userId,
      account_type: [searchAccountType],
      search: searchString,
      state: [searchState],
      school: [searchSchool],
      country: [searchCountry],
      sport: [searchSport.replace(/ +/g, '')],
      position: [searchPosition],
      class: [searchClass],
      rank: [searchRank],
      awards: [searchAward],
    };
    console.log('Search req: ', req);

    console.log('SearchString: ', searchString);

    presentLoading(loadingOptions);
    exploreService
      .search(req, page)
      .then((res) => {
        if (res) {
          return res.json();
        } else {
          // showError(1)
        }
      })
      .then((data) => {
        console.log('here', data);

        if (searchAccountType === "Organization") {
          messages = messages.concat(data.organizations || [])
        }
        messages = messages.concat(data.users || []);
        setMessages(messages);

        // if (sortType != "") {
        //   sort(sortType)
        // }

        setNoPlayersFound(messages.length === 0);

        if (
          (data.users || []).length < data.page_size &&
          atBottomOfFeedListElem
        ) {
          atBottomOfFeedListElem.style.display = 'none';
        }

        dismissLoading();
      })
      .catch((err) => {
        // showError(0, err)
        console.error('Error:', err);
        dismissLoading();
      });
  }

  const refresh = (e: CustomEvent) => {
    setTimeout(() => {
      e.detail.complete();
      loadResults(0);
    }, 3000);
  };

  function scroll(e: any) {
    if (!atBottomOfFeedListElem) {
      atBottomOfFeedListElem = document.querySelector('#atBottomOfFeedListExplore');
    }

    if (atBottomOfFeedListElem) {
      const elemBounds = atBottomOfFeedListElem.getBoundingClientRect();
      const parentBounds = e.target.getBoundingClientRect();
      const isVisible =
        elemBounds.top >= parentBounds.top &&
        elemBounds.top < parentBounds.bottom;
      if (isVisible) {
        console.log('loading next page');
        loadResults(page + 1);
      }
    }
  }

  function sort(val: string) {
    // let desc = false;

    // if (sortType === val) {
    //   desc = true;
    // }

    // setSortType(val);
    const valFilter = val.split(' ')[0];
    const valType = val.split(' ')[1];
    let messagesSorted: Profile[] = [];
    messagesSorted = messages;
    setMessages([]);

    if (valFilter === 'Class') {
      messagesSorted.sort((a, b) => {
        if (
          parseInt(a.basic_user_profile.class_year.String) <
          parseInt(b.basic_user_profile.class_year.String)
        ) {
          return -1;
        }
        if (
          parseInt(a.basic_user_profile.class_year.String) >
          parseInt(b.basic_user_profile.class_year.String)
        ) {
          return 1;
        }
        return 0;
      });
    }

    if (valFilter === 'Height') {
      messagesSorted.sort((a, b) => {
        if (
          parseInt(a.athlete_user_profile.height.String) <
          parseInt(b.athlete_user_profile.height.String)
        ) {
          return -1;
        }
        if (
          parseInt(a.athlete_user_profile.height.String) >
          parseInt(b.athlete_user_profile.height.String)
        ) {
          return 1;
        }
        return 0;
      });
    }

    if (valFilter === 'Weight') {
      messagesSorted.sort((a, b) => {
        if (
          parseInt(a.athlete_user_profile.weight.String) <
          parseInt(b.athlete_user_profile.weight.String)
        ) {
          return -1;
        }
        if (
          parseInt(a.athlete_user_profile.weight.String) >
          parseInt(b.athlete_user_profile.weight.String)
        ) {
          return 1;
        }
        return 0;
      });
    }

    if (valType === '(DESC)') {
      messagesSorted.reverse();
    }

    setMessages(messagesSorted);
  }

  return (
    <IonPage className="explore-list">
      <UrpHeader></UrpHeader>
      <IonContent
        className="explore-list-page"
        fullscreen
        scrollY={true}
        scrollEvents={true}
        onIonScrollEnd={(e) => scroll(e)}
      >
        {searchAccountType === 'Athlete' && (
          <div
            style={{
              paddingLeft: '10px',
              marginTop: '31px',
              marginBottom: '30px',
              zIndex: 1,
              height: '20px',
              position: 'absolute',
              width: '30%',
            }}
          >
            <SortWidget
              types={[
                'Class (ASC)',
                'Class (DESC)',
                'Height (ASC)',
                'Height (DESC)',
                'Weight (ASC)',
                'Weight (DESC)',
              ]}
              asc={true}
              onSort={(e) => {
                sort(e);
              }}
            ></SortWidget>
          </div>
        )}
        <div
          style={{
            paddingLeft: '10px',
            marginTop: '31px',
            marginBottom: '30px',
            zIndex: 1,
            height: '20px',
          }}
        >
          <IonButtons
            style={{
              marginBottom: '30px',
              color: '#00D6B6',
              float: 'right',
              marginRight: '1.25rem',
              fontSize: '16px',
            }}
            slot="end"
            onClick={() => {
              history.goBack();
            }}
          >
            <IonText>Reset Explore</IonText>
          </IonButtons>
        </div>
        <IonRow>
          <Swiper
            style={{ marginBottom: '30px' }}
            slidesPerView={5}
            centeredSlides={false}
            observer={true}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            width={400}
            height={150}
          >
            {searchAccountType !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchAccountType}
                data-path={searchAccountType}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchAccountType}
                </span>
              </SwiperSlide>
            )}
            {searchState !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchState}
                data-path={searchState}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchState}
                </span>
              </SwiperSlide>
            )}
            {searchSchool !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchSchool}
                data-path={searchSchool}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchSchool}
                </span>
              </SwiperSlide>
            )}
            {searchCountry !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchCountry}
                data-path={searchCountry}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchCountry}
                </span>
              </SwiperSlide>
            )}
            {searchSport !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchSport}
                data-path={searchSport}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchSport}
                </span>
              </SwiperSlide>
            )}
            {searchPosition !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchPosition}
                data-path={searchPosition}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchPosition}
                </span>
              </SwiperSlide>
            )}
            {searchClass !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchClass}
                data-path={searchClass}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchClass}
                </span>
              </SwiperSlide>
            )}
            {searchRank !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchRank}
                data-path={searchRank}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchRank} Star
                </span>
              </SwiperSlide>
            )}
            {searchAward !== '' && (
              <SwiperSlide
                className={'noselect explore-sports-slide'}
                key={searchAward}
                data-path={searchAward}
              >
                <span className={'nobo-explore-list-tab-menu-item'}>
                  {searchAward}
                </span>
              </SwiperSlide>
            )}
          </Swiper>
        </IonRow>
        {/*<SortWidget types={["coach","athlete","trainer"]} asc={true} />*/}
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        <IonList style={{ background: '#F9FBFB' }}>
          {messages.map((m) => (
            <ExploreListItem key={m.user_id} profile={m} />
          ))}
          {noPlayersFound && (
            <h2 style={{ textAlign: 'center', paddingTop: '1rem' }}>
              No profiles found
            </h2>
          )}
          <IonItem id="atBottomOfFeedListExplore" key="bottom" lines="none">
            <IonRow>
              <IonCol>Loading...</IonCol>
            </IonRow>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ExploreList;
