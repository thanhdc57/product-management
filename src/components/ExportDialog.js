import React, { useState, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./custom.css";
import { Icon } from "@iconify/react";
import { RadioButton } from "primereact/radiobutton";

export default function ExportDialog({
  openExportDialog,
  setOpenExportDialog,
  products,
  data
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const cols = [
    { field: "code", header: "Mã" },
    { field: "name", header: "Tên" },
    { field: "detail", header: "Mô tả" },
    { field: "family", header: "Dòng sản phẩm" },
  ];

  const exportCSV = (selectionOnly) => {
    data.current.exportCSV({ selectionOnly });
};


const exportExcel = () => {
    import('xlsx').then((xlsx) => {
        const worksheet = xlsx.utils.json_to_sheet(products);
        const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
        const excelBuffer = xlsx.write(workbook, {
            bookType: 'xlsx',
            type: 'array'
        });

        saveAsExcelFile(excelBuffer, 'products');
    });
};

const saveAsExcelFile = (buffer, fileName) => {
    import('file-saver').then((module) => {
        if (module && module.default) {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data = new Blob([buffer], {
                type: EXCEL_TYPE
            });

            module.default.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
    });
};


  // header of the dialog form
  const header = () => {
    return (
      <div>
        <div className="text-center text-2xl py-1">Chọn loại định dạng</div>
      </div>
    );
  };

  // footer of the dialog form
  const renderFooter = () => {
    return (
      <div>
        <Button
          label="Hủy"
          onClick={() => {
            setOpenExportDialog(false);
          }}
          className="p-button-text "
          style={{ color: "#333333" }}
        />
        <Button
          icon={<Icon icon={"bxs:save"} />}
          label="Lưu"
          autoFocus
          disabled={selectedCategory === "" ? true : false}
          className="primary"
          onClick={() => {
            console.log(selectedCategory);
            if(selectedCategory === "CSV"){
                exportCSV(false)
            } else {
                exportExcel()
            }
            setOpenExportDialog(false);
          }}
        />
      </div>
    );
  };

  return (
    <div>
      <Dialog
        className="crm-detail"
        header={header}
        visible={openExportDialog}
        onHide={() => {
          setOpenExportDialog(false);
        }}
        breakpoints={{ "960px": "75vw" }}
        footer={renderFooter}
      >
        <div className="card flex justify-content-center p-2">
          <div className="flex flex-column gap-3">
            <div key={"EXCEL"} className="flex align-items-center">
              <RadioButton
                inputId="EXCEL"
                name="EXCEL"
                value="EXCEL"
                onChange={(e) => setSelectedCategory(e.value)}
                checked={selectedCategory === "EXCEL"}
              />
              <label htmlFor="EXCEL" className="ml-2">
                EXCEL
              </label>
            </div>
            <div key={"CSV"} className="flex align-items-center">
              <RadioButton
                inputId="CSV"
                name="CSV"
                value="CSV"
                onChange={(e) => setSelectedCategory(e.value)}
                checked={selectedCategory === "CSV"}
              />
              <label htmlFor="CSV" className="ml-2">
                CSV
              </label>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
