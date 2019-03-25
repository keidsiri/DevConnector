import React, { Component } from 'react';
//import {Link} from ''
import {BrowserRouter as Router, Route} from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
//import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Navbar />
          <Route path="/" Component={Landing} />
          <div className="container">
            <Route exact path="/register" Component={Register} />
            <Route exact path="/login" Component={Login} />
          </div>
          <Footer />
        </div>
      </Router>
    );
  }
}
export default App;
