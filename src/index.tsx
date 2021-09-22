import { Provider } from 'mobx-react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/styles.scss';
import './styles/reset.scss';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
