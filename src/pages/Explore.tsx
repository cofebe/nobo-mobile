import { useEffect, useRef, useState } from 'react';
import { IonCol, IonRow, IonPage, IonContent, useIonViewWillEnter, IonModal } from '@ionic/react';
import './Explore.scss';
import './Explore.css';
import ExploreHeader from '../components/ExploreHeader';
import NoboHomeItem from '../components/NoboHomeItem';
import { ProductService } from '../services/ProductService';
import { useParams } from 'react-router';
import Input from '../components/Input';
import { UserService } from '../services/UserService';
import { Brand, Category } from '../models';

const Explore: React.FC = () => {
  const productService = new ProductService();
  const userService = new UserService();
  const params: any = useParams();
  const [products, setProducts] = useState<any>([]);
  const [sort, setSort] = useState('date');
  const [sortPage, setSortPage] = useState('default');
  const [brandsItems, setBrandItems] = useState<Brand[]>([]);
  const [parentCategoryItems, setParentCategoryItems] = useState<Category[]>([]);
  const [categoryItems, setCategoryItems] = useState<Category>();
  const [brandInput, setbrandInput] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<string>('');
  const [subCategoryFilters, setSubCategoryFilters] = useState<String[]>([]);
  const [designerFilters, setDesignerFilters] = useState<String[]>([]);
  const [conditionFilters, setConditionFilters] = useState<String[]>([]);
  const [colorFilters, setColorFilters] = useState<String[]>([]);
  const [materialFilters, setMaterialFilters] = useState<String[]>([]);
  const [sizeFilters, setSizeFilters] = useState<String[]>([]);
  const [boxFilters, setBoxFilters] = useState<String[]>([]);

  const modal = useRef<HTMLIonModalElement>(null);
  const filterModal = useRef<HTMLIonModalElement>(null);

  const getBrands = () => {
    userService
      .getBrands()
      .then(brands => {
        setBrandItems(brands);
      })
      .catch(error => {
        console.log('err, ', error);
      });
  };

  const getCategories = () => {
    productService
      .getCategories()
      .then(categories => {
        setParentCategoryItems(categories.docs);
      })
      .catch(error => {
        console.log('err, ', error);
      });
  };

  useIonViewWillEnter(() => {
    getBrands();
    getCategories();
    // getProducts(params.sectionCategory, getAction(),  params.sectionName === 'sale', generateParams());
    const ionRouterOutlet = document.querySelector('ion-router-outlet') as HTMLElement;
    if (ionRouterOutlet) {
      ionRouterOutlet.style.setProperty('--animation-duration', '0s');
    }
  });

  const getSort = () => {
    if (sort === 'date') {
      return {
        createdAt: -1,
      };
    }
    if (sort === 'high') {
      return {
        price: -1,
      };
    }
    if (sort === 'low') {
      return {
        price: 1,
      };
    }
  };

  function getProducts(group: string, action: string, onSale: boolean, filters?: any) {
    productService
      .getProducts(group, action, onSale, getSort(), filters)
      .then(products => {
        setProducts(products.docs);
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  const reset = () => {
    if (params.sectionName === 'sale') {
      getProducts(params.sectionCategory, 'sell', true);
    } else if (params.sectionName === 'shop') {
      getProducts(params.sectionCategory, 'sell', false);
    } else {
      getProducts(params.sectionCategory, `${params.sectionName}`, false);
    }

    setSort('date');
    setCategoryFilters('');
    setSubCategoryFilters([]);
    setDesignerFilters([]);
    setConditionFilters([]);
    setColorFilters([]);
    setMaterialFilters([]);
    setSizeFilters([]);
    setBoxFilters([]);
    closeFilterModal();
    setSortPage('default');
  };

  const closeFilterModal = () => {
    setTimeout(() => {
      filterModal.current?.dismiss();
    }, 1000);
  };

  const brandFilter = brandsItems?.filter(brand =>
    brand.name.toLowerCase().includes(brandInput.toLowerCase(), 0)
  );

  const handleConditionFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setConditionFilters([...conditionFilters, value]);
    } else {
      setConditionFilters([...conditionFilters.filter(el => el !== value)]);
    }
    closeFilterModal();
  };

  const handleColorFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setColorFilters([...colorFilters, value]);
    } else {
      setColorFilters([...colorFilters.filter(el => el !== value)]);
    }
    closeFilterModal();
  };

  const handleMaterialFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setMaterialFilters([...materialFilters, value]);
    } else {
      setMaterialFilters([...materialFilters.filter(el => el !== value)]);
    }
    closeFilterModal();
  };

  const handleSizeFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setSizeFilters([...sizeFilters, value]);
    } else {
      setSizeFilters([...sizeFilters.filter(el => el !== value)]);
    }
    closeFilterModal();
  };

  const handleDesignerFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setDesignerFilters([...designerFilters, value]);
    } else {
      setDesignerFilters([...designerFilters.filter(el => el !== value)]);
    }
    closeFilterModal();
  };

  const handleCategoryFilters = (value: string) => {
    setCategoryFilters(value);
    // closeFilterModal();
  };

  const handleSubCategoryFilters = (checked: boolean, value: String) => {
    if (checked) {
      setSubCategoryFilters([...subCategoryFilters, value]);
    } else {
      setSubCategoryFilters([...subCategoryFilters.filter(el => el !== value)]);
    }
    closeFilterModal();
  };

  const handleBoxFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setBoxFilters([...boxFilters, value]);
    } else {
      setBoxFilters([...boxFilters.filter(el => el !== value)]);
    }
    closeFilterModal();
  };

  const generateParams = () => {
    const category = parentCategoryItems.find(
      el =>
        el.name.toUpperCase() === categoryFilters.toUpperCase() ||
        el.name.toUpperCase() === `${categoryFilters} [${params.sectionCategory.toUpperCase()}]`
    );
    const Sizes = sizeFilters.map(val => ({
      [`shop.${val}`]: { $exists: 1 },
    }));
    return {
      ...(category && { parentCategory: category?._id }),
      ...(subCategoryFilters.length > 0 && { category: { $in: subCategoryFilters } }),
      ...((boxFilters.length > 0 ||
        conditionFilters.length > 0 ||
        colorFilters.length > 0 ||
        materialFilters.length > 0 ||
        designerFilters.length > 0) && {
        attributes: {
          ...(boxFilters.length > 0 && { box: boxFilters }),
          ...(conditionFilters.length > 0 && { condition: conditionFilters }),
          ...(colorFilters.length > 0 && { color: colorFilters }),
          ...(materialFilters.length > 0 && { material: materialFilters }),
        },
      }),
      ...(designerFilters.length > 0 && {
        brand: {
          $in: designerFilters,
        },
      }),
      ...(sizeFilters.length > 0 && {
        $or: Sizes,
      }),
    };
  };

  const getAction = () => {
    if (
      params.sectionName === 'shop' ||
      params.sectionName === 'sale' ||
      params.sectionName === 'explore'
    ) {
      return 'sell';
    }
    return params.sectionName;
  };

  useEffect(() => {
    getProducts(
      params.sectionCategory,
      getAction(),
      params.sectionName === 'sale',
      generateParams()
    );
  }, [
    categoryFilters,
    designerFilters,
    subCategoryFilters,
    conditionFilters,
    colorFilters,
    materialFilters,
    sizeFilters,
    boxFilters,
    sort,
  ]);

  useEffect(() => {
    reset();
  }, [params]);

  const AllShoesSizes = [
    { name: '10.5M', value: '10_5M' },
    { name: '10M', value: '10M' },
    { name: '11.5M', value: '11_5M' },
    { name: '11M', value: '11M' },
    { name: '12M', value: '12M' },
    { name: '7W', value: '7W' },
    { name: '8.5M', value: '8_5M' },
    { name: '8.5W', value: '8_5W' },
    { name: '8W', value: '8W' },
    { name: '9.5M', value: '9_5M' },
    { name: '9.5W', value: '9_5W' },
    { name: '9M', value: '9M' },
  ];

  const AllMaterials = ['Canvas', 'Cloth', 'Foam', 'Knit', 'Leather', 'Patent Leather', 'Suede'];

  return (
    <IonPage className="nobo-explore-page">
      <ExploreHeader />
      <div className="explore-sort-container">
        <div
          onClick={() => {
            filterModal.current?.present();
          }}
        >
          <img height={18} src="assets/images/home-filter.svg" alt="" />
        </div>
        <div
          className="explore-sort-box"
          onClick={() => {
            modal.current?.present();
          }}
        >
          <img height={18} src="assets/images/home-sort.svg" alt="" />
        </div>
      </div>
      {products.length === 0 && <div className="home-search-status">NO RESULT FOUND!</div>}
      {params.sectionName === 'explore' ? (
        <IonContent>
          <IonRow>
            <IonCol className="large" size="12">
              <NoboHomeItem product={products[0]} isBig />
            </IonCol>
          </IonRow>
          {products.length > 1 && (
            <IonRow>
              <IonCol className="featured-items">FEATURED ITEMS</IonCol>
            </IonRow>
          )}
          <IonRow>
            {products?.slice(1).map((product: any, index: any) => (
              <IonCol style={{ height: 185 }} key={index} size="6">
                <NoboHomeItem product={product} />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      ) : (
        <IonContent>
          <IonRow>
            {products?.map((product: any, index: any) => (
              <IonCol className="small" key={index} size="6">
                <NoboHomeItem product={product} />
              </IonCol>
            ))}
          </IonRow>
        </IonContent>
      )}
      <IonModal
        className="explore-main-modal"
        ref={modal}
        initialBreakpoint={1}
        breakpoints={[1, 5]}
      >
        <IonRow className="explore-modal-container">
          <IonCol size="12" className="explore-modal-title-box">
            <p className="explore-modal-title-text">SORT BY</p>
          </IonCol>
          <IonCol
            size="12"
            className="explore-modal-listed-box"
            onClick={() => {
              setSort('date');
              setTimeout(() => {
                modal.current?.dismiss();
              }, 1000);
            }}
          >
            <p
              className={
                sort === 'date' ? 'explore-modal-listed-text-date' : 'explore-modal-listed-text'
              }
            >
              JUST LISTED
            </p>
          </IonCol>

          <IonCol
            size="12"
            className="explore-modal-listed-box"
            onClick={() => {
              setSort('high');
              setTimeout(() => {
                modal.current?.dismiss();
              }, 1000);
            }}
          >
            <p
              className={
                sort === 'high' ? 'explore-modal-listed-text-high' : 'explore-modal-listed-text'
              }
            >
              HIGH TO LOW
            </p>
          </IonCol>

          <IonCol
            size="12"
            className="explore-modal-listed-box"
            onClick={() => {
              setSort('low');
              setTimeout(() => {
                modal.current?.dismiss();
              }, 1000);
            }}
          >
            <p
              className={
                sort === 'low' ? 'explore-modal-listed-text-low' : 'explore-modal-listed-text'
              }
            >
              LOW TO HIGH
            </p>
          </IonCol>
        </IonRow>
      </IonModal>

      {/* ---------------------FILTER OPTION-------------------- */}

      <IonModal
        className={
          sortPage === 'color'
            ? 'explore-main-filter-modal2'
            : sortPage === 'condition'
            ? 'explore-main-filter-modal2'
            : 'explore-main-filter-modal'
        }
        ref={filterModal}
        initialBreakpoint={1}
        breakpoints={[1, 5]}
      >
        <IonRow className="explore-modal-filter-container">
          {sortPage === 'default' && (
            <>
              <IonCol size="12" className="filter-option-title-box">
                <div className="filter-option-title"></div>
                <div className="filter-option-title" style={{ marginLeft: '50px' }}>
                  FILTER
                </div>
                <div
                  style={{ color: '#D6980E' }}
                  className="filter-option-title"
                  onClick={() => {
                    reset();
                  }}
                >
                  Reset
                </div>
              </IonCol>
              {params?.sectionCategory !== 'sneakers' && (
                <>
                  <IonCol
                    size="12"
                    className="filter-option-box"
                    onClick={() => setSortPage('category')}
                  >
                    <div className="filter-option-text">CATEGORY</div>
                    <img
                      className="filter-option-img-arrow"
                      src="assets/images/arrow-right.svg"
                      alt=""
                    />
                  </IonCol>
                  <div className="filter-line-sep"></div>
                </>
              )}

              <IonCol
                size="12"
                className="filter-option-box"
                onClick={() => setSortPage('designer')}
              >
                <div className="filter-option-text">DESIGNER</div>
                <img
                  className="filter-option-img-arrow"
                  src="assets/images/arrow-right.svg"
                  alt=""
                />
              </IonCol>

              {params?.sectionCategory === 'sneakers' && (
                <>
                  <div className="filter-line-sep"></div>
                  <IonCol
                    size="12"
                    className="filter-option-box"
                    onClick={() => setSortPage('material')}
                  >
                    <div className="filter-option-text">MATERIAL</div>
                    <img
                      className="filter-option-img-arrow"
                      src="assets/images/arrow-right.svg"
                      alt=""
                    />
                  </IonCol>
                </>
              )}

              {params?.sectionCategory !== 'sneakers' && (
                <>
                  <div className="filter-line-sep"></div>

                  <IonCol
                    size="12"
                    className="filter-option-box"
                    onClick={() => setSortPage('condition')}
                  >
                    <div className="filter-option-text">CONDITION</div>
                    <img
                      className="filter-option-img-arrow"
                      src="assets/images/arrow-right.svg"
                      alt=""
                    />
                  </IonCol>

                  <div className="filter-line-sep"></div>

                  <IonCol
                    size="12"
                    className="filter-option-box"
                    onClick={() => setSortPage('color')}
                  >
                    <div className="filter-option-text">COLOR</div>
                    <img
                      className="filter-option-img-arrow"
                      src="assets/images/arrow-right.svg"
                      alt=""
                    />
                  </IonCol>
                </>
              )}
              {([
                'shoes',
                'tops [women]',
                'tops [men]',
                'dresses [women]',
                'dresses [men]',
                'bottoms [women]',
                'bottoms [men]',
                'outerwear [women]',
                'outerwear [men]',
                'suiting [men]',
                'suiting [women]',
              ].includes(categoryFilters) ||
                params.sectionCategory === 'sneakers') && (
                <>
                  <div className="filter-line-sep"></div>

                  <IonCol
                    size="12"
                    className="filter-option-box"
                    onClick={() => setSortPage('size')}
                  >
                    <div className="filter-option-text">SIZE</div>
                    <img
                      className="filter-option-img-arrow"
                      src="assets/images/arrow-right.svg"
                      alt=""
                    />
                  </IonCol>
                </>
              )}

              {params?.sectionCategory !== 'sneakers' && (
                <>
                  <div className="filter-line-sep"></div>

                  <IonCol size="12" className="filter-option-box">
                    <div className="filter-option-text">BOXING</div>
                  </IonCol>

                  <IonCol
                    size="12"
                    className="filter-option-box"
                    onClick={() => {
                      handleBoxFilters(!boxFilters.includes('Box Included'), 'Box Included');
                    }}
                  >
                    <div className="filter-option-text">BOX INCLUDED</div>
                    <input
                      type="checkbox"
                      name=""
                      checked={boxFilters.includes('Box Included')}
                      id=""
                      readOnly
                    />
                  </IonCol>

                  <IonCol
                    size="12"
                    className="filter-option-box"
                    onClick={() => {
                      handleBoxFilters(!boxFilters.includes('No Box'), 'No Box');
                    }}
                  >
                    <div className="filter-option-text">NOT INCLUDED</div>
                    <input
                      type="checkbox"
                      name=""
                      checked={boxFilters.includes('No Box')}
                      id=""
                      readOnly
                    />
                  </IonCol>
                </>
              )}
            </>
          )}

          {/* ---------------------CATEGORY-------------------- */}

          {sortPage === 'category' && (
            <>
              <IonCol size="12" className="filter-title-category-title-box">
                <div
                  className="filter-title-category-img"
                  onClick={() => {
                    setSortPage('default');
                  }}
                >
                  <img height={24} src="assets/images/arrow-left.svg" alt="" />
                </div>

                <div className="filter-title-category-title">BY CATEGORY</div>
              </IonCol>
              <div className="size-height">
                {parentCategoryItems
                  ?.filter(el => el.parent === null)
                  ?.map(category => {
                    return (
                      <IonCol
                        size="12"
                        key={category._id}
                        className="filter-title-category-box"
                        onClick={() => {
                          setSubCategoryFilters([]);
                          handleCategoryFilters(category.name.toLowerCase());
                          setCategoryItems(category);
                          setSortPage('subCategory');
                        }}
                      >
                        <p
                          className={
                            categoryFilters === category.name.toLowerCase()
                              ? 'filter-title-category-option-active'
                              : 'filter-title-category-option'
                          }
                        >
                          {category.name.toUpperCase().split(' ')[0]}
                        </p>
                      </IonCol>
                    );
                  })}
              </div>
            </>
          )}

          {/* ---------------------DESIGNER-------------------- */}

          {sortPage === 'designer' && (
            <>
              <IonCol size="12" className="filter-title-designer-title-box">
                <div
                  className="filter-title-category-img"
                  onClick={() => {
                    setSortPage('default');
                  }}
                >
                  <img height={24} src="assets/images/arrow-left.svg" alt="" />
                </div>
                <div className="filter-title-designer-title">BY DESIGNER</div>
              </IonCol>
              <IonCol size="12" className="filter-input-box">
                <Input
                  className="filter-input"
                  placeholder="SEARCH"
                  value={brandInput}
                  onChange={val => {
                    setbrandInput(val);
                  }}
                ></Input>
              </IonCol>
              <div className="test">
                {brandFilter?.map(brand => (
                  <IonCol
                    size="12"
                    key={brand._id}
                    className="filter-option-design-box"
                    onClick={() => {
                      handleDesignerFilters(!designerFilters.includes(brand.name), brand.name);
                    }}
                  >
                    <div className="filter-option-design-text">{brand.name}</div>
                    <input
                      onChange={() => {}}
                      type="checkbox"
                      name=""
                      checked={designerFilters.includes(brand.name)}
                      id=""
                    />
                  </IonCol>
                ))}
              </div>
            </>
          )}

          {/* ---------------------CONDITION-------------------- */}

          {sortPage === 'condition' && (
            <>
              <IonCol size="12" className="filter-title-designer-title-box">
                <div
                  className="filter-title-category-img"
                  onClick={() => {
                    setSortPage('default');
                  }}
                >
                  <img height={24} src="assets/images/arrow-left.svg" alt="" />
                </div>
                <div className="filter-title-designer-title">BY CONDITION</div>
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleConditionFilters(
                    !conditionFilters.includes('New With Tags'),
                    'New With Tags'
                  );
                }}
              >
                <div className="filter-option-design-text">NEW WITH TAGS</div>
                <input
                  type="checkbox"
                  name=""
                  checked={conditionFilters.includes('New With Tags')}
                  id=""
                  readOnly
                />
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleConditionFilters(
                    !conditionFilters.includes('New Without Tags'),
                    'New Without Tags'
                  );
                }}
              >
                <div className="filter-option-design-text">NEW WITHOUT TAGS</div>
                <input
                  type="checkbox"
                  name=""
                  checked={conditionFilters.includes('New Without Tags')}
                  id=""
                  readOnly
                />
              </IonCol>
              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleConditionFilters(!conditionFilters.includes('Immaculate'), 'Immaculate');
                }}
              >
                <div className="filter-option-design-text">IMMACULATE</div>
                <input
                  type="checkbox"
                  name=""
                  checked={conditionFilters.includes('Immaculate')}
                  id=""
                  readOnly
                />
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleConditionFilters(
                    !conditionFilters.includes('Good Condition'),
                    'Good Condition'
                  );
                }}
              >
                <div className="filter-option-design-text">GOOD CONDITION</div>
                <input
                  type="checkbox"
                  name=""
                  checked={conditionFilters.includes('Good Condition')}
                  id=""
                  readOnly
                />
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleConditionFilters(!conditionFilters.includes('Gently Used'), 'Gently Used');
                }}
              >
                <div className="filter-option-design-text">GENTLY USED</div>
                <input
                  type="checkbox"
                  name=""
                  checked={conditionFilters.includes('Gently Used')}
                  id=""
                  readOnly
                />
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleConditionFilters(!conditionFilters.includes('vintage'), 'vintage');
                }}
              >
                <div className="filter-option-design-text">VINTAGE</div>
                <input
                  type="checkbox"
                  name=""
                  checked={conditionFilters.includes('vintage')}
                  id=""
                  readOnly
                />
              </IonCol>
            </>
          )}

          {/* ---------------------COLOR-------------------- */}

          {sortPage === 'color' && (
            <>
              <IonCol size="12" className="filter-title-designer-title-box">
                <div className="filter-title-category-img" onClick={() => setSortPage('default')}>
                  <img height={24} src="assets/images/arrow-left.svg" alt="" />
                </div>
                <div className="filter-title-designer-title">COLOR</div>
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleColorFilters(!colorFilters.includes('Blue'), 'Blue');
                }}
              >
                <div className="filter-option-design-text">BLUE</div>
                <input
                  type="checkbox"
                  name=""
                  checked={colorFilters.includes('Blue')}
                  id=""
                  readOnly
                />
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleColorFilters(!colorFilters.includes('Beige'), 'Beige');
                }}
              >
                <div className="filter-option-design-text">BEIGE</div>
                <input
                  type="checkbox"
                  name=""
                  checked={colorFilters.includes('Beige')}
                  id=""
                  readOnly
                />
              </IonCol>
              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleColorFilters(!colorFilters.includes('Brown'), 'Brown');
                }}
              >
                <div className="filter-option-design-text">BROWN</div>
                <input
                  type="checkbox"
                  name=""
                  checked={colorFilters.includes('Brown')}
                  id=""
                  readOnly
                />
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleColorFilters(!colorFilters.includes('Black'), 'Black');
                }}
              >
                <div className="filter-option-design-text">BLACK</div>
                <input
                  type="checkbox"
                  name=""
                  checked={colorFilters.includes('Black')}
                  id=""
                  readOnly
                />
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleColorFilters(!colorFilters.includes('Yellow'), 'Yellow');
                }}
              >
                <div className="filter-option-design-text">YELLOW</div>
                <input
                  type="checkbox"
                  name=""
                  checked={colorFilters.includes('Yellow')}
                  id=""
                  readOnly
                />
              </IonCol>

              <IonCol
                size="12"
                className="filter-option-design-box"
                onClick={() => {
                  handleColorFilters(!colorFilters.includes('Gold'), 'Gold');
                }}
              >
                <div className="filter-option-design-text">GOLD</div>
                <input
                  style={{ color: 'black' }}
                  type="checkbox"
                  name=""
                  checked={colorFilters.includes('Gold')}
                  id=""
                  readOnly
                />
              </IonCol>
            </>
          )}

          {/* ---------------------SIZE-------------------- */}

          {sortPage === 'size' && (
            <>
              <IonCol size="12" className="filter-title-designer-title-box">
                <div className="filter-title-category-img" onClick={() => setSortPage('default')}>
                  <img height={24} src="assets/images/arrow-left.svg" alt="" />
                </div>
                <div className="filter-title-designer-title">SIZE</div>
              </IonCol>
              <div className="size-height">
                {AllShoesSizes?.map((item, index) => {
                  return (
                    <IonCol
                      key={index}
                      size="12"
                      className="filter-option-design-box"
                      onClick={() => {
                        handleSizeFilters(!sizeFilters.includes(item?.value), item?.value);
                      }}
                    >
                      <div className="filter-option-design-text">{item?.name}</div>
                      <input
                        type="checkbox"
                        name=""
                        checked={sizeFilters.includes(item?.value)}
                        id=""
                        readOnly
                      />
                    </IonCol>
                  );
                })}
              </div>
            </>
          )}

          {/* ---------------------MATERIAL-------------------- */}

          {sortPage === 'material' && (
            <>
              <IonCol size="12" className="filter-title-designer-title-box">
                <div className="filter-title-category-img" onClick={() => setSortPage('default')}>
                  <img height={24} src="assets/images/arrow-left.svg" alt="" />
                </div>
                <div className="filter-title-designer-title">MATERIAL</div>
              </IonCol>
              <div className="size-height">
                {AllMaterials?.map((val, index) => {
                  return (
                    <IonCol
                      key={index}
                      size="12"
                      className="filter-option-design-box"
                      onClick={() => {
                        handleMaterialFilters(!materialFilters.includes(val), val);
                      }}
                    >
                      <div className="filter-option-design-text">{val}</div>
                      <input
                        type="checkbox"
                        name=""
                        checked={materialFilters.includes(val)}
                        id=""
                        readOnly
                      />
                    </IonCol>
                  );
                })}
              </div>
            </>
          )}

          {/* ---------------------SUBCATEGORY-------------------- */}

          {sortPage === 'subCategory' && (
            <>
              <IonCol size="12" className="filter-title-designer-title-box">
                <div className="filter-title-category-img" onClick={() => setSortPage('category')}>
                  <img height={24} src="assets/images/arrow-left.svg" alt="" />
                </div>
                <div className="filter-title-designer-title">BY SUBCATEGORY</div>
              </IonCol>
              <div className="size-height">
                {parentCategoryItems
                  ?.filter(el => el?.parent?._id === categoryItems?._id)
                  ?.map((val, index) => {
                    return (
                      <IonCol
                        key={index}
                        size="12"
                        className="filter-option-design-box"
                        onClick={() => {
                          handleSubCategoryFilters(
                            !subCategoryFilters.includes(val?._id),
                            val?._id
                          );
                        }}
                      >
                        <div className="filter-option-design-text">
                          {val.name.toUpperCase()}
                        </div>
                        <input
                          type="checkbox"
                          name=""
                          checked={subCategoryFilters.includes(val?._id)}
                          id=""
                          readOnly
                        />
                      </IonCol>
                    );
                  })}
              </div>
            </>
          )}
        </IonRow>
      </IonModal>
    </IonPage>
  );
};

export default Explore;
