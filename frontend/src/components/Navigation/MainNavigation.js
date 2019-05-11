import React from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

import './MainNavigation.css';

const mainNavigation = props => (
  <AuthContext.Consumer>
    {/*
     这里的 context 是App.js文件中 AuthContext.Provider组件传过来的值 
     */}
    {(context) => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo"> 
            <h1>简单的事件</h1>
          </div>
          <nav className="main-navigation__items">
            <ul>
              { !context.token && (<li><NavLink to="/auth">登陆</NavLink></li>) }
              <li>
                <NavLink to="/events">事件</NavLink>
              </li>
              { context.token && (
                <React.Fragment>
                  <li><NavLink to="/bookings">预定</NavLink></li>
                  <li><button onClick={ context.logout }>退出</button></li>
                </React.Fragment>
                
              )}
            </ul>
          </nav>
        </header>
      )
    }}
    
  </AuthContext.Consumer>
 );

export default mainNavigation;