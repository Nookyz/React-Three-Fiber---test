import { createReducerFunction, ImmerReducer } from 'immer-reducer';

export interface LoginState {
  isPending: boolean;
  isResolved: boolean;
  isRejected: boolean;
}

const initialState: LoginState = {
  isPending: false,
  isResolved: false,
  isRejected: false,
};

export class LoginReducer extends ImmerReducer<LoginState> {
  setIsPending() {
    this.draftState.isPending = true;
    this.draftState.isResolved = false;
    this.draftState.isRejected = false;
  }

  setIsResolved() {
    this.draftState.isPending = false;
    this.draftState.isResolved = true;
  }

  setIsRejected() {
    this.draftState.isPending = false;
    this.draftState.isRejected = true;
  }
}

export default createReducerFunction(LoginReducer, initialState);
