import React, { useState } from "react";
import { Toolbar } from "primereact/toolbar";
import { Button } from "primereact/button";
import { Icon } from "@iconify/react";
import AddProductDialog from "./AddProductDialog";
import { InputText } from "primereact/inputtext";

import { SplitButton } from "primereact/splitbutton";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { useEffect } from "react";
import ExportDialog from "./ExportDialog";
export default function TableHeader({
  changefilter1,
  filters1,
  productInfo,
  handleUpdateTable,
  visible,
  closeForm,
  openForm,
  setEmpty,
  showSuccess,
  showError,
  handleCols,
  products,
  data
}) {

  // 
  const [openExportDialog, setOpenExportDialog] = useState(false)
  // state for value of the search
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  // event when enter keywork in the search
  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;
    changefilter1(_filters1);
    setGlobalFilterValue1(value);
  };

  const items = [
    {
      label: "Table",
      icon: (
        <Icon
          icon={"bx:table"}
          fontSize={"1vw"}
          style={{ color: "rgba(0, 0, 0, 0.6)", marginRight: "0.5rem" }}
        />
      ),
    },
    {
      label: "Kanban",
      icon: (
        <Icon
          icon={"bx:table"}
          fontSize={"1vw"}
          style={{ color: "rgba(0, 0, 0, 0.6)", marginRight: "0.5rem" }}
        />
      ),
    },
    {
      label: "Split View",
      icon: (
        <Icon
          icon={"bx:table"}
          fontSize={"1vw"}
          style={{ color: "rgba(0, 0, 0, 0.6)", marginRight: "0.5rem" }}
        />
      ),
    },
  ];

  // filter cols by checkbox
  const columns = [
    { field: "code", header: "Mã" },
    { field: "name", header: "Tên" },
    { field: "detail", header: "Mô tả" },
    { field: "family", header: "Dòng sản phẩm" },
  ];
  const [selectedColumns, setSelectedColumns] = useState(columns);

  useEffect(() => {
    handleCols(renderColumns(selectedColumns));
  }, []);

  const onColumnToggle = (event) => {
    let selectedColumns = event.value;
    let orderedSelectedColumns = columns.filter((col) =>
      selectedColumns.some((sCol) => sCol.field === col.field)
    );
    setSelectedColumns(orderedSelectedColumns);
    handleCols(renderColumns(selectedColumns));
  };

  const renderColumns = (selectedColumns) => {
    console.log(selectedColumns);
    let cols = selectedColumns.map((col) => {
      if (col.field === "name" || col.field === "code") {
        return (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            bodyStyle={{ color: "#009688" }}
          />
        );
      } else {
        return <Column key={col.field} field={col.field} header={col.header} />;
      }
    });
    return cols;
  };

  // left content of the header
  const leftContents = (
    <React.Fragment>
      <div
        className="border-round flex justify-content-center align-items-center p-1 h-full"
        style={{ backgroundColor: "rgb(144, 10, 191)", opacity: "0.64" }}
      >
        <Icon icon="bx:data" className="text-4xl text-white" />
      </div>
      <div className="ml-2">
        <span className="module-name">Sản phẩm</span>
        <div className="flex" style={{ textAlign: "left" }}>
          <MultiSelect
            value={selectedColumns}
            options={columns}
            optionLabel="header"
            onChange={onColumnToggle}
            style={{ width: "20em" }}
          />
          <Button
            icon={<Icon icon={"bxs:pin"} />}
            outlined
            aria-label="Lock"
            style={{ width: "2.5rem", marginLeft: "8px" }}
          />
        </div>
      </div>
    </React.Fragment>
  );

  // right content of the header
  const rightContents = (
    <React.Fragment>
      <div className="d-flex flex-column">
        <span className="p-buttonset d-flex justify-content-end ">
          <Button
            tooltip="Tạo mới"
            tooltipOptions={{ position: "top" }}
            label="Tạo mới"
            className="p-button-outlined p-button-secondary"
            style={{
              width: "4vw",
              height: "2.5vw",
              fontSize: "0.8vw",
              padding: "0",
              color: "#009688",
              borderColor: "#bdbdbd",
            }}
            onClick={() => {
              setEmpty();
              openForm();
            }}
          />
          <Button
            tooltip="Export"
            tooltipOptions={{ position: "top" }}
            label="Export"
            className="p-button-outlined p-button-secondary"
            style={{
              width: "4vw",
              height: "2.5vw",
              fontSize: "0.8vw",
              padding: "0",
              color: "#009688",
              borderColor: "#bdbdbd",
            }}
            onClick={() => {
              setOpenExportDialog(true)
            }}
          />
          <Button
            tooltip="Giao diện in"
            tooltipOptions={{ position: "top" }}
            label="Giao diện in"
            className="p-button-outlined p-button-secondary"
            style={{
              width: "5.5vw",
              height: "2.5vw",
              fontSize: "0.8vw",
              padding: "0",
              color: "#009688",
              borderColor: "#bdbdbd",
            }}
          />
        </span>
        <div className="mt-2 search-wrapper flex justify-content-end align-items-center ">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder="Tìm kiếm..."
              style={{ width: "25vw", height: "2.5vw" }}
            />
          </span>
          <span className="d-flex justify-content-end ">
            <SplitButton
              buttonClassName="hidden"
              tooltip="Giao diện xem"
              tooltipOptions={{ position: "top" }}
              menuButtonClassName="text-color-secondary border-round-sm ms-2 wraper-button"
              outlined
              model={items}
              dropdownIcon={<Icon icon={"bx:table"} fontSize={"1.5vw"} />}
            />

            <SplitButton
              buttonClassName="hidden"
              tooltip="Tải lại trang"
              tooltipOptions={{ position: "top" }}
              menuButtonClassName="text-color-secondary border-round-sm mx-2 wraper-button"
              outlined
              dropdownIcon={<Icon icon={"bx:refresh"} fontSize={"1.5vw"} />}
            />
            <SplitButton
              buttonClassName="hidden"
              tooltip="Chỉnh sửa danh sách xem"
              tooltipOptions={{ position: "top" }}
              menuButtonClassName="text-color-secondary border-round-sm wraper-button"
              outlined
              dropdownIcon={<Icon icon={"bx:pencil"} fontSize={"1.5vw"} />}
            />
          </span>
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <div>
      <Toolbar left={leftContents} right={rightContents} />
      <AddProductDialog
        showError={showError}
        visible={visible}
        closeForm={closeForm}
        handleUpdateTable={handleUpdateTable}
        productInfo={productInfo}
        showSuccess={showSuccess}
      ></AddProductDialog>
      <ExportDialog products = {products} data = {data} setOpenExportDialog = {setOpenExportDialog} openExportDialog={openExportDialog}
      />
    </div>
  );
}
