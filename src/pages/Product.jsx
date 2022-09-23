import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import Card from "../components/Card/Card";
import styles from "../../src/sass/Pages/product.module.scss";
import { appsSlice } from "../redux/reducers/appsSlice";
import ReactDOM from "react-dom";
import Modal from "antd/lib/modal/Modal";
import { fs, auth } from "../config/ConfigFireBase";
import clsx from "clsx";
import { display } from "@mui/system";
import { toast } from "react-toastify";
function Product({ idCategory }) {
  const dispatch = useDispatch();
  const [listProduct, setListProduct] = useState();
  const PayPalButton = window.paypal.Buttons.driver("react", {
    React,
    ReactDOM,
  });

  // const isModal = useSelector((state) => state.apps.isModal);
  // const open = useSelector((state) => state.apps.open);

  const uid = useSelector((state) => state.users.userUid);
  const openPayPalModal = useSelector((state) => state.apps.openPayPalModal);
  const totalPrice = useSelector((state) => state.apps.totalPrice);
  const cartProducts = useSelector((state) => state.apps.cartProducts);

  const setIsModal = (isModal) => {
    dispatch(appsSlice.actions.setIsModal(isModal));
  };
  const setOpen = (open) => {
    dispatch(appsSlice.actions.setOpen(open));
  };

  let Product;
  const addToCart = (product) => {
    if (uid !== null) {
      // console.log("🚀 ~ file: Product.jsx ~ line 24 ~ addToCart ~ uid", uid);
      // console.log("product", product);
      Product = product;
      Product["qty"] = 1;
      Product["TotalProductPrice"] = Product.qty * Product.price;
      fs.collection("Cart " + uid)
        .doc(product.ID)
        .set(Product)
        .then(() => {
          console.log("successfully added to cart");
        });
    } else {
      setIsModal({ signIn: true });
      setOpen(true);
    }
  };

  const getListProduct = async () => {
    const products = await fs.collection("products").get();
    let listProduct = [];
    console.log(
      "🚀 ~ file: Product.jsx ~ line 63 ~ getListProduct ~ listProduct",
      listProduct
    );
    for (let snap of products.docs) {
      let data = snap.data();
      data.ID = snap.id;
      listProduct.push({ ...data });
      if (products.docs.length === listProduct.length) {
        const newList = listProduct.filter(
          (item) => item.categoryId == idCategory
        );
        setListProduct(newList);
      }
    }
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

  useEffect(() => {
    getListProduct();
    // console.log("listProduct", listProduct);
  }, [idCategory]);

  const ratio = 0.000043;

  function _createOrder(data, actions) {
    const total = (totalPrice * ratio).toFixed(2);
    // console.log(
    //   "🚀 ~ file: Product.jsx ~ line 95 ~ _createOrder ~ total",
    //   total
    // );
    const id = Math.random(1, 100);
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total.toString(),
            currency_code: "USD",
            breakdown: {
              item_total: { value: total.toString(), currency_code: "USD" },
            },
          },
          invoice_id: `product_${id}`,
          items: [
            {
              name: `product_STshop_${id}`,
              unit_amount: { value: total.toString(), currency_code: "USD" },
              quantity: "1",
              sku: "pr001",
            },
          ],
        },
      ],
    });
  }
  async function _onApprove(data, actions) {
    let order = await actions.order.capture();

    if ((order.status = "COMPLETED")) {
      toast.success("Thanh toán thành công");
      handleCartProductDeleteAll(cartProducts);
      dispatch(appsSlice.actions.setOpenPaypalModal(false));
    } else {
      toast.error("Thanh toán chưa thành công");
    }

    return order;
  }
  function _onError(err) {
    console.log(err);
    let errObj = {
      err: err,
      status: "FAILED",
    };
  }

  return (
    <div className={clsx(styles.container)}>
      <div className={clsx(styles["card-container"])}>
        {listProduct?.map((item, idx) => {
          return <Card data={item} addToCart={addToCart} />;
        })}
      </div>

      <Modal
        open={openPayPalModal}
        onCancel={() => {
          dispatch(appsSlice.actions.setOpenPaypalModal(false));
        }}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div style={{ marginTop: 40 }}>
          <PayPalButton
            createOrder={(data, actions) => _createOrder(data, actions)}
            onApprove={(data, actions) => _onApprove(data, actions)}
            onCancel={() => _onError("Canceled")}
            onError={(err) => _onError(err)}
          />
        </div>
      </Modal>
    </div>
  );
}

export default Product;
