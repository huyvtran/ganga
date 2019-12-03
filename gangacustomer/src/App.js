import React              from 'react';
import axios                  from 'axios';
import Routes from './lib/Routes';
import './root.css';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

axios.defaults.baseURL = 'http://qagangaexpressapi.iassureit.com';

// axios.defaults.baseURL = 'http://uatapi.gangaexpress.in';

axios.defaults.headers.post['Content-Type'] = 'application/json';
function App() {
  return (
    <div className="App">
	   <Routes />
    </div>
  );
}
export default App;
 