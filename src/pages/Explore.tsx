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
  const userService = new UserService()
  const params: any = useParams();
  const [products, setProducts] = useState<any>([]);
  const [sort, setSort] = useState('date');
  const [sortPage, setSortPage] = useState('default');
  const [brandsItems, setBrandItems] = useState<Brand[]>([]);
  const [categoryItems, setCategoryItems] = useState<Category[]>([]);
  const [brandInput, setbrandInput] = useState('');
  const [categoryFilters, setCategoryFilters] = useState<String>('');
  const [designerFilters, setDesignerFilters] = useState<String[]>([]);
  const [conditionFilters, setConditionFilters] = useState<String[]>([]);
  const [colorFilters, setColorFilters] = useState<String[]>([]);
  const [boxFilters, setBoxFilters] = useState<String[]>([]);


  const modal = useRef<HTMLIonModalElement>(null)
  const filterModal = useRef<HTMLIonModalElement>(null)

  const getBrands = () => {
    userService
      .getBrands()
      .then(brands => {
        setBrandItems(brands)
      })
      .catch(error => {
        console.log('err, ', error);
      });
  }

  const getCategories = () => {
    productService
      .getCategories()
      .then(categories => {
        setCategoryItems(categories.docs.filter((el)=> el.parent === null))
      })
      .catch(error => {
        console.log('err, ', error);
      });
  }

  useIonViewWillEnter(() => {
    getBrands();
    getCategories();
    getProducts(params.sectionCategory, getAction(),  params.sectionName === 'sell', generateParams());
    const ionRouterOutlet = document.querySelector('ion-router-outlet') as HTMLElement;
    if (ionRouterOutlet) {
      ionRouterOutlet.style.setProperty('--animation-duration', '0s');
    }
  });

  const getSort = () => {
    if (sort === 'date') {
      return {
        createdAt: -1
      }
    }
    if (sort === 'high') {
      return {
        price: -1
      }
    }
    if (sort === 'low') {
      return {
        price: 1
      }
    }
  }

  function getProducts(group: string, action: string, onSale: boolean, filters?: any) {
    productService
      .getProducts(group, action, onSale, getSort(), filters)
      .then(products => {
        setProducts(products.docs)
      })
      .catch(error => {
        console.log('error', error);
      });
  }

  const reset = () => {
    if (params.sectionName === 'sale') {
      getProducts(params.sectionCategory, 'sell', true);
    }
    else if (params.sectionName === 'shop') {
      getProducts(params.sectionCategory, 'sell', false);
    }
    else {
      getProducts(params.sectionCategory, `${params.sectionName}`, false);
    }

    setSort('')
    setCategoryFilters('');
    setDesignerFilters([]);
    setConditionFilters([]);
    setColorFilters([]);
    setBoxFilters([]);
    closeFilterModal();
  }


  const closeFilterModal = () => {
    setTimeout(() => {
      filterModal.current?.dismiss()
    }, 1000);
  }

  const brandFilter = brandsItems?.filter(brand =>
    brand.name.toLowerCase().includes(brandInput.toLowerCase(), 0)
  );

  const handleConditionFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setConditionFilters([...conditionFilters, value])
    } else {
      setConditionFilters([...conditionFilters.filter((el) => el !== value)])
    }
    closeFilterModal();
  }

  const handleColorFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setColorFilters([...colorFilters, value])
    } else {
      setColorFilters([...colorFilters.filter((el) => el !== value)])
    }
    closeFilterModal();
  }

  const handleDesignerFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setDesignerFilters([...designerFilters, value])
    } else {
      setDesignerFilters([...designerFilters.filter((el) => el !== value)])
    }
    closeFilterModal();
  }

  const handleCategoryFilters = (value: String) => {
      setCategoryFilters(value)
      closeFilterModal();
  }

  const handleBoxFilters = (checked: Boolean, value: String) => {
    if (checked) {
      setBoxFilters([...boxFilters, value])
    } else {
      setBoxFilters([...boxFilters.filter((el) => el !== value)])
    }
    closeFilterModal();
  }

  const generateParams = () => {
    const category = categoryItems.find((el) => el.name.toUpperCase() === categoryFilters.toUpperCase() || el.name.toUpperCase() === `${categoryFilters} [${params.sectionCategory.toUpperCase()}]`)
    return {
      ...(category && { parentCategory: category?._id }),
      ...((boxFilters.length > 0 || conditionFilters.length > 0 || colorFilters.length > 0 || designerFilters.length > 0) && { attributes: {
          ...(boxFilters.length > 0 && { box: boxFilters }),
          ...(conditionFilters.length > 0 && { condition: conditionFilters }),
          ...(colorFilters.length > 0 && { color: colorFilters }),
          ...(designerFilters.length > 0 && { brand: {
              $in: designerFilters,
            }
          }),
        }
      }),
    };
  }

  const getAction = () => {
    if (params.sectionName === 'shop' || params.sectionName === 'sale' || params.sectionName === 'explore') {
      return 'sell';
    }
    return params.sectionName;
  }

  useEffect(()=> {
    getProducts(params.sectionCategory, getAction(),  params.sectionName === 'shop', generateParams());
  }, [categoryFilters, designerFilters, conditionFilters, colorFilters, boxFilters, params.sectionName, sort]);

  return (
    <IonPage className="nobo-explore-page">
      <ExploreHeader />
      <div className='explore-sort-container'>
        <div
          onClick={() => {
            filterModal.current?.present()
          }}
        >
          <img height={18} src='assets/images/home-filter.svg' alt="" />

        </div>
        <div className="explore-sort-box"
          onClick={() => {
            modal.current?.present()
          }}
        >
          <img height={18} src='assets/images/home-sort.svg' alt="" />

        </div>
      </div>
      {products.length === 0 && (<div className='home-search-status'>NO RESULT FOUND!</div>)}
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
      <IonModal className='explore-main-modal' ref={modal} initialBreakpoint={1} breakpoints={[1, 5]}>
        <IonRow className='explore-modal-container'>

          <IonCol size='12' className='explore-modal-title-box'>
            <p className='explore-modal-title-text'>SORT BY</p>
          </IonCol>
          <IonCol size='12' className='explore-modal-listed-box'
            onClick={() => {
              setSort('date')
              setTimeout(() => {
                modal.current?.dismiss()
              }, 1000);
            }}
          >
            <p
              className={
                sort === 'date' ? 'explore-modal-listed-text-date'
                  : 'explore-modal-listed-text'}
            >
              JUST LISTED
            </p>
          </IonCol>

          <IonCol size='12' className='explore-modal-listed-box'
            onClick={() => {
              setSort('high')
              setTimeout(() => {
                modal.current?.dismiss()
              }, 1000);
            }}
          >
            <p
              className={
                sort === 'high' ? 'explore-modal-listed-text-high'
                  : 'explore-modal-listed-text'}>
              HIGH TO LOW
            </p>
          </IonCol>

          <IonCol size='12' className='explore-modal-listed-box'
            onClick={() => {
              setSort('low')
              setTimeout(() => {
                modal.current?.dismiss()
              }, 1000);
            }}
          >
            <p
              className={
                sort === 'low' ? 'explore-modal-listed-text-low'
                  : 'explore-modal-listed-text'}
            >LOW TO HIGH</p>
          </IonCol>


        </IonRow>
      </IonModal>

      {/* ---------------------FILTER OPTION-------------------- */}

      <IonModal className={
        sortPage === 'color' ?
          'explore-main-filter-modal2'
          : sortPage === 'condition' ?
            'explore-main-filter-modal2'
            : 'explore-main-filter-modal'
      }
        ref={filterModal} initialBreakpoint={1} breakpoints={[1, 5]}
      >
        <IonRow className='explore-modal-filter-container'>
          {sortPage === 'default' && (<>
            <IonCol size='12' className="filter-option-title-box">
              <div className="filter-option-title"></div>
              <div className="filter-option-title"
                style={{ marginLeft: '50px' }}
              >FILTER</div>
              <div
                style={{ color: '#D6980E' }}
                className="filter-option-title"
                onClick={() => {
                  reset()
                }}
              >Reset</div>
            </IonCol>
            <IonCol size='12' className='filter-option-box'
              onClick={() => setSortPage('category')}
            >
              <div className="filter-option-text">CATEGORY</div>
              <img className="filter-option-img-arrow" src='assets/images/arrow-right.svg' alt="" />
            </IonCol>

            <div className='filter-line-sep'></div>

            <IonCol size='12' className='filter-option-box'
              onClick={() => setSortPage('designer')}
            >
              <div className="filter-option-text">DESIGNER</div>
              <img className="filter-option-img-arrow" src='assets/images/arrow-right.svg' alt="" />
            </IonCol>

            <div className='filter-line-sep'></div>

            <IonCol size='12' className='filter-option-box'
              onClick={() => setSortPage('condition')}
            >
              <div className="filter-option-text">CONDITION</div>
              <img className="filter-option-img-arrow" src='assets/images/arrow-right.svg' alt="" />
            </IonCol>

            <div className='filter-line-sep'></div>

            <IonCol size='12' className='filter-option-box'
              onClick={() => setSortPage('color')}
            >
              <div className="filter-option-text">COLOR</div>
              <img className="filter-option-img-arrow" src='assets/images/arrow-right.svg' alt="" />
            </IonCol>

            <div className='filter-line-sep'></div>

            <IonCol size='12' className='filter-option-box'>
              <div className="filter-option-text">BOXING</div>
            </IonCol>

            <IonCol size='12' className='filter-option-box'
              onClick={() => {
                handleBoxFilters(!boxFilters.includes('box included'), 'box included')
              }}
            >
              <div className="filter-option-text">BOX INCLUDED</div>
              <input
                type="checkbox"
                name=""
                checked={boxFilters.includes('box included')} id=""
                readOnly
              />
            </IonCol>

            <IonCol
              size='12' className='filter-option-box'
              onClick={() => {
                handleBoxFilters(!boxFilters.includes('no box'), 'no box')
              }}
            >
              <div className="filter-option-text">NOT INCLUDED</div>
              <input
                type="checkbox"
                name=""
                checked={boxFilters.includes('no box')} id=""
                readOnly
              />

            </IonCol>
          </>)}


          {/* ---------------------CATEGORY-------------------- */}


          {sortPage === 'category' && (<>
            <IonCol size='12' className='filter-title-category-title-box'>
              <div className="filter-title-category-img"
                onClick={() => {
                  setSortPage('default')
                }}
              >
                <img
                  height={24}
                  src='assets/images/arrow-left.svg' alt="" />
              </div>

              <div className="filter-title-category-title">BY CATEGORY</div>
            </IonCol>

              {categoryItems?.map((category) => {
                  return (
                    <IonCol size='12' key={category._id} className="filter-title-category-box"
                      onClick={() => {
                        handleCategoryFilters(category.name.toLowerCase())
                      }}
                    >
                      <p
                        className={
                          categoryFilters === category.name.toLowerCase() ?
                            'filter-title-category-option-active'
                            : 'filter-title-category-option'
                        }>{category.name.toUpperCase().split(' ')[0]}</p>
                    </IonCol>
                  )
                }
              )}
          </>)}

          {/* ---------------------DESIGNER-------------------- */}

          {sortPage === 'designer' && (<>
            <IonCol size='12' className='filter-title-designer-title-box'>
              <div className="filter-title-category-img"
                onClick={() => {
                  setSortPage('default')
                }}
              >
                <img
                  height={24}
                  src='assets/images/arrow-left.svg' alt="" />
              </div>
              <div className="filter-title-designer-title">BY DESIGNER</div>
            </IonCol>
            <IonCol size='12' className='filter-input-box'>
              <Input
                className='filter-input'
                placeholder='SEARCH'
                value={brandInput}
                onChange={(val) => {
                  setbrandInput(val)
                }}
              ></Input>
            </IonCol>
            <div className='test'>
              {brandFilter?.map((brand) => (
                <IonCol size='12'
                  key={brand._id}
                  className='filter-option-design-box'
                  onClick={() => {
                    handleDesignerFilters(!designerFilters.includes(brand._id), brand._id)
                  }}
                >
                  <div className="filter-option-design-text">{brand.name}</div>
                  <input onChange={() => {
                  }} type="checkbox" name="" checked={designerFilters.includes(brand._id)} id="" />
                </IonCol>
              ))}
            </div>

          </>)}

          {/* ---------------------CONDITION-------------------- */}

          {sortPage === 'condition' && (<>
            <IonCol size='12' className='filter-title-designer-title-box'>
              <div className="filter-title-category-img"
                onClick={() => {
                  setSortPage('default')
                }}
              >
                <img
                  height={24}
                  src='assets/images/arrow-left.svg' alt="" />
              </div>
              <div className="filter-title-designer-title">BY CONDITION</div>
            </IonCol>


            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleConditionFilters(!conditionFilters.includes('withTags'), 'withTags')
              }}
            >
              <div className="filter-option-design-text">NEW WITH TAGS</div>
              <input
                type="checkbox"
                name=""
                checked={conditionFilters.includes('withTags')} id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleConditionFilters(!conditionFilters.includes('noTags'), 'noTags')
              }}
            >
              <div className="filter-option-design-text">NEW WITHOUT TAGS</div>
              <input
                type="checkbox"
                name=""
                checked={conditionFilters.includes('noTags')} id=""
                readOnly
              />

            </IonCol>
            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleConditionFilters(!conditionFilters.includes('immaculate'), 'immaculate')
              }}
            >
              <div className="filter-option-design-text">IMMACULATE</div>
              <input
                type="checkbox"
                name=""
                checked={conditionFilters.includes('immaculate')} id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleConditionFilters(!conditionFilters.includes('good condition'), 'good condition')
              }}
            >
              <div className="filter-option-design-text">GOOD CONDITION</div>
              <input
                type="checkbox"
                name=""
                checked={conditionFilters.includes('good condition')} id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleConditionFilters(!conditionFilters.includes('gently used'), 'gently used')
              }}
            >
              <div className="filter-option-design-text">GENTLY USED</div>
              <input
                type="checkbox"
                name=""
                checked={conditionFilters.includes('gently used')} id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleConditionFilters(!conditionFilters.includes('vintage'), 'vintage')
              }}
            >
              <div className="filter-option-design-text">VINTAGE</div>
              <input
                type="checkbox"
                name=""
                checked={conditionFilters.includes('vintage')} id=""
                readOnly
              />
            </IonCol>


          </>)}

          {/* ---------------------COLOR-------------------- */}

          {sortPage === 'color' && (<>
            <IonCol size='12' className='filter-title-designer-title-box'>
              <div className="filter-title-category-img"
                onClick={() => setSortPage('default')}
              >
                <img
                  height={24}
                  src='assets/images/arrow-left.svg' alt="" />
              </div>
              <div className="filter-title-designer-title">COLOR</div>
            </IonCol>


            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleColorFilters(!colorFilters.includes('blue'), 'blue')
              }}
            >
              <div className="filter-option-design-text">BLUE</div>
              <input
                type="checkbox" name=""
                checked={colorFilters.includes('blue')}
                id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleColorFilters(!colorFilters.includes('beige'), 'beige')
              }}
            >
              <div className="filter-option-design-text">BEIGE</div>
              <input
                type="checkbox" name=""
                checked={colorFilters.includes('beige')}
                id=""
                readOnly
              />
            </IonCol>
            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleColorFilters(!colorFilters.includes('brown'), 'brown')
              }}
            >
              <div className="filter-option-design-text">BROWN</div>
              <input
                type="checkbox" name=""
                checked={colorFilters.includes('brown')}
                id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleColorFilters(!colorFilters.includes('black'), 'black')
              }}

            >
              <div className="filter-option-design-text">BLACK</div>
              <input
                type="checkbox" name=""
                checked={colorFilters.includes('black')}
                id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleColorFilters(!colorFilters.includes('yellow'), 'yellow')
              }}
            >
              <div className="filter-option-design-text">YELLOW</div>
              <input
                type="checkbox" name=""
                checked={colorFilters.includes('yellow')}
                id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleColorFilters(!colorFilters.includes('gold'), 'gold')
              }}
            >
              <div className="filter-option-design-text">GOLD</div>
              <input
                style={{ color: 'black' }}
                type="checkbox" name=""
                checked={colorFilters.includes('gold')}
                id=""
                readOnly
              />
            </IonCol>


          </>)}

        </IonRow>
      </IonModal>


    </IonPage>
  );
};

export default Explore;
