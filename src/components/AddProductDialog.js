import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./custom.css";
import AddProductForm from "./AddProductForm";
import { Icon } from "@iconify/react";
export default function AddProductDialog({
  visible,
  closeForm,
  handleUpdateTable,
  productInfo,
  showSuccess,
  showError
}) {

  const [clicked, setClicked] = useState(false)
  const handleClick = () =>{
    setClicked(false)
  }
  // header of the dialog form
  const header = () => {
    return (
      <div>
        <div className="text-center text-2xl py-1">
          {productInfo.code ? "Chỉnh sửa sản phẩm" : "Thêm mới sản phẩm"}
        </div>
      </div>
    );
  };

  // footer of the dialog form
  const renderFooter = () => {
    return (
      <div>
        <Button label="Hủy" onClick={closeForm} className="p-button-text " style={{color:"#333333"}} />
        <Button
          icon={<Icon icon={"bxs:save"} />}
          type="submit"
          label="Lưu"
          form="my-form"
          autoFocus
          className="primary"
          onClick = {() =>{ setClicked(true)}}
        />
      </div>
    );
  };

  return (
    <div>
      <Dialog
        className="crm-detail"
        header={header}
        visible={visible}
        onHide={closeForm}
        breakpoints={{ "960px": "75vw" }}
        footer={renderFooter}
      >
        <div className="p-2">
          <AddProductForm
            handleUpdateTable={handleUpdateTable}
            closeForm={closeForm}
            productInfo={productInfo}
            clicked = {clicked}
            handleClick ={handleClick}
            showSuccess ={showSuccess}
            showError ={showError}
          ></AddProductForm>
        </div>
      </Dialog>
    </div>
  );
}
