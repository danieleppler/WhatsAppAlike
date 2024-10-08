
import {combineReducers} from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage'
import Reducer from './rootRedcuer'
import {persistStore,persistReducer} from 'redux-persist'
import { legacy_createStore as createStore } from 'redux';


const persistConfig = {
    key:"root", 
    storage
}

const persistedReducer = persistReducer(persistConfig,Reducer)

const roortReducer = combineReducers({root:persistedReducer}) // maybe optional

export const store = createStore(roortReducer)
export const persistor = persistStore(store)