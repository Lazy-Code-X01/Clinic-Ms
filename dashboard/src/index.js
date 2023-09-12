import ReactDOM from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import { Provider } from 'react-redux';
import store from './store';
//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <HelmetProvider>
    <BrowserRouter>
    <Provider store={store}>
        <App />
    </Provider>
      </BrowserRouter>
    </HelmetProvider>
);

serviceWorker.unregister();

reportWebVitals();