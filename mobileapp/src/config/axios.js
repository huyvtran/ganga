import axios from 'axios';

var instance = axios.create();

// instance.defaults.baseURL    = 'http://uatapi.coffic.com/';

// instance.defaults.baseURL = 'http://cofficapi.iassureit.com/';


instance.defaults.baseURL = 'http://192.168.2.22:5012/';


// instance.defaults.timeout = 20000;

//...
//and other options

export default instance;