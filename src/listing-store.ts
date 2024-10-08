import { BehaviorSubject } from 'rxjs';
import { ItemAttributesWithValues, CreateProductResponse, Category } from './models';

export type TopLevelCategory = 'men' | 'women' | 'Sneakers' | '';

export interface ListingState {
  //id: string;
  price: string;
  estimatedPrice: string;
  itemCategory: TopLevelCategory;
  itemSubcategory: Category | null;
  itemType: Category | null;
  brand: string;
  photos: string[];
  attributes: ItemAttributesWithValues[];
  receiptUrl: string;
  productTitle: string;
  productDescription: string;
  conditionDetails: string[];
  product: CreateProductResponse | null;
}

const listingInitialState: ListingState = {
  //id: '',
  price: '',
  estimatedPrice: '',
  itemCategory: '',
  itemSubcategory: null,
  itemType: null,
  brand: '',
  photos: ['', '', '', ''],
  attributes: [],
  receiptUrl: '',
  productTitle: '',
  productDescription: '',
  conditionDetails: [],
  product: null,
};

let listingState = listingInitialState;
let listingStateUpdating = false;

const listingSubject = new BehaviorSubject<ListingState>(listingInitialState);

export const listingStore = {
  // get the initial/empty state
  initialState: listingInitialState,
  reset: () => {
    listingState = listingInitialState;
    listingSubject.next(listingState);
  },

  // get the current state
  getCurrent: () => {
    return listingState;
  },

  // to be used we updating a number of properties, kind of like a transaction
  beginUpdate: () => {
    listingStateUpdating = true;
  },
  endUpdate: () => {
    listingStateUpdating = false;
    listingSubject.next(listingState);
  },

  // subscribe for changes
  subscribe: (setListingState: any) => {
    return listingSubject.subscribe(setListingState);
  },

  // set properties
  setPrice: (price: string) => {
    listingState = {
      ...listingState,
      price,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setEstimatedPrice: (estimatedPrice: string) => {
    listingState = {
      ...listingState,
      estimatedPrice,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setItemCategory: (itemCategory: TopLevelCategory) => {
    listingState = {
      ...listingState,
      itemCategory,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setItemSubcategory: (itemSubcategory: Category | null) => {
    listingState = {
      ...listingState,
      itemSubcategory,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setItemType: (itemType: Category | null) => {
    listingState = {
      ...listingState,
      itemType,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setBrand: (brand: string) => {
    listingState = {
      ...listingState,
      brand,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setPhotos: (photos: string[]) => {
    listingState = {
      ...listingState,
      photos: [...photos],
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setAttributes: (attributes: ItemAttributesWithValues[]) => {
    listingState = {
      ...listingState,
      attributes: [...attributes],
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setReceiptUrl: (receiptUrl: string) => {
    listingState = {
      ...listingState,
      receiptUrl,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setProductTitle: (productTitle: string) => {
    listingState = {
      ...listingState,
      productTitle,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setProductDescription: (productDescription: string) => {
    listingState = {
      ...listingState,
      productDescription,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setConditionDetails: (conditionDetails: string[]) => {
    listingState = {
      ...listingState,
      conditionDetails: [...conditionDetails],
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setProduct: (product: CreateProductResponse) => {
    listingState = {
      ...listingState,
      product,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
};
