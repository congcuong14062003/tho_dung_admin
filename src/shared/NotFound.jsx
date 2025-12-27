import React from "react";

const NotFound = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1>404</h1>
      <span
        style={{ marginLeft: "10px", marginRight: "10px", border: "2px" }}
      ></span>
      <h2>Trang không tồn tại</h2>
    </div>
  );
};

export default NotFound;
