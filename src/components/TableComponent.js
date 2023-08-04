import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dropdown } from "primereact/dropdown";
import TableHeader from "./TableHeader";
import { Icon } from "@iconify/react";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./custom.css";
import { Button } from "primereact/button";
import { FilterMatchMode } from "primereact/api";
import { SplitButton } from "primereact/splitbutton";

export default function TableComponent() {
  // setState to show proudcts
  const [products, setProducts] = useState([]);

  // setState for paging
  const [first2, setFirst2] = useState(0);
  const [rows2, setRows2] = useState(20);

  // setState for selecting prduct checkbox
  const [selectedProducts, setSelectedProducts] = useState(null);

  // state when data is updated then table will render again
  const [updateTable, setUpdateTable] = useState(0);

  // toast for lock icon
  const toast = useRef(null);

  // State to store clicked product edit information
  const [formInput, setFormInput] = useState({});

  // State to open the form
  const [visible, setVisible] = useState(false);

  // State to search for products by code, name, family
  const [filters1, setFilters1] = useState(null);

  const [cols, setCols] = useState();

  const data = useRef(null);

  // get data from local storage and setFilter search to null
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products")));
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
  }, [updateTable]);

  // function to update table without re loading
  const handleUpdateTable = () => {
    setUpdateTable((current) => current + 1);
  };

  // function to search table with keyword
  const changefilter1 = (_filters1) => {
    setFilters1(_filters1);
  };

  // create lock/open icon
  const lockIcon = (rowData) => {
    return (
      <Button
        icon={
          <Icon
            icon={rowData.lock ? "bx:lock-alt" : "bx:lock-open-alt"}
            className={rowData.lock ? " p-0 text-danger" : " p-0 text-success"}
          />
        }
        tooltip={rowData.lock ? "Mở" : "Đóng"}
        tooltipOptions={{ position: "top" }}
        rounded
        text
        aria-label="Lock"
        onClick={() => {
          confirm1(rowData);
        }}
      />
    );
  };
  const showSuccess = () => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: "lưu thành công",
      life: 3000,
    });
  };

  const showError = (errorMess) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: errorMess,
      life: 3000,
    });
  };

  // when click accept in confirm dialog for lock/open product
  const acceptLock = (rowData) => {
    rowData.lock = !rowData.lock;
    let productArray = JSON.parse(localStorage.getItem("products"));
    for (let e of productArray) {
      if (e.code == rowData.code) {
        e.lock = rowData.lock;
        break;
      }
    }
    localStorage.setItem("products", JSON.stringify(productArray));
    handleUpdateTable();
    showSuccess();
  };

  // when click reject in confirm dialog lock icon
  const reject = () => {
    toast.current.show({
      severity: "info",
      summary: "Info",
      detail: "bạn đã từ chối",
      life: 3000,
    });
  };

  // confirm dialog for lock/open product
  const confirm1 = (rowData) => {
    confirmDialog({
      message: rowData.lock
        ? 'bạn có chắc muốn mở "' + rowData.name + '" ?'
        : 'Bạn có chắc muốn khóa "' +
          rowData.name +
          '" ? Giá của sản phẩm không thể thao tác sau khi khóa!',
      header: "Xác nhận",
      icon: <Icon icon={"bx:help-circle"} style={{ fontSize: "2vw" }} />,
      accept: () => {
        acceptLock(rowData);
      },
      reject,
      rejectIcon: <Icon icon={"bx:x"} style={{ fontSize: "1.5vw" }} />,
      rejectLabel: "Hủy",
      acceptClassName: "primary",
      acceptIcon: <Icon icon={"bx:check"} style={{ fontSize: "1.5vw" }} />,
      acceptLabel: "Đồng ý",
    });
  };

  // create button edit
  const buttonEdit = (rowData) => {
    const actions = [
      {
        label: <div style={{ color: "#55bef0" }}>Sửa</div>,
        icon: (
          <Icon
            icon={"bx:pencil"}
            fontSize={"1vw"}
            style={{ color: "rgba(0, 0, 0, 0.6)", marginRight: "0.5rem" }}
          />
        ),
        command: () => {
          ClickEditHandle(rowData);
        },
      },
    ];

    return (
      <SplitButton
        tooltip={"Hành động"}
        tooltipOptions={{ position: "top" }}
        buttonClassName="hidden"
        menuButtonClassName="text-color-secondary border-round-sm edit-button"
        outlined
        model={actions}
        menuClassName="crm-splitbutton-menu"
        dropdownIcon={<Icon icon={"bxs:down-arrow"} fontSize={"0.8vw"} />}
      />
    );
  };

  // handle event when click edit button
  const ClickEditHandle = (rowData) => {
    openForm();
    setFormInput(rowData);
  };

  // close form
  const closeForm = () => {
    setVisible(false);
  };

  // open form
  const openForm = () => {
    setVisible(true);
  };

  // set the stored product to empty
  const setEmpty = () => {
    setFormInput({});
  };

  // event paging
  const onCustomPage2 = (event) => {
    setFirst2(event.first);
    setRows2(event.rows);
  };

  // template to render paging
  const template2 = {
    layout:
      "RowsPerPageDropdown CurrentPageReport FirstPageLink PrevPageLink NextPageLink LastPageLink",

    RowsPerPageDropdown: (options) => {
      const dropdownOptions = [
        { label: 20, value: 20 },
        { label: 25, value: 25 },
        { label: 50, value: 50 },
        { label: 100, value: 100 },
        { label: 150, value: 150 },
      ];

      return (
        <React.Fragment>
          <Dropdown
            value={options.value}
            options={dropdownOptions}
            onChange={options.onChange}
          />
        </React.Fragment>
      );
    },
    CurrentPageReport: (options) => {
      return (
        <span
          style={{
            color: "var(--text-color)",
            userSelect: "none",
            width: "100px",
            textAlign: "center",
          }}
        >
          {options.first} - {options.last} of {options.totalRecords}
        </span>
      );
    },
  };

  const handleCols = (newCols) => {
    setCols(newCols);
  };
  return (
    <div>
      <div className="card" style={{ height: "calc(100vh - 14px)" }}>
        <Toast ref={toast} />

        <ConfirmDialog />
        <DataTable
          ref={data}
          filters={filters1}
          globalFilterFields={["code", "name", "family"]}
          emptyMessage="Không có dữ liệu"
          header={
            <TableHeader
            data = {data}
            products = {products}
              handleCols={handleCols}
              showSuccess={showSuccess}
              showError={showError}
              changefilter1={changefilter1}
              filters1={filters1}
              productInfo={formInput}
              handleUpdateTable={handleUpdateTable}
              visible={visible}
              closeForm={closeForm}
              openForm={openForm}
              setEmpty={setEmpty}
            />
          }
          style={{ minWidth: "400px" }}
          size="small"
          value={products}
          scrollable
          scrollHeight="flex"
          showGridlines
          responsiveLayout="scroll"
          paginator
          paginatorTemplate={template2}
          first={first2}
          rows={rows2}
          onPage={onCustomPage2}
          paginatorClassName="justify-content-center border border-2 p-0"
          selectionMode={null}
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
          dataKey="code"
        >
          <Column
            body={(_, { rowIndex }) => rowIndex + 1}
            bodyClassName={"p-0 text-center"}
          />
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          {/* <Column field="code" header="Mã" bodyStyle={{color:"#009688"}}></Column>
          <Column field="name" header="Tên" bodyStyle={{color:"#009688"}}></Column>
          <Column field="detail" header="Mô tả"></Column>
          <Column field="family" header="Dòng sản phẩm"></Column> */}
          {cols}
          <Column
            field=""
            header=""
            bodyStyle={{
              textAlign: "center",
              overflow: "visible",
              padding: "0",
            }}
            body={lockIcon}
          ></Column>
          <Column
            body={buttonEdit}
            bodyStyle={{
              textAlign: "center",
              overflow: "visible",
              padding: "0",
            }}
            header=""
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
