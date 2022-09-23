import React from "react";
import styles from "../../sass/Components/card.module.scss";
import clsx from "clsx";
import { Button } from "../Button/Button";
import { Tooltip } from "antd";
export default function Card({ data, addToCart }) {
  const container = clsx(styles.container);
  const divSpan = clsx(styles["div-span"]);
  const span = clsx(styles.span, {});
  const showTitle = (data, styles) => {
    if (data.name) {
      return data.length > 30 ? (
        <span className={styles}>{`${data.name.slice(0, 30)}...`}</span>
      ) : (
        <span className={styles}>{data.name}</span>
      );
    } else {
      return data.title.length > 30 ? (
        <span className={styles}>{`${data.title.slice(0, 30)}...`}</span>
      ) : (
        <span className={styles}>{data.title}</span>
      );
    }
  };
  const showDescription = (data, styles) => {
    if (data) {
      return data.length > 90 ? (
        <span className={styles}>{`${data.slice(0, 30)}...`}</span>
      ) : (
        <span className={styles}>{data}</span>
      );
    }
  };
  return (
    <Tooltip
      placement="left"
      color="white"
      title={() => {
        return <div className={clsx(styles.tooltip)}>{data?.description}</div>;
      }}
    >
      <div className={container}>
        <div>
          <img className={clsx(styles.image)} src={data?.image} />
        </div>
        <div className={divSpan}>
          {showTitle(data, span)}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 10,
              paddingBottom: 10,
            }}
          >
            <span
              style={{ color: "red" }}
            >{`${data?.price.toLocaleString()} đ`}</span>
            <Button
              className={clsx(styles.button)}
              onClick={() => {
                addToCart(data);
              }}
            >
              Add to card
            </Button>
          </div>
          <span>{showDescription(data?.description)}</span>
        </div>
      </div>
    </Tooltip>
  );
}
