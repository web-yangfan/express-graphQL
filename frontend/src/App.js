import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPath from './pages/bookings';
import MainNavigation from './components/Navigation/MainNavigation';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <MainNavigation />
      <main className="main-content">  
        <Switch>
          <Redirect from="/" to="/auth" exact></Redirect>
          <Route path="/auth" component={ AuthPage }></Route>
          <Route path="/events" component={ EventsPage }></Route>
          <Route path="/bookings" component={ BookingsPath }></Route>
        </Switch>
      </main>
      
    </BrowserRouter>
  );
}

export default App;
