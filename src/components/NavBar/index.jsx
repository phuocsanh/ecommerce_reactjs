import React, { useEffect, useState } from "react";
import { FaOutdent, FaRegWindowClose } from "react-icons/fa";
import "./NavBar.css";
import { Button } from "../Button/Button";
import { useSelector, useDispatch } from "react-redux";
import ModalSignInOrSignUp from "../ModalSignInOrSignUp";
import { getCurrentUser } from "../../constant/commonFuntions";
import { usersSlice } from "../../redux/reducers/usersSlice";
import { appsSlice } from "../../redux/reducers/appsSlice";
import cart from "../../assets/image/cart.png";
import shopIcon from "../../assets/image/shopIcon.png";
import { auth } from "../../config/ConfigFireBase";
import CartModal from "../CartModal";

export default function NavBar() {
  const [userIsLogin, setUserIsLogin] = useState(null);

  const menuItems = [
    {
      title: "Admin",
      url: "/admin",
      cName: "nav-links",
      isClone:
        userIsLogin?.role == "admin" ? true : !userIsLogin ? false : null,
    },
    {
      title: "Home",
      url: "/",
      cName: "nav-links",
      isClone: true,
    },
    {
      title: "Contact",
      url: "/contact",
      cName: "nav-links",
      isClone: true,
    },
    {
      title: "News",
      url: "/news",
      cName: "nav-links",
      isClone: true,
    },
    {
      title: "SignIn",
      url: "",
      cName: "nav-links-mobile",
      isClone: true,
    },
    {
      title: "SignUp",
      url: "",
      cName: "nav-links-mobile",
      isClone: true,
    },
  ];

  const user = useSelector((state) => state.users.userIsLogin);
  const [click, setClick] = useState(false);
  const isModal = useSelector((state) => state.apps.isModal);
  const open = useSelector((state) => state.apps.open);
  const numProductsCart = useSelector((state) => state.apps.numProductsCart);
  const [openCart, setOpenCart] = useState(false);

  const dispatch = useDispatch();
  const setIsModal = (isModal) => {
    dispatch(appsSlice.actions.setIsModal(isModal));
  };
  const setOpen = (open) => {
    dispatch(appsSlice.actions.setOpen(open));
  };

  useEffect(() => {
    getCurrentUser(user, setUserIsLogin);
    getUserUid();
  }, [user]);
  const getUserUid = () => {
    if (user) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          dispatch(usersSlice.actions.setUserUid(user?.uid));
        }
      });
    } else {
      dispatch(usersSlice.actions.setUserUid(null));
    }
  };

  const handleClick = () => {
    setClick(!click);
  };
  const logOut = () => {
    dispatch(usersSlice.actions.setUserIsLogin(null));
    dispatch(usersSlice.actions.setUserUid(null));
    setUserIsLogin(null);
    localStorage.clear();
  };

  return (
    <>
      <nav className="NavbarItems">
        <div className="div-logo">
          <img className="img-shop" src={shopIcon} />
          <span
            style={{
              color: "white",
              fontFamily: "-moz-initial",
              fontWeight: "revert-layer",
            }}
          >
            ST Shop
          </span>
        </div>

        <div className="menu-icon" onClick={handleClick}>
          {!click ? (
            <FaOutdent size={22} style={{ color: "white" }} />
          ) : (
            <FaRegWindowClose size={22} style={{ color: "white" }} />
          )}
        </div>
        <div className={click ? "nav-menu active" : "nav-menu"}>
          {menuItems.map((item, idex) => {
            return item.isClone ? (
              <li key={idex}>
                <a href={item.url} className={item.cName}>
                  {item.title}
                </a>
              </li>
            ) : (
              ""
            );
          })}
        </div>
        {userIsLogin && (
          <div className="info-and-cart">
            <span>{userIsLogin?.userName}</span>
            <div
              className="cart"
              onClick={() => {
                setOpenCart(true);
              }}
            >
              <span className="num-cart-products">
                {numProductsCart > 0 && numProductsCart}
              </span>
              <img className="img-cart" src={cart} />
            </div>
          </div>
        )}
        <div className="div-button ">
          <Button
            primary
            onClick={() => {
              if (userIsLogin) {
                console.log("logout", userIsLogin);
                logOut();
              } else {
                setIsModal({ signIn: true });
                setOpen(true);
              }
            }}
          >
            {userIsLogin ? "Sign Out" : "Sign In"}
          </Button>
          {!userIsLogin && (
            <Button
              primary
              onClick={() => {
                setIsModal({ signUp: true });
                setOpen(true);
              }}
            >
              Sign Up
            </Button>
          )}
        </div>
      </nav>
      <ModalSignInOrSignUp isModal={isModal} open={open} setOpen={setOpen} />
      <CartModal openCart={openCart} setOpenCart={setOpenCart} user={user} />
    </>
  );
}
