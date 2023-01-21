import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreateSpotModal from "../CreateSpotModal";
import OpenModalButton from '../OpenModalButton';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div id = 'permanentNavBar'>
          <NavLink exact to="/">
        <div id="house-breeze">
        <i class="fa-solid fa-wind"></i>
          <h1>BreezeBnB</h1>
        </div>
          </NavLink>
      <div id="nav-buttons">
        <OpenModalButton className='navButtonHome'
              //   onItemClick={closeMenu}
                buttonText={'BreezeBnB your home'}
                modalComponent={<CreateSpotModal />}
           />
        {isLoaded && (
            <ul>
          <li className='navButtonProfile'>
            <ProfileButton user={sessionUser} />
          </li>
            </ul>
        )}
      </div>
    </div>
  );
}

export default Navigation;
