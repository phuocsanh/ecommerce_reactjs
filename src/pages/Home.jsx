import React, { useEffect, useState } from "react";
import styles from "../sass/Pages/home.module.scss";
import NavBar from "../components/NavBar";
import Product from "./Product";
import clsx from "clsx";
import { fs, auth } from "../config/ConfigFireBase";

function Home({ db }) {
  const [idexCategories, setIdexCategories] = useState(0);
  const [categories, setCategories] = useState([]);

  const [idCategory, setIdCategory] = useState(null);
  // console.log("🚀 ~ file: Home.jsx ~ line 13 ~ Home ~ idCategory", idCategory);

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
    if (idexCategories == 0) {
      setIdCategory(listCategories[0].title.toLowerCase());
    }
  };

  useEffect(() => {
    getListCategory();
  }, []);

  return (
    <div className={clsx(styles.container)}>
      <NavBar />
      <div className={clsx(styles.category)}>
        {categories.map((item, idx) => (
          <a
            onClick={() => {
              setIdexCategories(idx);
              setIdCategory(item.title.toLowerCase());
            }}
            className={
              idexCategories !== idx
                ? clsx(styles["item-category"])
                : clsx(styles["item-category-choose"])
            }
          >
            {item?.title}
          </a>
        ))}
      </div>
      <Product idCategory={idCategory} />
    </div>
  );
}

export default Home;
