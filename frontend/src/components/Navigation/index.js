import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id = 'permanentNavBar'>
    <ul>
      <li className='navButtonHome'>
        <NavLink exact to="/">
        <i class="fa-solid fa-house"></i>
        </NavLink>
      </li>
      {isLoaded && (
        <li className='navButtonProfile'>
          <ProfileButton user={sessionUser} />
        </li>
      )}
    </ul>
    </div>
  );
}

export default Navigation;
