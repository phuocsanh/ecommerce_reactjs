import React from "react";
import styles from "../../sass/Components/button.module.scss";
import clsx from "clsx";

export const Button = ({
  primary,
  outline,
  medium,
  children,
  margin,
  onClick,
  className,
}) => {
  const classes = clsx(styles.btn, {
    [styles["btn-primary"]]: primary,
    [styles["btn-outline"]]: outline,
    [styles["btn-medium"]]: medium,
    [styles["btn-margin"]]: margin,
  });

  return (
    <button className={className ? className : classes} onClick={onClick}>
      {children}
    </button>
  );
};
