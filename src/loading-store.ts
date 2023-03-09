import { BehaviorSubject } from 'rxjs';

export interface LoadingState {
  pendingLoading: number;
}

const loadingInitialState: LoadingState = {
  pendingLoading: 0,
};

let loadingState = loadingInitialState;

const loadingSubject = new BehaviorSubject<LoadingState>(loadingInitialState);

export const loadingStore  = {
  // get the initial/empty state
  initialState: loadingInitialState,
  reset: () => {
    loadingState = loadingInitialState;
    loadingSubject.next(loadingState);
  },

  // subscribe for changes
  subscribe: (setLoadingState: any) => {
    return loadingSubject.subscribe(setLoadingState);
  },

  increment: (loaderName: string = 'unknown') => {
    //console.log('loadingState.increment', loaderName);
    loadingState = {
      pendingLoading: loadingState.pendingLoading + 1,
    };
    loadingSubject.next(loadingState);
  },
  decrement: (loaderName: string = 'unknown') => {
    //console.log('loadingState.decrement', loaderName);
    loadingState = {
      pendingLoading: Math.max(loadingState.pendingLoading - 1, 0),
    };
    loadingSubject.next(loadingState);
  },
};

