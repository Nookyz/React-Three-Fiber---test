import { createSelector, Selector } from 'reselect';
import { State } from '@/store';
import { LoginState } from '@/store/reducers/login';

const selectLogin = (state: State) => state.loginReducer;

export const selectLoginState: Selector<State, LoginState> = createSelector(
  selectLogin,
  (loginState) => loginState,
);

export const selectLoginIsPending: Selector<State, boolean> = createSelector(
  selectLogin,
  ({ isPending }) => isPending,
);

export const selectLoginIsResolved: Selector<State, boolean> = createSelector(
  selectLogin,
  ({ isResolved }) => isResolved,
);

export const selectLoginIsReject: Selector<State, boolean> = createSelector(
  selectLogin,
  ({ isRejected }) => isRejected,
);
