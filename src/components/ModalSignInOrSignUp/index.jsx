import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { useFormik } from "formik";
import { UserOutlined, KeyOutlined } from "@ant-design/icons";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import clsx from "clsx";
import styles from "../../sass/Components/signInOrSignUp.module.scss";
import { object, string, ref } from "yup";
import { auth, fs } from "../../config/ConfigFireBase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { usersSlice } from "../../redux/reducers/usersSlice";
import { useNavigate } from "react-router-dom";

function ModalSignInOrSignUp({ isModal, open, setOpen }) {
  const [initValue, setInitValue] = useState({});
  const [validationSchema, setValidationSchema] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setCurrentUser = (dispatch, slice, navigate) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection("users")
          .doc(user.uid)
          .get()
          .then((snapshot) => {
            const data = {
              userName: snapshot.data().userName,
              role: snapshot.data().role,
            };
            dispatch(slice?.actions?.setUserIsLogin(data));
            localStorage.setItem("userIsLogin", JSON.stringify(data));
            // if (snapshot.data().role == "admin") {
            //   console.log(
            //     "🚀 ~ file: index.jsx ~ line 37 ~ .then ~ snapshot.data().role",
            //     snapshot.data().role
            //   );

            //   navigate("/admin");
            // }
          });
      }
      return;
    });
  };

  const formik = useFormik({
    initialValues: initValue,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      // alert(JSON.stringify(values, null, 2));
      if (isModal.signUp) {
        const userName = values.email.split("@");
        auth
          .createUserWithEmailAndPassword(values.email, values.password)
          .then((credentials) => {
            fs.collection("users")
              .doc(credentials.user.uid)
              .set({
                email: values.email,
                password: values.password,
                userName: userName[0],
                role: "user",
              })
              .then(() => {
                toast.success("Đăng kí thành công");
                setOpen(false);
                formik.resetForm();
              })
              .catch((error) => {
                toast.error("Đăng kí thất bại");
                formik.resetForm();
              });
          })
          .catch((error) => {
            toast.error("Email đã được đăng ký");
            formik.resetForm();
          });
      } else {
        auth
          .signInWithEmailAndPassword(values.email, values.password)
          .then(() => {
            toast.success("Đăng nhập thành công");
            setOpen(false);
            formik.resetForm();
            setCurrentUser(dispatch, usersSlice, navigate);
          })
          .catch((error) => {
            // console.log("error Login", error);
            toast.error("Sai tên đăng nhập hoặc mật khẩu");
          });
      }
    },
  });
  const handleCancel = () => {
    formik.resetForm();
    setOpen(false);
  };
  const handleOk = () => {
    formik.handleSubmit();
  };
  const handleSetValidationSchema = (isSignIn) => {
    let newSchema;
    if (isSignIn) {
      newSchema = object().shape({
        email: string()
          .required("Không được để trống")
          .max(100, "Đã vượt quá số kí tự tối đa")
          .min(8, "Ít nhất 8 kí tự")
          .matches()
          .email("Email không hợp lệ"),
        password: string()
          .max(50, "Vượt quá số kí tự tối đa")
          .min(8, "Ít nhất 8 kí tự"),
      });

      setValidationSchema(newSchema);
    } else {
      newSchema = object().shape({
        email: string()
          .email("Email không hợp lệ")
          .required("Không được để trống")
          .max(50, "Đã vượt quá số kí tự tối đa")
          .min(8, "Ít nhất 8 kí tự"),
        password: string()
          .max(50, "Vượt quá số kí tự tối đa")
          .min(8, "Ít nhất 8 kí tự"),
        confirmPassword: string()
          .max(50, "Vượt quá số kí tự tối đa")
          .min(8, "Ít nhất 8 kí tự")
          .oneOf([ref("password"), null], "Password không khớp"),
      });
      setValidationSchema(newSchema);
    }
  };

  useEffect(() => {
    if (isModal.signIn) {
      setInitValue({ email: "", password: "" });
      handleSetValidationSchema(isModal.signIn);
    } else {
      setInitValue({ email: "", password: "", confirmPassword: "" });
      handleSetValidationSchema(isModal.signIn);
    }
  }, [isModal]);
  return (
    <>
      <Modal
        title={isModal.signIn ? "SIGN IN" : "SIGN UP"}
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div>
          <label>Email</label>
          <Input
            size="large"
            onChange={(e) => formik.setFieldValue("email", e.target.value)}
            value={formik.values.email}
            placeholder="Nhập Email"
            prefix={<UserOutlined />}
          />
          <div>
            {formik.errors.email && formik.touched && (
              <p className={clsx(styles["error"])}>{formik.errors.email}</p>
            )}
          </div>
        </div>
        <div className={clsx(styles["input-container"])}>
          <label>Password</label>
          <Input.Password
            size="large"
            onChange={(e) => formik.setFieldValue("password", e.target.value)}
            value={formik.values.password}
            placeholder="Nhập mật khẩu"
            prefix={<KeyOutlined />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
          <div>
            {formik.errors.password && formik.touched && (
              <p className={clsx(styles["error"])}>{formik.errors.password}</p>
            )}
          </div>
        </div>
        {isModal.signUp && (
          <div className={clsx(styles["input-container"])}>
            <label>Confirm Password</label>
            <Input.Password
              onChange={(e) =>
                formik.setFieldValue("confirmPassword", e.target.value)
              }
              value={formik.values.confirmPassword}
              size="large"
              placeholder="Nhập lại mật khẩu"
              prefix={<KeyOutlined />}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
            <div>
              {formik.errors.confirmPassword && formik.touched && (
                <p className={clsx(styles["error"])}>
                  {formik.errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default ModalSignInOrSignUp;
