import { createStore,combineReducers,applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { Auth } from './auth';
import { Posts } from './posts';
import { composeWithDevTools } from 'redux-devtools-extension';

const composeEnhancers = composeWithDevTools({
    // Specify name here, actionsBlacklist, actionsCreators and other options if needed
  });

export const configureStore = () => {
    const store = createStore(
        combineReducers({
            auth: Auth,
            posts: Posts
        }),
        composeEnhancers(applyMiddleware(thunk))
        
    );

    return store;
}
