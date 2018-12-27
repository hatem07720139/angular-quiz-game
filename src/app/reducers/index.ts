import { routerReducer } from '@ngrx/router-store';
import { ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';
import { questionsReducer } from '../components/questions/questions.reducer';

// TODO: type state
// tslint:disable-next-line:no-empty-interface
export interface State {}

export const reducers: ActionReducerMap<State> = {
  router: routerReducer,
  questions: questionsReducer
};

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    console.log('state', state);
    console.log('action', action);

    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? [debug, storeFreeze]
  : [];
