import { ThunkAction } from 'redux-thunk';
import { State, Actions } from '@/store';

export type AsyncAction<R = void> = ThunkAction<R, State, {}, Actions>;
