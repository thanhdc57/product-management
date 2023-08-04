import React, { useState, useRef } from "react";
import "./custom.css";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { useFormik } from "formik";

import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { useEffect } from "react";

export default function AddProductForm({
  handleUpdateTable,
  closeForm,
  productInfo,
  showSuccess,
  showError,
  clicked,
  handleClick,
}) {
  const [messageError, setMessageError] = useState();

  // list of family drop down items
  const familyList = [
    { name: "CRMUp" },
    { name: "CRMUp1" },
    { name: "CRMUp2" },
    { name: "CRMUp3" },
    { name: "CRMUp4" },
  ];

  // list of solution drop down items
  const solutionList = [
    { name: "QWERTY" },
    { name: "solution1" },
    { name: "solution2" },
    { name: "solution3" },
    { name: "solution4" },
  ];

  // list of unit drop down items
  const unitList = [{ name: "Ngày" }];

  // use formik to validate input
  const formik = useFormik({
    initialValues: {
      code: productInfo.code,
      name: productInfo.name,
      family: productInfo.family,
      warranty: productInfo.warranty,
      solution: productInfo.solution,
      unit: productInfo.unit,
      detail: productInfo.detail,
      lock: false,      
    },
    validate: (data) => {
      let errors = {};

      if (!data.code) {
        errors.code = "Mã không được trống";
      }
      if (/[!@#$%^&*()+\-=\[\]{};' :"\\|,.<>\/?]+/.test(data.code)) {
        errors.code = 'Mã chỉ cho phép chữ, số, dấu "-"và dấu "_"';
      }

      if (!data.name) {
        errors.name = "Tên không được trống";
      }

      if (/[!@#$%^&*()_+\-=\[\]{}; ':"\\|,.<>\/?]+/.test(data.name)) {
        errors.name = "Tên chỉ cho phép chữ, số và dấu cách";
      }

      if (!data.family) {
        errors.family = "Dòng sản phẩm không được trống";
      }
      return errors;
    },

    onSubmit: (data) => {
      // get data from local storage
      let productArray = JSON.parse(localStorage.getItem("products"));

      // check code duplication if true then it is not duplicated
      let checkCode = true;

      // check what the type of the form. If exists productInfo.code then it is edit form
      if (productInfo.code) {
        productArray.forEach((e) => {
          // check if the code changed duplicate with the remain products code
          if (e.code === data.code && data.code !== productInfo.code) {
            checkCode = false;
            showError(e.code + " đã tồn tại, xin hãy chọn mã khác.");
          }
        });

        // if there is not duplicate code
        if (checkCode) {
          let newProductArray = [...productArray];
          for (let e of newProductArray) {
            if (e.code === productInfo.code) {
              e.code = data.code;
              e.name = data.name;
              e.family = data.family;
              e.warranty = data.warranty;
              e.solution = data.solution;
              e.unit = data.unit;
              e.detail = data.detail;
              break;
            }
          }
          localStorage.setItem("products", JSON.stringify(newProductArray));
          closeForm();
          showSuccess();
        }
        // else there is a duplicate code then show error message
      }
      // if the type of the form is add form then
      else {
        // if data is empty
        if (productArray == null) {
          let firstProduct = [data];
          localStorage.setItem("products", JSON.stringify(firstProduct));
          closeForm();
          showSuccess();
        }
        // else there is a existing data
        else {
          productArray.forEach((e) => {
            if (e.code === data.code) {
              checkCode = false;
              showError(e.code + " đã tồn tại, xin hãy chọn mã khác.");
            }
          });
          if (checkCode) {
            let newProductArray = [data, ...productArray];
            localStorage.setItem("products", JSON.stringify(newProductArray));
            closeForm();
            showSuccess();
          }
        }
      }
      handleUpdateTable();
    },
  });

  const isError = () => {
    return (
      !!(formik.touched["code"] && formik.errors["code"]) ||
      !!(formik.touched["name"] && formik.errors["name"]) ||
      !!(formik.touched["family"] && formik.errors["family"])
    );
  };

  if (clicked == true && isError()) {
    let errorArr = Object.values(formik.errors);
    showError(
      <ul>
        {errorArr.map((item, index) => (
          <li key={index}>{item} </li>
        ))}
      </ul>
    );
    handleClick();
  }

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);

  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error" style={{ fontSize: "12px" }}>
          {formik.errors[name]}
        </small>
      )
    );
  };

  return (
    <div>
      <form
        id="my-form"
        className="p-fluid fluid formgrid grid"
        onSubmit={formik.handleSubmit}
      >
        <div className="col-6 px-3 py-1">
          <div className="flex py-1 h-full mx-2">
            <div className="field-preview-label pt-2">
              <div className="field-preview-label-text">
                <div className="field-require text-sm">Mã</div>
              </div>
            </div>
            <div className="pt-2 flex-1 overflow-hidden field-content">
              <div className="field">
                <span className="">
                  <InputText
                    id="code"
                    name="code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": isFormFieldValid("name"),
                    })}
                  />
                </span>
                {getFormErrorMessage("code")}
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 px-3 py-1">
          <div className="flex py-1 h-full mx-2">
            <div className="field-preview-label pt-2">
              <div className="field-preview-label-text">
                <div className="field-require text-sm">Tên</div>
              </div>
            </div>
            <div className="pt-2 flex-1 overflow-hidden field-content">
              <div className="field">
                <span className="">
                  <InputText
                    id="name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    className={classNames({
                      "p-invalid": isFormFieldValid("name"),
                    })}
                  />
                </span>
                {getFormErrorMessage("name")}
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 px-3 py-1">
          <div className="flex py-1 h-full mx-2">
            <div className="field-preview-label pt-2">
              <div className="field-preview-label-text">
                <div className="field-require text-sm">Dòng sản phẩm</div>
              </div>
            </div>
            <div className="pt-2 flex-1 overflow-hidden field-content">
              <div className="field">
                <span className="">
                  <Dropdown
                    id="family"
                    name="family"
                    value={formik.values.family}
                    options={familyList}
                    onChange={formik.handleChange}
                    optionValue="name"
                    optionLabel="name"
                  />
                </span>
                {getFormErrorMessage("family")}
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 px-3 py-1">
          <div className="flex py-1 h-full mx-2">
            <div className="field-preview-label pt-2">
              <div className="field-preview-label-text">
                <div className="text-sm">Thời hạn bảo hành</div>
              </div>
            </div>
            <div className="pt-2 flex-1 overflow-hidden field-content">
              <div className="field">
                <span className="">
                  <InputText
                    id="warranty"
                    name="warranty"
                    value={formik.values.warranty}
                    onChange={formik.handleChange}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 px-3 py-1">
          <div className="flex py-1 h-full mx-2">
            <div className="field-preview-label pt-2">
              <div className="field-preview-label-text">
                <div className="text-sm">Loại giải pháp</div>
              </div>
            </div>
            <div className="pt-2 flex-1 overflow-hidden field-content">
              <div className="field">
                <span className="">
                  <Dropdown
                    id="solution"
                    name="solution"
                    value={formik.values.solution}
                    options={solutionList}
                    onChange={formik.handleChange}
                    optionValue="name"
                    optionLabel="name"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 px-3 py-1">
          <div className="flex py-1 h-full mx-2">
            <div className="field-preview-label pt-2">
              <div className="field-preview-label-text">
                <div className="text-sm">Loại bảo hành</div>
              </div>
            </div>
            <div className="pt-2 flex-1 overflow-hidden field-content">
              <div className="field">
                <span className="">
                  <Dropdown
                    id="unit"
                    name="unit"
                    value={formik.values.unit}
                    options={unitList}
                    onChange={formik.handleChange}
                    optionValue="name"
                    optionLabel="name"
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 px-3 py-1">
          <div className="flex py-1 h-full mx-2">
            <div className="field-preview-label pt-2">
              <div className="field-preview-label-text">
                <div className="text-sm">Mô tả</div>
              </div>
            </div>
            <div className="pt-2 flex-1 overflow-hidden field-content">
              <div className="field">
                <span className="">
                  <InputTextarea
                    id="detail"
                    name="detail"
                    value={formik.values.detail}
                    onChange={formik.handleChange}
                    rows={5}
                    cols={30}
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
