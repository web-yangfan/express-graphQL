import React from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css';

const mainNavigation = props => (
  <header className="main-navigation">
    <div className="main-navigation__logo"> 
      <h1>简单的事件</h1>
    </div>
    <nav className="main-navigation__items">
      <ul>
        <li>
          <NavLink to="/auth">进行身份验证</NavLink>
        </li>
        <li>
          <NavLink to="/events">事件</NavLink>
        </li>
        <li>
          <NavLink to="/bookings">预定</NavLink>
        </li>
      </ul>
    </nav>
  </header>
 );

export default mainNavigation;