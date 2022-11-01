import { createReducer } from '@reduxjs/toolkit'
import { setType } from './actions';

export interface NetWorkTypeState {
    readonly type: string;
}

const initialState: NetWorkTypeState = {
    type: 'APTOS'
}

export default createReducer(initialState, (builder) =>
    builder
        .addCase(setType, (state, action) => {
            state.type = action.payload.key;
        })
)