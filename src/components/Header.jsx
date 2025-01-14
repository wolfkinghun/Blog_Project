import React, { useState, useContext, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { FaBlog } from "react-icons/fa";
import { RxAvatar } from "react-icons/rx";
import { UserContext } from '../context/UserContext';
import { extractUrlAndId } from '../utility/utils';
import { useTheme } from '../context/ThemeContext';

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logoutUser } = useContext(UserContext);
  const [avatar, setAvatar] = useState(null);
  const { darkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    user?.photoURL && setAvatar(extractUrlAndId(user.photoURL).url);
    !user && setAvatar(null);
  }, [user, user?.photoURL]);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div>
      <Navbar fixed="top" expand="md"
        className={`menu ${darkMode ? 'dark-mode' : 'light-mode'}`}
        style={{ borderBottom: '1px solid gray' }}
      >
        {/* Dark/Light Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          style={{
            position: 'absolute',
            top: '10px', // Positioned closer to the top
            left: '10px', // Positioned closer to the left
            backgroundColor: darkMode ? '#000' : '#fff',
            color: darkMode ? '#fff' : '#000',
            border: '1px solid gray',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s ease, color 0.3s ease',
          }}
        >
          {darkMode ? '🌙 Dark' : '☀️ Light'}
        </button>

        <NavbarBrand href="/"><FaBlog style={{ color: darkMode ? "#fff" : "#000" }} /></NavbarBrand>
        <NavbarToggler onClick={toggle} />
        <Collapse isOpen={isOpen} navbar>
          <Nav className="me-auto" navbar>
            <NavItem>
              <NavLink className="nav-link" to="/" style={{ color: darkMode ? "#fff" : "#000" , marginLeft:"50px"}}>Főoldal</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to="/posts" style={{ color: darkMode ? "#fff" : "#000" }}>Posztok</NavLink>
            </NavItem>
            {user &&
              <NavItem>
                <NavLink className="nav-link" to="/create" style={{ color: darkMode ? "#fff" : "#000" }}>Új bejegyzés</NavLink>
              </NavItem>
            }
          </Nav>
          <Nav navbar>
            {!user ?
              <>
                <NavItem>
                  <NavLink className="nav-link" to="/auth/in" style={{ color: darkMode ? "#fff" : "#000" }}>Belépés</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className="nav-link" to="/auth/up" style={{ color: darkMode ? "#fff" : "#000" }}>Regisztráció</NavLink>
                </NavItem>
              </>
              :
              <>
                <NavItem>
                  <NavLink
                    className="nav-link"
                    to="/"
                    onClick={() => logoutUser()}
                    style={{ color: "red" }}
                  >Kijelentkezés</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    {avatar ? <img className="myavatar" src={avatar} alt="Avatar" /> : <RxAvatar style={{ color: darkMode ? "#fff" : "white" }} />}
                  </DropdownToggle>
                  <DropdownMenu end>
                    <DropdownItem>
                      <NavLink style={{ color: "purple" }} to="/profile">Személyes adatok</NavLink>
                    </DropdownItem>
                    <DropdownItem divider />
                  </DropdownMenu>
                </UncontrolledDropdown>
              </>
            }
          </Nav>
        </Collapse>
      </Navbar>
      <Outlet />
    </div>
  );
};
