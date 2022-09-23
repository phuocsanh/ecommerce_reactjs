import { Table } from "antd";
import React from "react";
import styles from "../../sass/Components/table.module.scss";
import clsx from "clsx";
import { fs, auth } from "../../config/ConfigFireBase";
import { toast } from "react-toastify";

const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
  {
    key: "4",
    name: "Jim Red",
    age: 32,
    address: "London No. 2 Lake Park",
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  // console.log("params", pagination, filters, sorter, extra);
};

const TableComponent = ({
  typeAdd,
  data,
  showNext,
  showPrevious,
  page,
  totalData,
  loadTotalItem,
  setloadTotalItem,
  setIsUpdate,
  setOpenModalAddNew,
  setItem,
}) => {
  const dbName = typeAdd == "product" ? "products" : "categories";
  const columns =
    typeAdd == "product"
      ? [
          {
            title: "Name",
            dataIndex: "title",
            width: "20rem",
          },
          {
            title: "Price",
            dataIndex: "price",
            width: "10rem",

            sorter: (a, b) => a.price - b.price,
          },
          {
            title: "Description",
            dataIndex: "description",
            width: "20rem",
            render: (text) => {
              return (
                <span>
                  {text?.length >= 50 ? `${text?.slice(0, 50)}...` : text}
                </span>
              );
            },
          },
          {
            title: "Image Url",
            dataIndex: "image",
            width: "20rem",
            render: (text) => {
              return (
                <span>
                  {text?.length >= 50 ? `${text?.slice(0, 50)}...` : text}
                </span>
              );
            },
          },
          {
            title: "Action",

            dataIndex: "",
            width: "8rem",
            key: "x",
            render: (text, record) => {
              return (
                <div style={{ display: "flex" }}>
                  <a onClick={() => handleUpdate(record)}>Edit</a>
                  <a
                    onClick={() => onDelete(record, dbName)}
                    style={{ marginLeft: 20, color: "red" }}
                  >
                    Delete
                  </a>
                </div>
              );
            },
          },
        ]
      : [
          {
            title: "Name",
            dataIndex: "title",
            width: "20rem",
            sorter: (a, b) => a.title.length - b.title.length,
            sortDirections: ["descend"],
          },
          {
            title: "Action",

            dataIndex: "",
            width: "8rem",
            key: "x",
            render: (text, record) => (
              <div style={{ display: "flex" }}>
                <a onClick={() => handleUpdate(record)}>Edit</a>
                <a
                  onClick={() => onDelete(record, dbName)}
                  style={{ marginLeft: 20, color: "red" }}
                >
                  Delete
                </a>
              </div>
            ),
          },
        ];

  const onDelete = (record, dbName) => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        fs.collection(dbName)
          .doc(record.key)
          .delete()
          .then(() => {
            console.log("successfully deleted");
            setloadTotalItem(!loadTotalItem);
            toast.success(`Deleted ${record.title} successfully`);
          })
          .catch((error) => console.log("error", error));
      }
    });
  };
  const handleUpdate = (values) => {
    console.log(
      "🚀 ~ file: index.jsx ~ line 157 ~ handleUpdate ~ values",
      values
    );
    setItem(values);
    setIsUpdate(true);
    setOpenModalAddNew(true);
  };

  return (
    <div className={clsx(styles.container)}>
      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={false}
        footer={() => (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{`Total ${totalData} item`}</span>
            <div
              style={{
                width: 150,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {totalData <= 5 ? (
                <></>
              ) : (
                <button
                  onClick={() =>
                    page == 1
                      ? () => {
                          console.log("not call");
                        }
                      : showPrevious({ item: data[0] }, dbName)
                  }
                >
                  Previous
                </button>
              )}

              {totalData <= 5 ? (
                <></>
              ) : (
                <button
                  onClick={() =>
                    showNext({ item: data[data.length - 1] }, dbName)
                  }
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default TableComponent;
