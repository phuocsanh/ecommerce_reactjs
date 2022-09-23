import Modal from "antd/lib/modal/Modal";
import React, { useState, useEffect, useLayoutEffect } from "react";
import clsx from "clsx";

import styles from "../../sass/Components/cartmodal.module.scss";
import { fs, auth } from "../../config/ConfigFireBase";
import deteleIcon from "../../assets/image/delete-icon.jpg";
import { useDispatch, useSelector } from "react-redux";

import { appsSlice } from "../../redux/reducers/appsSlice";
import { toast } from "react-toastify";

function CartModal({ openCart, setOpenCart }) {
  const dispatch = useDispatch();
  // const [cartProducts, setCartProducts] = useState([]);
  const cartProducts = useSelector((state) => state.apps.cartProducts);
  // console.log(
  //   "🚀 ~ file: index.jsx ~ line 8 ~ CartModal ~ cartProducts",
  //   cartProducts
  // );
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid).onSnapshot((snapshot) => {
          const newCartProduct = snapshot.docs.map((doc) => ({
            ID: doc.id,
            ...doc.data(),
          }));
          dispatch(appsSlice.actions.setCartProducts(newCartProduct));
        });
      } else {
        console.log("user is not signed in to retrieve cart");
      }
    });
  }, []);
  const price = cartProducts.map((cartProduct) => {
    return cartProduct.TotalProductPrice;
  });
  const reducerOfPrice = (accumulator, currentValue) =>
    accumulator + currentValue;

  const totalPrice = price.reduce(reducerOfPrice, 0);
  useEffect(() => {
    dispatch(appsSlice.actions.setNumProductsCart(cartProducts.length));
  }, [cartProducts]);

  let Product;
  const cartProductIncrease = (cartProduct) => {
    // console.log(cartProduct);
    Product = cartProduct;
    Product.qty = Product.qty + 1;
    Product.TotalProductPrice = Product.qty * Product.price;
    // updating in database
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.ID)
          .update(Product)
          .then(() => {
            console.log("increment added");
          });
      } else {
        console.log("user is not logged in to increment");
      }
    });
  };

  // cart product decrease functionality
  const cartProductDecrease = (cartProduct) => {
    Product = cartProduct;
    if (Product.qty > 1) {
      Product.qty = Product.qty - 1;
      Product.TotalProductPrice = Product.qty * Product.price;
      // updating in database
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("Cart " + user.uid)
            .doc(cartProduct.ID)
            .update(Product)
            .then(() => {
              console.log("decrement");
            });
        } else {
          console.log("user is not logged in to decrement");
        }
      });
    }
  };

  const handleCartProductDelete = (cartProduct) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("Cart " + user.uid)
          .doc(cartProduct.ID)
          .delete()
          .then(() => {
            console.log("successfully deleted");
          });
      }
    });
  };
  const handleCartProductDeleteAll = (listCartProduct) => {
    for (let i = 0; i <= listCartProduct.length; i++) {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection("Cart " + user.uid)
            .doc(listCartProduct[i].ID)
            .delete()
            .then(() => {
              // console.log("successfully deleted");
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      });
    }
  };
  const handleOk = () => {
    dispatch(appsSlice.actions.setOpenPaypalModal(true));
    dispatch(appsSlice.actions.setTotalPrice(totalPrice));
    setOpenCart(false);
  };

  return (
    <div>
      <Modal
        title={
          <div
            style={{
              width: "90%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Shopping Cart</span>

            <span>{`Total Price ${totalPrice.toLocaleString()} đ`}</span>
          </div>
        }
        open={openCart}
        onCancel={() => {
          setOpenCart(false);
        }}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {cartProducts.length > 0 ? (
              <button
                onClick={() => handleCartProductDeleteAll(cartProducts)}
                className={clsx([styles["btn-cancel"], styles["btn"]])}
              >
                Delete all
              </button>
            ) : (
              <div></div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={() => setOpenCart(false)}
                className={clsx([styles["btn-cancel"], styles["btn"]])}
              >
                Cancel
              </button>
              {cartProducts.length > 0 && (
                <button
                  className={clsx([styles["btn-buy"], styles["btn"]])}
                  onClick={handleOk}
                >
                  Buy
                </button>
              )}
            </div>
          </div>
        }
      >
        <div className={clsx(styles.modal)}>
          {cartProducts.length > 0 ? (
            cartProducts.map((item, idx) => {
              return (
                <div className={clsx(styles["cart-item"])}>
                  <div>
                    <img
                      onClick={() => {
                        handleCartProductDelete(item);
                      }}
                      style={{
                        width: 20,
                        height: 20,
                        marginRight: 15,
                        cursor: "pointer",
                      }}
                      src={deteleIcon}
                    />
                    <img style={{ width: 40, height: 40 }} src={item.image} />
                    <span className={clsx(styles["title"])}>{item?.title}</span>
                  </div>
                  <div className={clsx([styles["inc-dec"]])}>
                    <button
                      className={clsx([styles["btn-inc-dec"], styles["btn"]])}
                      onClick={() => cartProductIncrease(item)}
                    >
                      +
                    </button>
                    <span className={clsx(styles["qty"])}>{item?.qty}</span>
                    <button
                      className={clsx([styles["btn-inc-dec"], styles["btn"]])}
                      onClick={() => cartProductDecrease(item)}
                    >
                      -
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <span>Chưa có sản phẩm nào</span>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default CartModal;
