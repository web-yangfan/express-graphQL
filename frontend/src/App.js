import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPath from './pages/bookings';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Redirect from="/" to="/auth" exact></Redirect>
        <Route path="/auth" component={ AuthPage }></Route>
        <Route path="/events" component={ EventsPage }></Route>
        <Route path="/bookings" component={ BookingsPath }></Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
