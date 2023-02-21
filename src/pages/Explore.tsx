import { useState } from 'react';
import { getSchools } from '../data/schools';
import { getClasses } from '../data/classes';
import { getCountries } from '../data/countries';
import { Position, getPositions } from '../data/sport-positions';
import { Swiper, SwiperSlide } from 'swiper/react';
import { closeOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import {
  IonCol,
  IonContent,
  IonIcon,
  IonList,
  IonPage,
  IonButton,
  IonButtons,
  IonAccordion,
  IonAccordionGroup,
  IonRow,
  IonItem,
  IonNote,
  IonLabel,
  IonToolbar,
  IonSearchbar,
  useIonViewWillEnter,
  useIonViewDidEnter,
  IonText,
} from '@ionic/react';
import './Explore.css';
// import UrpHeader from '../components/NoboHeader';
import { chevronBackOutline, checkmark } from 'ionicons/icons';

const Explore: React.FC = () => {
  const allStates: string[] = [
    'Alaska',
    'Alabama',
    'Arkansas',
    'American Samoa',
    'Arizona',
    'California',
    'Colorado',
    'Connecticut',
    'District of Columbia',
    'Delaware',
    'Florida',
    'Georgia',
    'Guam',
    'Hawaii',
    'Iowa',
    'Idaho',
    'Illinois',
    'Indiana',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Massachusetts',
    'Maryland',
    'Maine',
    'Michigan',
    'Minnesota',
    'Missouri',
    'Mississippi',
    'Montana',
    'North Carolina',
    'North Dakota',
    'Nebraska',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'Nevada',
    'New York',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Puerto Rico',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Virginia',
    'Virgin Islands',
    'Vermont',
    'Washington',
    'Wisconsin',
    'West Virginia',
    'Wyoming',
  ];
  const sports = [
    { name: 'Football', section: '/option', state: 'Football' },
    { name: 'W Basketball', section: '/option', state: 'W Basketball' },
    { name: 'M Basketball', section: '/option', state: 'M Basketball' },
    { name: 'Baseball', section: '/option', state: 'Baseball' },
    { name: 'Softball', section: '/option', state: 'Softball' },
    { name: 'W Lacrosse', section: '/option', state: 'W Lacrosse' },
    { name: 'M Lacrosse', section: '/option', state: 'M Lacrosse' },
    { name: 'W Soccer', section: '/option', state: 'W Soccer' },
    { name: 'M Soccer', section: '/option', state: 'M Soccer' },
    { name: 'M Volleyball', section: '/option', state: 'M Volleyball' },
    { name: 'W Volleyball', section: '/option', state: 'W Volleyball' },
  ];
  const accountTypes = ['Athlete', 'Coach', 'Trainer', 'Organization'];
  //const positions = ["Quarter Back", "Running Back", "Wide Reciever", "Tight End", "Left Guard", "Right Guard", "Defensive Back"]
  const classes = getClasses();
  const ratings = [1, 2, 3, 4, 5];
  const awards = [
    'All American',
    'All County',
    'All League',
    'All State',
    'Comeback Player',
    'Defensive Player',
    'MVP',
    'Offensive Player',
    'Other',
  ];

  let allSchools: string[] = getSchools();
  const allCountries: string[] = getCountries();
  const allPositions: Position[] = getPositions();
  const [showPositions, setShowPositions] = useState<any[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>(allStates);
  const [countries, setCountries] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [filterState, setFilterState] = useState<string>('');
  const [filterSchool, setFilterSchool] = useState<string>('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [searchAccountType, setSearchAccountType] = useState<string>('Athlete');
  const [searchState, setSearchStates] = useState<string>('');
  const [searchSchool, setSearchSchool] = useState<string>('');
  const [searchCountry, setSearchCountries] = useState<string>('');
  const [searchSport, setSearchSport] = useState<string>('');
  const [searchPosition, setSearchPosition] = useState<string>('');
  const [searchClass, setSearchClass] = useState<string>('');
  const [searchRank, setSearchRank] = useState<string>('');
  const [searchAward, setSearchAward] = useState<string>('');
  const history = useHistory();
  const btnColor = '#00816D';

  const [targetSection, setTargetSection] = useState('');
  console.log('targetSection: ', targetSection);
  console.log('lower: ', targetSection.toLowerCase());

  useIonViewWillEnter(() => {
    console.log('IonViewWillEnter');
    setSchools(allSchools);
    setCountries(allCountries);
    hideAll();
    // loadSavedFilters();
  });

  useIonViewDidEnter(() => {
    setSchools(getSchools());
    loadSavedFilters();
  });

  function loadSavedFilters() {
    let storage: any = window.localStorage.getItem('exploreFilters');
    let filters = JSON.parse(storage);
    console.log('Saved filters: ', filters);
    setSearchText(filters?.searchText || '');
    // setFilterState(filters?.filterState || '');
    // setFilterSchool(filters?.filterSchool || '');
    // setFilterCountry(filters?.filterCountry || '');
    setSearchStates(filters?.searchState || '');
    setSearchSchool(filters?.searchSchool || '');
    setSearchCountries(filters?.searchCountry || '');
    setSearchSport(filters?.searchSport || '');
    setTargetSection(filters?.targetSection || '');
    setSearchPosition(filters?.searchPosition || '');
    setSearchClass(filters?.searchClass || '');
    setSearchRank(filters?.searchRank || '');
    setSearchAward(filters?.searchAward || '');
  }

  function showStates() {
    console.log('States');
    let reveals = document.querySelectorAll('.home-content');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.add('slide-left');
    }

    reveals = document.querySelectorAll('.explore-states');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.add('slide-left');
    }
  }

  function showSchools() {
    console.log('All schools', allSchools);
    console.log('Schools');
    let reveals = document.querySelectorAll('.home-content');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.add('slide-left');
    }

    reveals = document.querySelectorAll('.explore-schools');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.add('slide-left');
    }
  }

  function showCountries() {
    let reveals = document.querySelectorAll('.home-content');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.add('slide-left');
    }

    reveals = document.querySelectorAll('.explore-countries');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.add('slide-left');
    }
  }

  function hideAll() {
    console.log('HideAll');
    let reveals = document.querySelectorAll('.home-content');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.remove('slide-left');
    }

    reveals = document.querySelectorAll('.explore-states');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.remove('slide-left');
    }

    reveals = document.querySelectorAll('.explore-schools');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.remove('slide-left');
    }

    reveals = document.querySelectorAll('.explore-countries');
    for (let i = 0; i < reveals.length; i++) {
      reveals[i].classList.remove('slide-left');
    }
    return;
  }

  function searchStates(search: string) {
    let updateStates;
    if (search !== '') {
      search = search.toLowerCase();
      updateStates = allStates.filter((state) => {
        return state.toLowerCase().includes(search);
      });
    } else {
      updateStates = allStates;
    }
    setStates(updateStates);
  }

  function searchSchools(search: string) {
    let updateSchools;
    if (search !== '') {
      search = search.toLowerCase();
      updateSchools = allSchools.filter((school) => {
        return school.toLowerCase().includes(search);
      });
    } else {
      updateSchools = allSchools;
    }
    setSchools(updateSchools);
  }

  function searchCountries(search: string) {
    let updateCountries;
    if (search !== '') {
      search = search.toLowerCase();
      updateCountries = allCountries.filter((country) => {
        return country.toLowerCase().includes(search);
      });
    } else {
      updateCountries = allCountries;
    }
    setCountries(updateCountries);
  }

  function search() {
    console.log('Searching... ', searchText);
    let searchParameters = '';

    if (searchText !== '') {
      searchParameters += `?search=${searchText}`;
    }

    if (searchAccountType !== '') {
      searchParameters += `&accountType=${searchAccountType}`;
    }

    if (searchState !== '') {
      searchParameters += `&state=${searchState}`;
    }

    if (searchSchool !== '') {
      searchParameters += `&school=${searchSchool}`;
    }

    if (searchCountry !== '') {
      searchParameters += `&country=${searchCountry}`;
    }

    if (searchSport !== '') {
      searchParameters += `&sport=${searchSport.toLowerCase()}`;
    }

    if (searchPosition !== '') {
      searchParameters += `&position=${searchPosition}`;
    }

    if (searchClass !== '') {
      searchParameters += `&class=${searchClass}`;
    }

    if (searchRank !== '') {
      searchParameters += `&rank=${searchRank}`;
    }

    if (searchAward !== '') {
      searchParameters += `&award=${searchAward}`;
    }

    history.push({
      pathname: '/home/explore/list',
      search: searchParameters,
    });
  }

  const Search = (value: any) => {
    console.log('Searching... ', searchText);

    if (value === 'Enter') {
      let searchParameters = '';

      if (searchText !== '') {
        searchParameters += `?search=${searchText}`;
      }

      if (searchAccountType !== '') {
        searchParameters += `&accountType=${searchAccountType}`;
      }

      if (searchState !== '') {
        searchParameters += `&state=${searchState}`;
      }

      if (searchSchool !== '') {
        searchParameters += `&school=${searchSchool}`;
      }

      if (searchCountry !== '') {
        searchParameters += `&country=${searchCountry}`;
      }

      if (searchSport !== '') {
        searchParameters += `&sport=${searchSport.toLowerCase()}`;
      }

      if (searchPosition !== '') {
        searchParameters += `&position=${searchPosition}`;
      }

      if (searchClass !== '') {
        searchParameters += `&class=${searchClass}`;
      }

      if (searchRank !== '') {
        searchParameters += `&rank=${searchRank}`;
      }

      if (searchAward !== '') {
        searchParameters += `&award=${searchAward}`;
      }

      let form = document.getElementById('dummy');
      if (form !== null) {
        form.focus();
      }

      history.push({
        pathname: '/home/explore/list',
        search: searchParameters,
      });
    }
  };

  function reset() {
    setSearchText('');
    // setFilterState("")
    // setFilterSchool("")
    // setFilterCountry("")
    setSearchStates('');
    setSearchSchool('');
    setSearchCountries('');
    setSearchSport('');
    setTargetSection('');
    setSearchPosition('');
    setSearchClass('');
    setSearchRank('');
    setSearchAward('');
    window.localStorage['exploreFilters'] = JSON.stringify({
      searchText: '',
      searchState: '',
      searchSchool: '',
      searchCountry: '',
      searchSport: '',
      targetSection: '',
      searchPosition: '',
      searchClass: '',
      searchRank: '',
      searchAward: '',
    });
  }

  function save() {
    window.localStorage['exploreFilters'] = JSON.stringify({
      searchText,
      // filterState,
      // filterSchool,
      // filterCountry,
      searchState,
      searchSchool,
      searchCountry,
      searchSport,
      targetSection,
      searchPosition,
      searchClass,
      searchRank,
      searchAward,
    });
  }

  return (
    <IonPage className="home-explore">
      {/* <UrpHeader></UrpHeader> */}
      <IonContent
        className="home-content home-explore-bg"
        scrollY={true}
        fullscreen
      >
        <IonItem className="explore-filter-labels home-explore-bg" lines="none">
          <IonLabel slot="start" onClick={() => reset()}>
            Reset
          </IonLabel>
          <IonLabel slot="end" onClick={() => save()}>
            Save
          </IonLabel>
        </IonItem>
        <IonSearchbar
          id="input"
          className="explore-search-bar explore-filter-row"
          value={searchText}
          onKeyPress={(e) => Search(e.key)}
          onIonChange={(e) => {
            setSearchText(e.detail.value!);
            return;
          }}
          enterkeyhint="search"
          debounce={0}
        ></IonSearchbar>
        <IonRow>
          <Swiper
            slidesPerView={5}
            centeredSlides={false}
            observer={true}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            width={400}
            height={150}
          >
            {searchState !== '' && (
              <SwiperSlide
                onClick={() => {
                  if (searchState === '') {
                  } else {
                    setSearchStates('');
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={searchState}
                data-path={searchState}
              >
                <span className={'nobo-explore-tab-menu-item selected'}>
                  {searchState}
                  <IonIcon
                    className="nobo-explore-close-item"
                    size="small"
                    slot="icon-only"
                    color="#00816d"
                    icon={closeOutline}
                  />
                </span>
              </SwiperSlide>
            )}
            {searchSchool !== '' && (
              <SwiperSlide
                onClick={() => {
                  if (searchSchool === '') {
                  } else {
                    setSearchSchool('');
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={searchSchool}
                data-path={searchSchool}
              >
                <span className={'nobo-explore-tab-menu-item selected'}>
                  {searchSchool}
                  <IonIcon
                    className="nobo-explore-close-item"
                    size="small"
                    slot="icon-only"
                    color="#00816d"
                    icon={closeOutline}
                  />
                </span>
              </SwiperSlide>
            )}
            {searchCountry !== '' && (
              <SwiperSlide
                onClick={() => {
                  if (searchCountry === '') {
                  } else {
                    setSearchCountries('');
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={searchCountry}
                data-path={searchCountry}
              >
                <span className={'nobo-explore-tab-menu-item selected'}>
                  {searchCountry}
                  <IonIcon
                    className="nobo-explore-close-item"
                    size="small"
                    slot="icon-only"
                    color="#00816d"
                    icon={closeOutline}
                  />
                </span>
              </SwiperSlide>
            )}
            {searchSport !== '' && (
              <SwiperSlide
                onClick={() => {
                  if (searchSport === '') {
                  } else {
                    setSearchSport('');
                    setTargetSection('');
                    setShowPositions([]);
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={searchSport}
                data-path={searchSport}
              >
                <span className={'nobo-explore-tab-menu-item selected'}>
                  {searchSport}
                  <IonIcon
                    className="nobo-explore-close-item"
                    size="small"
                    slot="icon-only"
                    color="#00816d"
                    icon={closeOutline}
                  />
                </span>
              </SwiperSlide>
            )}
            {searchPosition !== '' && (
              <SwiperSlide
                onClick={() => {
                  if (searchPosition === '') {
                  } else {
                    setSearchPosition('');
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={searchPosition}
                data-path={searchPosition}
              >
                <span className={'nobo-explore-tab-menu-item selected'}>
                  {searchPosition}
                  <IonIcon
                    className="nobo-explore-close-item"
                    size="small"
                    slot="icon-only"
                    color="#00816d"
                    icon={closeOutline}
                  />
                </span>
              </SwiperSlide>
            )}
            {searchClass !== '' && (
              <SwiperSlide
                onClick={() => {
                  if (searchClass === '') {
                  } else {
                    setSearchClass('');
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={searchClass}
                data-path={searchClass}
              >
                <span className={'nobo-explore-tab-menu-item selected'}>
                  {searchClass}
                  <IonIcon
                    className="nobo-explore-close-item"
                    size="small"
                    slot="icon-only"
                    color="#00816d"
                    icon={closeOutline}
                  />
                </span>
              </SwiperSlide>
            )}
            {searchRank !== '' && (
              <SwiperSlide
                onClick={() => {
                  if (searchRank === '') {
                  } else {
                    setSearchRank('');
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={searchRank}
                data-path={searchRank}
              >
                <span className={'nobo-explore-tab-menu-item selected'}>
                  {searchRank} Star
                  <IonIcon
                    className="nobo-explore-close-item"
                    size="small"
                    slot="icon-only"
                    color="#00816d"
                    icon={closeOutline}
                  />
                </span>
              </SwiperSlide>
            )}
            {searchAward !== '' && (
              <SwiperSlide
                onClick={() => {
                  if (searchAward === '') {
                  } else {
                    setSearchAward('');
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={searchAward}
                data-path={searchAward}
              >
                <span className={'nobo-explore-tab-menu-item selected'}>
                  {searchAward}
                  <IonIcon
                    className="nobo-explore-close-item"
                    size="small"
                    slot="icon-only"
                    color="#00816d"
                    icon={closeOutline}
                  />
                </span>
              </SwiperSlide>
            )}
          </Swiper>
        </IonRow>
        {/* <button id="dummy" style={{ height: '0px', padding: '0px' }}></button> */}
        <IonRow>
          <Swiper
            slidesPerView={5}
            centeredSlides={false}
            observer={true}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            width={400}
            height={150}
          >
            {accountTypes.map((t) => (
              <SwiperSlide
                onClick={() => {
                  if (t === searchAccountType) {
                    setSearchAccountType(t);
                  } else {
                    setSearchAccountType(t);
                  }
                }}
                className={'noselect explore-sports-slide'}
                key={t}
                data-path={t}
              >
                <span
                  className={
                    'nobo-explore-account-tab-menu-item ' +
                    (searchAccountType === t ? 'selected' : '')
                  }
                >
                  {t}
                </span>
              </SwiperSlide>
            ))}
          </Swiper>
        </IonRow>
        {/*{ (searchState !== "") && <div className="nobo-explore-tab-menu-item selected">{searchState}</div> } */}
        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="12">
            <IonItem
              className="home-explore-bg"
              onClick={(e) => {
                e.preventDefault();
                showStates();
              }}
              button
              detail={true}
              disabled={searchAccountType === 'Organization' ? true : false}
            >
              <IonLabel style={{ color: '#00816D' }}>States</IonLabel>
              <IonNote style={{ color: '#00816D' }} slot="end">
                View All
              </IonNote>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="12">
            <IonItem
              className="home-explore-bg"
              onClick={(e) => {
                e.preventDefault();
                showSchools();
              }}
              button
              detail={true}
              disabled={searchAccountType === 'Organization' ? true : false}
            >
              <IonLabel style={{ color: '#00816D' }}>Schools</IonLabel>
              <IonNote style={{ color: '#00816D' }} slot="end">
                View All
              </IonNote>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="12">
            <IonItem
              className="home-explore-bg"
              onClick={(e) => {
                e.preventDefault();
                showCountries();
              }}
              button
              detail={true}
              disabled={searchAccountType === 'Organization' ? true : false}
            >
              <IonLabel style={{ color: '#00816D' }}>Countries</IonLabel>
              <IonNote style={{ color: '#00816D' }} slot="end">
                View All
              </IonNote>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="12">
            <IonItem
              className="home-explore-bg"
              button
              detail={false}
              lines="none"
              disabled={searchAccountType === 'Organization' ? true : false}
            >
              <IonLabel style={{ color: '#00816D' }}>Sports</IonLabel>
            </IonItem>
            {/*{sports.map(s => <IonButton className="explore-sports-btn">{s}</IonButton>)}*/}
            {/*              <div className="home-sports-container">
                <Swiper
                  slidesPerView={5}
                  centeredSlides={false}
                  observer={true}
                  onSlideChange={() => console.log("slide change")}
                  onSwiper={swiper => console.log(swiper)}
                  width={400}
                  height={150}
                >
                  {sports.map(s => <SwiperSlide className="explore-sports-slide"><IonButton type="button" color="#99E1D9" className="explore-sports-btn">{s}</IonButton></SwiperSlide>)}
                </Swiper>
              </div>*/}
            <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              <Swiper
                slidesPerView={5}
                centeredSlides={false}
                observer={true}
                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}
                width={550}
                height={150}
              >
                {sports.map((s) => (
                  <SwiperSlide
                    onClick={() => {
                      setSearchPosition('');
                      setShowPositions([]);
                      if (s.name === searchSport) {
                        setSearchSport('');
                        setTargetSection('');
                      } else {
                        setSearchSport(s.name);
                        setTargetSection(s.state);
                      }
                    }}
                    className={'noselect explore-sports-slide'}
                    key={s.name}
                    data-path={s.section}
                  >
                    <span
                      className={
                        'nobo-explore-tab-menu-item ' +
                        (targetSection === s.state ? 'selected' : '')
                      }
                    >
                      {s.name}
                      {targetSection === s.state && (
                        <IonIcon
                          className="nobo-explore-close-item"
                          size="small"
                          slot="icon-only"
                          color="#00816d"
                          icon={closeOutline}
                        />
                      )}
                    </span>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </IonCol>
        </IonRow>
        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="12">
            <IonAccordionGroup>
              <IonAccordion disabled={targetSection === ''} value="colors">
                <IonItem className="home-explore-bg" slot="header" button>
                  <IonLabel style={{ color: '#00816D' }}>Positions</IonLabel>
                </IonItem>
                <IonList slot="content">
                  {allPositions.map((p) => {
                    if (targetSection.toLowerCase().includes(p.sport)) {
                      showPositions.push(
                        <IonItem
                          className="home-explore-bg"
                          onClick={(e) => {
                            if (searchPosition === p.name) {
                              setSearchPosition('');
                            } else {
                              setSearchPosition(p.symbol);
                            }
                          }}
                          key={p.sport}
                        >
                          <IonLabel>
                            {p.name}
                            <input
                              className="explore-checkbox"
                              type="checkbox"
                              id="scales"
                              name="scales"
                            ></input>
                          </IonLabel>
                        </IonItem>
                      );
                    }
                  })}
                  {showPositions}
                </IonList>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCol>
        </IonRow>
        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="12">
            <IonAccordionGroup>
              <IonAccordion value="colors">
                <IonItem
                  className="home-explore-bg"
                  slot="header"
                  button
                  disabled={searchAccountType === 'Organization' ? true : false}
                >
                  <IonLabel style={{ color: '#00816D' }}>Class</IonLabel>
                </IonItem>
                <IonList slot="content">
                  {classes.map((c) => (
                    <IonItem
                      disabled={
                        searchAccountType === 'Organization' ? true : false
                      }
                      className="home-explore-bg"
                      key={c.label}
                      onClick={(e) => {
                        if (searchClass === c.value) {
                          setSearchClass('');
                        } else {
                          setSearchClass(c.value);
                        }
                      }}
                    >
                      <IonLabel>
                        {c.label}
                        <input
                          className="explore-checkbox"
                          checked={searchClass === c.value}
                          type="checkbox"
                          id="scales"
                          name="scales"
                        ></input>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCol>
        </IonRow>
        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="12">
            <IonAccordionGroup>
              <IonAccordion value="colors">
                <IonItem
                  className="home-explore-bg"
                  slot="header"
                  button
                  disabled={searchAccountType === 'Organization' ? true : false}
                >
                  <IonLabel style={{ color: '#00816D' }}>Rank</IonLabel>
                </IonItem>
                <IonList slot="content">
                  {ratings.map((r) => (
                    <IonItem
                      disabled={
                        searchAccountType === 'Organization' ? true : false
                      }
                      className="home-explore-bg"
                      key={r.toString() + 'star'}
                      onClick={(e) => {
                        if (searchRank === r.toString()) {
                          setSearchRank('');
                        } else {
                          setSearchRank(r.toString());
                        }
                      }}
                    >
                      <IonLabel>
                        {r} Star
                        <input
                          className="explore-checkbox"
                          checked={searchRank === r.toString()}
                          type="checkbox"
                          id="scales"
                          name="scales"
                        ></input>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCol>
        </IonRow>
        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="12">
            <IonAccordionGroup>
              <IonAccordion value="colors">
                <IonItem
                  className="home-explore-bg"
                  slot="header"
                  button
                  disabled={searchAccountType === 'Organization' ? true : false}
                >
                  <IonLabel style={{ color: '#00816D' }}>Awards</IonLabel>
                </IonItem>
                <IonList slot="content">
                  {awards.map((a) => (
                    <IonItem
                      disabled={
                        searchAccountType === 'Organization' ? true : false
                      }
                      className="home-explore-bg"
                      key={a}
                      onClick={(e) => {
                        console.log(a);
                        if (searchRank === a) {
                          setSearchAward('');
                        } else {
                          setSearchAward(a);
                        }
                      }}
                    >
                      <IonLabel>
                        {a}
                        <input
                          className="explore-checkbox"
                          checked={searchAward === a}
                          type="checkbox"
                          id="scales"
                          name="scales"
                        ></input>
                      </IonLabel>
                    </IonItem>
                  ))}
                </IonList>
              </IonAccordion>
            </IonAccordionGroup>
          </IonCol>
        </IonRow>

        <IonRow className="explore-filter-row">
          <IonCol className="nobo-center" size="11">
            <IonButton
              onClick={(e) => {
                e.preventDefault();
                search();
              }}
              color={btnColor}
              type="submit"
              expand="block"
              className="nobo-explore-btn"
            >
              Explore
            </IonButton>
          </IonCol>
        </IonRow>
      </IonContent>

      <IonContent className="explore-states home-explore-bg" fullscreen>
        <IonRow>
          <IonCol className="nobo-center" size="11">
            <IonToolbar className="home-explore-toolbar">
              <IonButtons
                slot="start"
                onClick={() => {
                  hideAll();
                }}
              >
                <IonIcon slot="icon-only" icon={chevronBackOutline} />
                <IonText>States</IonText>
              </IonButtons>
            </IonToolbar>
          </IonCol>
          <IonSearchbar
            value={filterState}
            className="explore-search-bar"
            onIonChange={(e) => {
              setFilterState(e.detail.value!);
              searchStates(e.detail.value!);
            }}
          ></IonSearchbar>
          <IonLabel
            className="explore-search-bar-reset"
            onClick={(e) => {
              setSearchStates('');
            }}
          >
            Reset
          </IonLabel>
          {states.map((s) => (
            <IonCol
              className="nobo-center"
              size="11"
              onClick={(e) => {
                setSearchStates(s);
              }}
            >
              <IonItem
                className={
                  'home-explore-bg ' + (searchState === s)
                    ? 'nobo-explore-highlight'
                    : ''
                }
              >
                {/*show label icon with check else default ionitem*/}
                <IonLabel style={{ paddingLeft: '5px', color: '#00816D' }}>
                  {s}
                </IonLabel>
                {s === searchState && <IonIcon icon={checkmark}></IonIcon>}
              </IonItem>
            </IonCol>
          ))}
        </IonRow>
      </IonContent>

      <IonContent className="explore-schools home-explore-bg" fullscreen>
        <IonRow>
          <IonCol className="nobo-center" size="11">
            <IonToolbar className="home-explore-toolbar">
              <IonButtons
                slot="start"
                onClick={() => {
                  hideAll();
                }}
              >
                <IonIcon slot="icon-only" icon={chevronBackOutline} />
                <IonText>Schools</IonText>
              </IonButtons>
            </IonToolbar>
          </IonCol>
          <IonSearchbar
            value={filterSchool}
            className="explore-search-bar"
            onIonChange={(e) => {
              setFilterSchool(e.detail.value!);
              searchSchools(e.detail.value!);
            }}
          ></IonSearchbar>
          <IonLabel
            className="explore-search-bar-reset"
            onClick={(e) => {
              setSearchSchool('');
            }}
          >
            Reset
          </IonLabel>
          {schools.map((s, index) => {
            if (index < 100) {
              return (
                <IonCol
                  className="nobo-center"
                  size="11"
                  onClick={(e) => {
                    setSearchSchool(s);
                  }}
                >
                  <IonItem className="home-explore-bg">
                    <IonLabel style={{ color: '#00816D' }}>{s}</IonLabel>
                    {s === searchSchool && <IonIcon icon={checkmark}></IonIcon>}
                  </IonItem>
                </IonCol>
              );
            }
          })}
        </IonRow>
      </IonContent>

      <IonContent className="explore-countries home-explore-bg" fullscreen>
        <IonRow>
          <IonCol className="nobo-center" size="11">
            <IonToolbar className="home-explore-toolbar">
              <IonButtons
                slot="start"
                onClick={() => {
                  hideAll();
                }}
              >
                <IonIcon slot="icon-only" icon={chevronBackOutline} />
                <IonText>Countries</IonText>
              </IonButtons>
            </IonToolbar>
          </IonCol>
          <IonSearchbar
            value={filterCountry}
            className="explore-search-bar"
            onIonChange={(e) => {
              setFilterCountry(e.detail.value!);
              searchCountries(e.detail.value!);
            }}
          ></IonSearchbar>
          <IonLabel
            className="explore-search-bar-reset"
            onClick={(e) => {
              setSearchCountries('');
            }}
          >
            Reset
          </IonLabel>
          {countries.map((s) => {
            return (
              <IonCol
                className="nobo-center"
                size="11"
                onClick={(e) => {
                  setSearchCountries(s);
                }}
              >
                <IonItem className="home-explore-bg">
                  <IonLabel style={{ color: '#00816D' }}>{s}</IonLabel>
                  {s === searchCountry && <IonIcon icon={checkmark}></IonIcon>}
                </IonItem>
              </IonCol>
            );
          })}
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Explore;
