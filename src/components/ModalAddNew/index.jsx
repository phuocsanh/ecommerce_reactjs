import React, { useState, useEffect } from "react";
import { Modal, Input } from "antd";
import { useFormik } from "formik";
import clsx from "clsx";
import styles from "../../sass/Components/signInOrSignUp.module.scss";
import { object, string, mixed } from "yup";
import { auth, fs, storage } from "../../config/ConfigFireBase";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Select } from "antd";
import moment from "moment/moment";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
const { Option } = Select;

function ModalAddNew({
  typeAdd,
  open,
  setOpen,
  isUpdate,
  categories,
  setloadTotalItem,
  loadTotalItem,
  item,
}) {
  const { TextArea } = Input;

  const [validationSchema, setValidationSchema] = useState({});
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [initValue, setInitValue] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);

  const [imageError, setImageError] = useState("");
  const types = ["image/jpg", "image/jpeg", "image/png", "image/PNG"];
  let selectFile = null;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const setInitValueFunc = (item) => {
    if (typeAdd == "product" && isUpdate) {
      console.log("update");
      let value = {
        title: item.title,
        description: item.description,
        price: item.price,
        image: item.image,
        categoryId: item.categoryId,
      };

      setInitValue(value);
    }
    if (typeAdd !== "product" && isUpdate) {
      console.log("update");
      let value = {
        title: item.title,
      };

      setInitValue(value);
    }
    if (typeAdd == "product" && !isUpdate) {
      console.log("update");
      let value = {
        title: "",
        description: "",
        price: "",
        image: "",
        categoryId: "",
      };

      setInitValue(value);
    }
    if (typeAdd !== "product" && !isUpdate) {
      console.log("update");
      let value = {
        title: "",
      };

      setInitValue(value);
    }
  };
  useEffect(() => {
    setInitValueFunc(item);
  }, [isUpdate, item]);

  const handleSetValidationSchema = () => {
    let newSchema;
    if (typeAdd == "product") {
      newSchema = object().shape({
        title: string()
          .required("Kh??ng ???????c ????? tr???ng")
          .max(100, "???? v?????t qu?? s??? k?? t??? t???i ??a"),
        description: string().max(500, "V?????t qu?? s??? k?? t??? t???i ??a"),
        image: mixed().required("Vui l??ng ch???n file"),
        price: string().max(50, "V?????t qu?? s??? k?? t??? t???i ??a"),
        categoryId: string().required("Vui l??ng ch???n lo???i s???n ph???m"),
      });

      setValidationSchema(newSchema);
    } else {
      newSchema = object().shape({
        title: string()
          .required("Kh??ng ???????c ????? tr???ng")
          .max(50, "???? v?????t qu?? s??? k?? t??? t???i ??a"),
      });
      setValidationSchema(newSchema);
    }
  };

  const formik = useFormik({
    initialValues: initValue,
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      if (typeAdd == "product" && !isUpdate) {
        if (imageError.length > 0) {
          return;
        }
        handleUpload(values);
      } else if (typeAdd !== "product" && !isUpdate) {
        handleAddCategory(values);
      } else if (typeAdd == "product" && isUpdate) {
        console.log("item.id", item.key);
        console.log("values", values);
        onUpdate(values, "products");
      } else {
        auth.onAuthStateChanged((user) => {
          if (user) {
            fs.collection("categories")
              .doc(item.key)
              .update({
                title: values.title,
              })
              .then(() => {
                console.log("successfully updated");
                setOpen(false);
                toast.success(`Updated successfully`);
              })
              .catch((error) => console.log("error", error));
          }
        });
      }
    },
  });
  const onUpdate = (values, dbName) => {
    if (selectedImage) {
      console.log("selected image");
      const storageRef = ref(storage, `/files/${values.title}`);
      const uploadTask = uploadBytesResumable(storageRef, values.image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          // update progress
        },
        (err) => {
          return null;
        },
        () => {
          // download url
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            fs.collection(dbName)
              .doc(item.key)
              .set({
                title: values.title,
                price: Number(values.price),
                description: values.description,
                image: url,
                categoryId: values.categoryId,
                createAt: item.createAt,
              })
              .then(() => {
                setSelectedImage(null);
                setOpen(false);
                document.getElementById("file").value = "";
                toast.success(`Updated successfully`);
              })
              .catch((error) => console.log("error", error));
          });
        }
      );
    } else {
      auth.onAuthStateChanged((user) => {
        if (user) {
          fs.collection(dbName)
            .doc(item.key)
            .update({
              title: values.title,
              price: Number(values.price),
              description: values.description,
              image: item.image,
              categoryId: values.categoryId,
              createAt: item.createAt,
            })
            .then(() => {
              setSelectedImage(null);
              setOpen(false);
              document.getElementById("file").value = "";
              toast.success(`Updated successfully`);
            })
            .catch((error) => console.log("error", error));
        }
      });
    }
  };
  const handleUpload = (values) => {
    const storageRef = ref(storage, `/files/${values.title}`);
    const uploadTask = uploadBytesResumable(storageRef, values.image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );

        // update progress
      },
      (err) => {
        return null;
      },
      () => {
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          fs.collection("products")
            .add({
              title: values.title,
              price: Number(values.price),
              description: values.description,
              image: url,
              categoryId: values.categoryId,
              createAt: Number(moment().unix()),
            })
            .then(() => {
              toast.success("Th??m m???i th??nh c??ng");
              formik.resetForm();
              setSelectedImage(null);
              setloadTotalItem(!loadTotalItem);
              document.getElementById("file").value = "";
              setOpen(false);
            })
            .catch((error) => {
              toast.error(error);
            });
        });
      }
    );
  };

  const handleChange = (value) => {
    formik.setFieldValue("categoryId", value.toLowerCase());
  };
  const handleCancel = () => {
    formik.resetForm();
    setOpen(false);
    document.getElementById("file").value = "";
    setSelectedImage(null);
  };
  const handleOk = () => {
    formik.handleSubmit();
  };
  const handleProductImage = (e) => {
    e.preventDefault();
    selectFile = e.target.files[0];

    if (selectFile) {
      if (selectFile && types.includes(selectFile.type)) {
        formik.setFieldValue("image", selectFile);
        setSelectedImage(selectFile);
        setImageError("");
      } else {
        formik.setFieldValue("image", selectFile);
        setImageError("Vui l??ng ch???n file .png ho???c .jpg");
      }
    }
  };

  const handleAddCategory = (values) => {
    fs.collection("categories")
      .add({
        title: values.title,
        createAt: Number(moment().unix()),
      })
      .then(() => {
        toast.success("Th??m m???i th??nh c??ng");
        formik.resetForm();
        setOpen(false);
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  useEffect(() => {
    handleSetValidationSchema(typeAdd);
  }, [typeAdd]);
  return (
    <>
      <Modal
        title={
          typeAdd == "product" && !isUpdate
            ? "Add Product"
            : typeAdd == "product" && isUpdate
            ? "Update Product"
            : typeAdd !== "product" && !isUpdate
            ? "Add Category"
            : "Update Category"
        }
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <div>
          <label>Title</label>
          <Input
            size="large"
            onChange={(e) => formik.setFieldValue("title", e.target.value)}
            value={formik.values.title}
            placeholder="Nh???p t??n"
          />
          <div>
            {formik.errors.title && formik.touched && (
              <p className={clsx(styles["error"])}>{formik.errors.title}</p>
            )}
          </div>
        </div>
        {typeAdd == "product" && (
          <div>
            <div className={clsx(styles["input-container"])}>
              <label>Price</label>
              <Input
                type="number"
                size="large"
                onChange={(e) => formik.setFieldValue("price", e.target.value)}
                value={formik.values.price}
                placeholder="Nh???p gi??"
              />
              <div>
                {formik.errors.price && formik.touched && (
                  <p className={clsx(styles["error"])}>{formik.errors.price}</p>
                )}
              </div>
            </div>
            <div className={clsx(styles["input-container"])}>
              <label>Description</label>
              <TextArea
                rows={2}
                size="large"
                onChange={(e) =>
                  formik.setFieldValue("description", e.target.value)
                }
                value={formik.values.description}
                placeholder=""
              />
              <div className={clsx(styles["input-container"])}>
                <lable style={{ marginRight: 20 }}>Category</lable>
                <Select
                  style={{ width: 120 }}
                  onChange={handleChange}
                  defaultValue={item ? item?.categoryId : !item ? null : null}
                >
                  {categories.map((item) => (
                    <Option value={item.title}>{item.title}</Option>
                  ))}
                </Select>
                <div>
                  {formik.errors.categoryId && formik.touched && (
                    <p className={clsx(styles["error"])}>
                      {formik.errors.categoryId}
                    </p>
                  )}
                </div>
              </div>
              <div>
                {formik.errors.description && formik.touched && (
                  <p className={clsx(styles["error"])}>
                    {formik.errors.description}
                  </p>
                )}
              </div>
              <input
                type="file"
                id="file"
                style={{ marginTop: 20 }}
                onChange={handleProductImage}
              />{" "}
              {item && typeAdd === "product" && !selectedImage ? (
                <img
                  style={{ width: 50, height: 50, marginLeft: 20 }}
                  src={item.image}
                />
              ) : typeAdd === "product" && selectedImage ? (
                <img
                  style={{ width: 50, height: 50, marginLeft: 20 }}
                  src={URL.createObjectURL(selectedImage)}
                />
              ) : selectedImage && isUpdate ? (
                <img
                  style={{ width: 50, height: 50, marginLeft: 20 }}
                  src={URL.createObjectURL(selectedImage)}
                />
              ) : (
                <></>
              )}
              <div>
                {formik.errors.image && formik.touched && (
                  <p className={clsx(styles["error"])}>{formik.errors.image}</p>
                )}
                {imageError.length > 0 && (
                  <p className={clsx(styles["error"])}>{imageError}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default ModalAddNew;
