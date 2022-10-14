import React, { useEffect, useState } from "react";
import styles from "../sass/Pages/news.module.scss";
import clsx from "clsx";
import { fs } from "../config/ConfigFireBase";
import NavBar from "../components/NavBar/index";
import listDiscussion from "../constant/listDiscussion.json";
import listPromotion from "../constant/listpromotion.json";

function News() {
  const [list, setList] = useState([]);
  const getNewss = async () => {
    const listNewss = await fs.collection("newss").get();
    let listNews = [];
    for (let snap of listNewss.docs) {
      let data = snap.data();

      listNews.push({ id: snap.id, ...data });

      if (listNewss.docs.length === listNews.length) {
        setList(listNews);
      }
    }
  };
  useEffect(() => {
    getNewss();
  }, []);

  return (
    <div className={clsx(styles.container)}>
      <NavBar />
      <div className={clsx(styles.containerChil)}>
        <div className={clsx(styles["news-left"])}>
          {list.map((item, idx) => {
            return (
              <div key={idx} className={styles["div-list__left"]}>
                <img src={item?.image} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: 10,
                  }}
                >
                  <h1>{item?.title}</h1>
                  <h3>{item?.author}</h3>
                </div>
              </div>
            );
          })}
        </div>
        <div className={clsx(styles["news-right"])}>
          <div>
            <h2 style={{ color: "#ababab" }}>Thảo luận nhiều</h2>
            {listDiscussion.map((item, idx) => {
              return (
                <div
                  style={{
                    display: "flex",
                    cursor: "pointer",
                    marginBottom: 5,
                  }}
                  key={idx}
                >
                  <div
                    style={{
                      color: "#adadad",
                      width: 40,
                      height: 40,
                      backgroundColor: "#cccccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                    }}
                  >
                    {item.id}
                  </div>
                  <p style={{ marginLeft: 10 }}>{item.content}</p>
                </div>
              );
            })}
          </div>

          <div
            style={{ marginTop: 20, display: "flex", flexDirection: "column" }}
          >
            <h2 style={{ color: "blue" }}>Khuyến mãi</h2>
            {listPromotion.map((item, idx) => {
              return (
                <div
                  className={
                    item.id === 1
                      ? clsx(styles["item-promotion__frist"])
                      : clsx(styles["item-promotion__nth"])
                  }
                >
                  <img
                    src={item.image}
                    className={
                      item.id !== 1
                        ? clsx(styles["promotion-image__nth"])
                        : clsx(styles["promotion-image__first"])
                    }
                  />

                  <p style={{ marginLeft: 10 }}>{item.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default News;
