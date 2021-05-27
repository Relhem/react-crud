import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Crud } from './crud.js';
import './index.scss';  

import globalStore from './store';
import { Provider } from 'react-redux';

function App() {
  return Crud();
}

ReactDOM.render(
  <Provider store={globalStore}>
    <App/>
  </Provider>,
  document.getElementById('root')
);
  