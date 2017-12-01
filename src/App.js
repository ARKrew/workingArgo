import React, { Component } from 'react';
import { Provider, connect } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import { addNavigationHelpers } from 'react-navigation';
import reducers from './reducers';
import { AppNavigator } from './AppNavigator';

const App = ({ dispatch, nav }) => (
    <AppNavigator
        screenProps={{ headerStyle: styles.headerStyle }}
        navigation={addNavigationHelpers({ dispatch, state: nav })}
    />
);

const AppWithNavigationState = connect(() => ({ nav }) => ({ nav }))(App);
const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

class NavigationalApp extends Component {
  componentWillMount() {
    const firebaseConfig = {
      apiKey: 'AIzaSyCUGO1U43_sMeTlVm9nl7ytwcILcrFsjOg',
      authDomain: 'argo-4cbff.firebaseapp.com',
      databaseURL: 'https://argo-4cbff.firebaseio.com',
      projectId: 'argo-4cbff',
      storageBucket: 'argo-4cbff.appspot.com',
      messagingSenderId: '246167725320'
    };

    firebase.initializeApp(firebaseConfig);
  }

  render() {
    return (
      <Provider store={store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}

const styles = {
    headerStyle: {
        backgroundColor: '#fff',
    },
};

export default NavigationalApp;
