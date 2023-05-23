import { BehaviorSubject } from 'rxjs';
import { ItemAttributesWithValues } from './models';

export interface ListingState {
  //id: string;
  price: number | null;
  itemCategory: string;
  itemSubcategory: string;
  itemType: string;
  brand: string;
  photos: string[];
  attributes: ItemAttributesWithValues[];
  conditionDetails: string[];
}

const listingInitialState: ListingState = {
  //id: '',
  price: null,
  itemCategory: '',
  itemSubcategory: '',
  itemType: '',
  brand: '',
  photos: ['', '', '', ''],
  attributes: [],
  conditionDetails: [],
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
  setPrice: (price: number | null) => {
    listingState = {
      ...listingState,
      price,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setItemCategory: (itemCategory: string) => {
    listingState = {
      ...listingState,
      itemCategory,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setItemSubcategory: (itemSubcategory: string) => {
    listingState = {
      ...listingState,
      itemSubcategory,
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
  setItemType: (itemType: string) => {
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
  setConditionDetails: (conditionDetails: string[]) => {
    listingState = {
      ...listingState,
      conditionDetails: [...conditionDetails],
    };
    if (!listingStateUpdating) {
      listingSubject.next(listingState);
    }
  },
};
