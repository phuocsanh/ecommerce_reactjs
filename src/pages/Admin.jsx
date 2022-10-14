import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import styles from "../sass/Pages/admin.module.scss";
import clsx from "clsx";
import box from "../assets/image/box.png";
import category from "../assets/image/category.png";
import TableComponent from "../components/Table";
import { Button } from "../components/Button/Button";
import "firebase/compat/firestore";
import ModalAddNew from "../components/ModalAddNew";
import { fs } from "../config/ConfigFireBase";

function Admin() {
  const [listData, setListData] = useState([]);
  const [typeAdd, setTypeAdd] = useState("product");
  const [isUpdate, setIsUpdate] = useState(false);
  const [openModalAddNew, setOpenModalAddNew] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loadTotalItem, setloadTotalItem] = useState(false);
  const [item, setItem] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (typeAdd == "product") {
      getTotalData("products");
      const fetchData = async () => {
        fs.collection("products")
          .orderBy("createAt", "desc") //order using firestore timestamp
          .limit(5) //change limit value as your need
          .onSnapshot(function (querySnapshot) {
            var items = [];
            querySnapshot.forEach(function (doc) {
              items.push({ key: doc.id, ...doc.data() });
            });
            setListData(items);
          });
      };
      fetchData();
    } else {
      getTotalData("categories");
      const fetchData = async () => {
        fs.collection("categories")
          .orderBy("createAt", "desc") //order using firestore timestamp
          .limit(5) //change limit value as your need
          .onSnapshot(function (querySnapshot) {
            var items = [];
            querySnapshot.forEach(function (doc) {
              items.push({ key: doc.id, ...doc.data() });
            });
            setListData(items);
          });
      };
      fetchData();
    }
  }, [typeAdd, loadTotalItem]);

  const getTotalData = async (dbName) => {
    const data = await fs.collection(dbName).get();
    setTotalPage(Math.ceil(data?.docs?.length / 5));
    setTotalData(data?.docs?.length);
  };

  const showNext = ({ item }, dbName) => {
    if (totalPage == page) {
      // console.log("return");
      return;
    }
    if (listData.length === 0) {
      //use this to show hide buttons if there is no records
    } else {
      const fetchNextData = async () => {
        fs.collection(dbName)
          .orderBy("createAt", "desc") //order using firestore timestamp
          .limit(5) //change limit value as your need
          .startAfter(item.createAt) //we pass props item's first created timestamp to do start after you can change as per your wish
          .onSnapshot(function (querySnapshot) {
            const items = [];
            querySnapshot.forEach(function (doc) {
              items.push({ key: doc.id, ...doc.data() });
            });
            setPage(page + 1);

            setListData(items);
            //in case you like to show current page number you can use this
          });
      };
      fetchNextData();
    }
  };
  const showPrevious = ({ item }, dbName) => {
    const fetchPreviousData = async () => {
      fs.collection(dbName)
        .orderBy("createAt", "desc")
        .endBefore(item.createAt) //this is important when we go back
        .limitToLast(5) //this is important when we go back
        .onSnapshot(function (querySnapshot) {
          const items = [];
          querySnapshot.forEach(function (doc) {
            items.push({ key: doc.id, ...doc.data() });
          });
          setListData(items);
          setPage(page - 1);
        });
    };
    fetchPreviousData();
  };
  useEffect(() => {
    getListCategory();
  }, []);
  const getListCategory = async () => {
    const categoriesNew = await fs.collection("categories").get();
    let listCategories = [];
    for (let snap of categoriesNew.docs) {
      let data = snap.data();

      listCategories.push({ id: snap.id, ...data });
      if (categoriesNew.docs.length === listCategories.length) {
        setCategories(listCategories);
      }
    }
  };
  return (
    <div className={clsx(styles.container)}>
      <NavBar />
      <div
        style={{
          marginTop: 60,
          display: "flex",
          width: "100%",
        }}
      >
        <div className={clsx(styles["left-menu"])}>
          <button
            onClick={() => {
              setTypeAdd("product");
            }}
            className={clsx(styles["btn-left-menu"])}
            style={typeAdd == "product" ? { background: "#d9d8d7" } : {}}
          >
            <img className={clsx(styles["btn-left-img"])} src={box} />
            <span>Products</span>
          </button>
          <button
            onClick={() => {
              setTypeAdd("category");
            }}
            className={clsx(styles["btn-left-menu"])}
            style={typeAdd !== "product" ? { background: "#d9d8d7" } : {}}
          >
            <img className={clsx(styles["btn-left-img"])} src={category} />
            <span>Categories</span>
          </button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{ width: "auto", height: 40, marginTop: 20, marginLeft: 40 }}
          >
            <Button
              onClick={() => {
                setOpenModalAddNew(true);
                setIsUpdate(false);
                setItem(null);
              }}
              className={clsx(styles["btn-add-new"])}
            >{`Add new ${typeAdd}`}</Button>
          </div>
          <div
            style={{
              marginLeft: 40,
              marginRight: 40,
            }}
          >
            <TableComponent
              typeAdd={typeAdd}
              data={listData}
              showNext={showNext}
              showPrevious={showPrevious}
              page={page}
              totalData={totalData}
              setIsUpdate={setIsUpdate}
              loadTotalItem={loadTotalItem}
              setloadTotalItem={setloadTotalItem}
              setOpenModalAddNew={setOpenModalAddNew}
              setItem={setItem}
            />
          </div>
        </div>
        <ModalAddNew
          open={openModalAddNew}
          setOpen={setOpenModalAddNew}
          isUpdate={isUpdate}
          typeAdd={typeAdd}
          categories={categories}
          loadTotalItem={loadTotalItem}
          setloadTotalItem={setloadTotalItem}
          item={item}
        />
      </div>
    </div>
  );
}

export default Admin;
