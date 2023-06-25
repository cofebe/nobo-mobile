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
import { Brand, Product } from '../models';
import { loadingStore } from '../loading-store';



const Explore: React.FC = () => {
  const productService = new ProductService();
  const userService = new UserService()
  const params: any = useParams();
  const [products, setProducts] = useState<any>([]);
  const [sort, setSort] = useState('date');
  const [sortPage, setSortPage] = useState('default');
  const [brandsItems, setBrandItems] = useState<Brand[]>([]);
  const [brandOption, setBrandOption] = useState<string[]>([])
  const [brandInput, setbrandInput] = useState('')
  const [searchStatus, setSearchStatus] = useState(false)


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

  const handleBrandOption = (brandId: any) => {
    setBrandOption(brandId)

  }

  useIonViewWillEnter(() => {
    getBrands()
    const ionRouterOutlet = document.querySelector('ion-router-outlet') as HTMLElement;
    if (ionRouterOutlet) {
      ionRouterOutlet.style.setProperty('--animation-duration', '0s');
    }
    // console.log('params', params);
  });

  useEffect(() => {
    const product = localStorage.getItem('mainProduct')
    if (params.sectionName === 'explore' && product) {
      setProducts(JSON.parse(product))
    } else if (!product && params.sectionName === 'explore') {
      sortProduct('date')
      // getProducts(params.sectionCategory, 'explore', false);
    }

    if (params.sectionName === 'trade' && product) {
      setProducts(JSON.parse(product))
    } else if (!product && params.sectionName === 'explore') {
      sortProduct('date')

      // getProducts(params.sectionCategory, 'explore', false);
    }

    if (params.sectionName === 'sale' && product) {
      setProducts(JSON.parse(product))
    } else if (!product && params.sectionName === 'explore') {
      sortProduct('date')

      // getProducts(params.sectionCategory, 'explore', false);
    }

    if (params.sectionName === 'shop' && product) {
      setProducts(JSON.parse(product))
    } else if (!product && params.sectionName === 'explore') {
      sortProduct('date')

      // getProducts(params.sectionCategory, 'explore', false);
    }




  }, [params]);


  function getProducts(group: string, action: string, onSale: boolean) {
    productService
      .getProducts(group, action, onSale)

      .then(products => {
        const result = products.docs.sort((a: any, b: any) =>
          new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
        setProducts(result)
        localStorage.setItem('mainProduct', JSON.stringify(result))

      })
      .catch(error => {
        console.log('error', error);
      });
  }


  const sortProduct = (option: string) => {
    localStorage.removeItem('mainProduct')
    getProducts(params.sectionCategory, 'explore', false);

    setTimeout(() => {
      const data = localStorage.getItem('mainProduct')
      if (data) {
        const data2 = JSON.parse(data)

        if (option === 'low') {
          setSort('low')
          const result = data2?.sort((a: any, b: any) => a.price - b.price)
          setProducts(result)
          localStorage.setItem('mainProduct', JSON.stringify(result))
        }

        else if (option === 'high') {
          setSort('high')
          const result = data2?.sort((a: any, b: any) => b.price - a.price)
          setProducts(result)
          localStorage.setItem('mainProduct', JSON.stringify(result))
        }

        else if (option === 'date') {
          setSort('date')
          const result = data2?.sort((a: any, b: any) =>
            new Date(a.createdAt).valueOf() - new Date(b.createdAt).valueOf());
          setProducts(result)
          localStorage.setItem('mainProduct', JSON.stringify(result))
        }

      }
    }, 3000);

  }



  const filterColor = (productColor: string) => {
    localStorage.removeItem('mainProduct')
    getProducts(params.sectionCategory, 'explore', false);

    setTimeout(() => {
      const data = localStorage.getItem('mainProduct')
      if (data) {
        const data2 = JSON.parse(data)
        const colorFilter = data2?.filter((product: Product) =>
          product.attributes.find((p) =>
            p.value.toString().toLowerCase().includes(productColor.toLowerCase())))
        setProducts(colorFilter)
        localStorage.setItem('mainProduct', JSON.stringify(colorFilter))


      }

    }, 3000);

  }


  const filterCategory = (categoryType: string) => {
    localStorage.removeItem('mainProduct')
    getProducts(params.sectionCategory, 'explore', false);

    setTimeout(() => {
      const data = localStorage.getItem('mainProduct')
      if (data) {
        const data2 = JSON.parse(data)
        const categoryFilter = data2?.find((product: Product) =>
          product?.parentCategory?.name?.toLowerCase().includes(categoryType.toLowerCase()))
        if (typeof (categoryFilter) === 'object') {
          const categoryData: any = []
          categoryData.push(categoryFilter)
          setProducts(categoryData)

        }
        else if (typeof (categoryFilter) === 'undefined') {
          const categoryData: any = []
          setProducts(categoryData)
        }
        else {
          setProducts(categoryFilter)
          localStorage.setItem('mainProduct', JSON.stringify(categoryFilter))
        }

      }

    }, 3000);

  }


  const productFilter = (option: string) => {
    // loadingStore.increment('');
    localStorage.removeItem('mainProduct')
    getProducts(params.sectionCategory, 'explore', false);

    setTimeout(() => {
      const data = localStorage.getItem('mainProduct')
      if (data) {
        const data2 = JSON.parse(data)

        // ------------FILTER LOGIC HERE----------------
        if (option === 'no') {
          const tagFilter = data2?.filter((product: Product) =>
            product.tags.length === 0
          );

          setProducts(tagFilter)
          localStorage.setItem('mainProduct', JSON.stringify(tagFilter))

        }

        else if (option === 'yes') {
          const tagFilter = data2?.filter((product: Product) =>
            product.tags.length > 0
          );

          setProducts(tagFilter)
          localStorage.setItem('mainProduct', JSON.stringify(tagFilter))
        }

        else if (option === 'immaculate') {
          const immaculateProduct = data2?.filter((product: Product) =>
            product.attributes.find((p) =>
              p.value.toString().toLowerCase().includes(option.toLowerCase())))
          setProducts(immaculateProduct)
          localStorage.setItem('mainProduct', JSON.stringify(immaculateProduct))
        }

        else if (option === 'good condition') {
          const goodCondition = data2?.filter((product: Product) =>
            product.attributes.find((p) =>
              p.value.toString().toLowerCase().includes(option.toLowerCase())))
          setProducts(goodCondition)
          localStorage.setItem('mainProduct', JSON.stringify(goodCondition))
        }

        else if (option === 'gently used') {
          const gentlyUsed = data2?.filter((product: Product) =>
            product.attributes.find((p) =>
              p.value.toString().toLowerCase().includes(option.toLowerCase())))
          setProducts(gentlyUsed)
          localStorage.setItem('mainProduct', JSON.stringify(gentlyUsed))
        }

        else if (option === 'vintage') {
          const vintageproduct = data2?.filter((product: Product) =>
            product.attributes.find((p) =>
              p.value.toString().toLowerCase().includes(option.toLowerCase())))
          setProducts(vintageproduct)
          localStorage.setItem('mainProduct', JSON.stringify(vintageproduct))
        }

        else if (option === 'no box') {
          const noBoxProduct = data2?.filter((product: Product) =>
            product.attributes.find((p) =>
              p.value.toString().toLowerCase().includes(option.toLowerCase())))
          setProducts(noBoxProduct)
          localStorage.setItem('mainProduct', JSON.stringify(noBoxProduct))
        }

        else if (option === 'box included') {
          const boxIncluded = data2?.filter((product: Product) =>
            product.attributes.find((p) =>
              p.value.toString().toLowerCase().includes(option.toLowerCase())))
          setProducts(boxIncluded)
          localStorage.setItem('mainProduct', JSON.stringify(boxIncluded))
        }

        else {
          // ------------FILTER BRANDS LOGIC HERE----------------
          const brandFilter = data2?.filter((product: any) =>
            product.brand.toLowerCase() === option.toLowerCase()
          );
          setProducts(brandFilter)
          localStorage.setItem('mainProduct', JSON.stringify(brandFilter))
        }


      }

    }, 3000);

  }



  const brandFilter = brandsItems?.filter(brand =>
    brand.name.toLowerCase().includes(brandInput.toLowerCase(), 0)
  );



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
              <IonCol className="small" key={index} size="6">
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
              sortProduct('date')
              setTimeout(() => {
                modal.current?.dismiss()
              }, 3000);
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
              sortProduct('high')
              setTimeout(() => {
                modal.current?.dismiss()
              }, 3000);
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
              sortProduct('low')
              setTimeout(() => {
                modal.current?.dismiss()
              }, 3000);
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
        sortPage == 'condition' ?
          'explore-main-filter-modal2'
          : 'explore-main-filter-modal'
      }
        ref={filterModal} initialBreakpoint={1} breakpoints={[1, 5]}
      >
        <IonRow className='explore-modal-filter-container'>
          {sortPage === 'default' && (<>
            <IonCol size='12' className="filter-option-title-box">
              <div className="filter-option-title">FILTER</div>
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
                handleBrandOption('box included')
                productFilter('box included')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <div className="filter-option-text">BOX INCLUDED</div>
              <input
                type="radio"
                name=""
                checked={brandOption.includes('box included')} id=""
                readOnly
              />
            </IonCol>

            <IonCol
              size='12' className='filter-option-box'
              onClick={() => {
                handleBrandOption('no box')
                productFilter('no box')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <div className="filter-option-text">NOT INCLUDED</div>
              <input
                type="radio"
                name=""
                checked={brandOption.includes('no box')} id=""
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
                  localStorage.removeItem('mainProduct')
                  getProducts(params.sectionCategory, 'explore', false);
                }}
              >
                <img
                  height={24}
                  src='assets/images/arrow-left.svg' alt="" />
              </div>

              <div className="filter-title-category-title">BY CATEGORY</div>
            </IonCol>
            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('bags')
                filterCategory('bag')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'bags' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>BAGS</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('shoes')
                filterCategory('shoes')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'shoes' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>SHOES</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('accessories')
                filterCategory('accessories')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'accessories' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>ACCESSORIES</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('clothing')
                filterCategory('clothing')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'clothing' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>CLOTHING</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('tops')
                filterCategory('tops')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'tops' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>TOPS</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('dresses')
                filterCategory('dresses')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'dresses' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>DRESSES</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('outwear')
                filterCategory('outerwear')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'outwear' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>OUTWEAR</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('swims')
                filterCategory('swims')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'swims' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>SWIMS</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('bottoms')
                filterCategory('bottoms')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'bottoms' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>BOTTOMS</p>
            </IonCol>

            <IonCol size='12' className="filter-title-category-box"
              onClick={() => {
                setSort('jeans')
                filterCategory('jeans')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'jeans' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }>JEANS</p>
            </IonCol>

            <IonCol size='12'
              className='filter-title-category-box'
              onClick={() => {
                setSort('suiting')
                filterCategory('suiting')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);

              }}
            >
              <p
                className={
                  sort === 'suiting' ?
                    'filter-title-category-option-active'
                    : 'filter-title-category-option'
                }
              >SUITING</p>
            </IonCol>
          </>)}

          {/* ---------------------DESIGNER-------------------- */}

          {sortPage === 'designer' && (<>
            <IonCol size='12' className='filter-title-designer-title-box'>
              <div className="filter-title-category-img"
                onClick={() => {
                  setSortPage('default')
                  localStorage.removeItem('mainProduct')
                  getProducts(params.sectionCategory, 'explore', false);
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
                    handleBrandOption(brand._id)
                    productFilter(brand.name)
                    setTimeout(() => {
                      filterModal.current?.dismiss()
                    }, 3000);

                  }}
                >
                  <div className="filter-option-design-text">{brand.name}</div>
                  <input onChange={() => {
                  }} type="radio" name="" checked={brandOption.includes(brand._id, 0)} id="" />
                </IonCol>
              ))}
            </div>

          </>)}

          {/* ---------------------CONDITION-------------------- */}

          {sortPage === 'condition' && (<>
            <IonCol size='12' className='filter-title-designer-title-box'>
              <div className="filter-title-category-img"
                onClick={() => {
                  localStorage.removeItem('mainProduct')
                  getProducts(params.sectionCategory, 'explore', false);
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
                productFilter('yes')
                handleBrandOption('withTags')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">NEW WITH TAGS</div>
              <input
                type="radio"
                name=""
                checked={brandOption.includes('withTags')} id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                productFilter('no')
                handleBrandOption('noTags')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">NEW WITHOUT TAGS</div>
              <input
                type="radio"
                name=""
                checked={brandOption.includes('noTags')} id=""
                readOnly
              />

            </IonCol>
            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                productFilter('immaculate')
                handleBrandOption('immaculate')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">IMMACULATE</div>
              <input
                type="radio"
                name=""
                checked={brandOption.includes('immaculate')} id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                productFilter('good condition')
                handleBrandOption('good condition')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">GOOD CONDITION</div>
              <input
                type="radio"
                name=""
                checked={brandOption.includes('good condition')} id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                productFilter('gently used')
                handleBrandOption('gently used')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">GENTLY USED</div>
              <input
                type="radio"
                name=""
                checked={brandOption.includes('gently used')} id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                productFilter('vintage')
                handleBrandOption('vintage')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">VINTAGE</div>
              <input
                type="radio"
                name=""
                checked={brandOption.includes('vintage')} id=""
                readOnly
              />
            </IonCol>


          </>)}

          {/* ---------------------COLOR-------------------- */}

          {sortPage === 'color' && (<>
            <IonCol size='12' className='filter-title-designer-title-box'>
              <div className="filter-title-category-img"
                onClick={() => {
                  localStorage.removeItem('mainProduct')
                  getProducts(params.sectionCategory, 'explore', false);
                  setSortPage('default')
                }}
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
                handleBrandOption('blue')
                filterColor('blue')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">BLUE</div>
              <input
                type="radio" name=""
                checked={brandOption.includes('blue')}
                id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleBrandOption('beige')
                filterColor('beige')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">BEIGE</div>
              <input
                type="radio" name=""
                checked={brandOption.includes('beige')}
                id=""
                readOnly
              />
            </IonCol>
            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleBrandOption('brown')
                filterColor('brown')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">BROWN</div>
              <input
                type="radio" name=""
                checked={brandOption.includes('brown')}
                id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleBrandOption('black')
                filterColor('black')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}

            >
              <div className="filter-option-design-text">BLACK</div>
              <input
                type="radio" name=""
                checked={brandOption.includes('black')}
                id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleBrandOption('yellow')
                filterColor('yellow')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">YELLOW</div>
              <input
                type="radio" name=""
                checked={brandOption.includes('yellow')}
                id=""
                readOnly
              />
            </IonCol>

            <IonCol size='12'
              className='filter-option-design-box'
              onClick={() => {
                handleBrandOption('gold')
                filterColor('gold')
                setTimeout(() => {
                  filterModal.current?.dismiss()
                }, 3000);
              }}
            >
              <div className="filter-option-design-text">GOLD</div>
              <input
                style={{ color: 'black' }}
                type="radio" name=""
                checked={brandOption.includes('gold')}
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
