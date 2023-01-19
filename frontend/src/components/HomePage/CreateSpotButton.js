import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import CreateSpotModal from "../CreateSpotModal";


function CreateSpotButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();

    const openMenu = () => {
      if (showMenu) return;
      setShowMenu(true);
    };

    useEffect(() => {
      if (!showMenu) return;

      const closeMenu = (e) => {
        if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
        }
      };

      document.addEventListener('click', closeMenu);

      return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const closeMenu = () => setShowMenu(false);

  return (
    <>
      <button onClick={openMenu}>
      </button>
        {user ? (
            <OpenModalMenuItem
            itemText="Create Spot"
            onItemClick={closeMenu}
            modalComponent={<CreateSpotModal />}
          />
        ) : (
            console.log("error creating spot")
        )}
    </>
  );
}

export default CreateSpotButton;
