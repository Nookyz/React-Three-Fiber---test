import { createActionCreators } from 'immer-reducer';
import { LoginReducer } from '@/store/reducers/login';
import { AsyncAction } from './common';

export const loginActions = createActionCreators(LoginReducer);

export type LoginActions =
  | ReturnType<typeof loginActions.setIsPending>
  | ReturnType<typeof loginActions.setIsResolved>
  | ReturnType<typeof loginActions.setIsRejected>;

export const authRestoreAsync = (): AsyncAction => async (dispatch) => {
  try {
    dispatch(loginActions.setIsPending());

    dispatch(loginActions.setIsResolved());
  } catch (e) {
    dispatch(loginActions.setIsRejected());
  }
};
