import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {CategoryService} from "../../service/CategoryService";
import {dvt, getCode} from "../../assets/untils/const";
import { MultiSelect } from 'primereact/multiselect';


function Category_Details(props, ref) {
    const { afterSubmit } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {name: "", code: getCode('CA'), unit: []};
    const [selectedCities2, setSelectedCities2] = useState(null);
    const [itemData, setItemData] = useState(dataDefault)
    const [submitted, setSubmitted] = useState(false);

    const validate = (props) => {
        let check = 0;
        Object.keys(props).forEach((prop) => {
            if(prop === 'unit'){
                if(itemData.unit.length === 0){
                    check+=1;
                }
            }
            else{
                if(itemData[prop].length === 0){
                    check+=1;
                }
            }
        });
        return check;
    }

    const submit = async () => {
        setSubmitted(true);
        if(validate(itemData) > 0) return;

        console.log(itemData);

        switch (refEditMode.current) {
            case Enumeration.crud.create:
                CategoryService.create(itemData).then(
                    (res) => {
                        if (afterSubmit && typeof afterSubmit === "function") {
                            setShow(false);
                            afterSubmit(refEditMode.current, res?.data);
                        }
                    }
                )
                break;
            case  Enumeration.crud.edit:
                CategoryService.edit(itemData.id ,itemData).then(
                    (res) => {
                        if (afterSubmit && typeof afterSubmit === "function") {
                            setShow(false);
                            afterSubmit(refEditMode.current, res?.data);
                        }
                    }
                )
                break;
        }
    }

    const groupedItemTemplate = (option) => {
        return (
            <div className="flex align-items-center country-item">
                <img alt={option.label} src="images/unit.png" onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} className={`flag flag-${option.code.toLowerCase()}`} />
                <div>{option.label}</div>
            </div>
        );
    }


    /**
     * cancel
     */
    const cancel = () => {
        setShow(false);
    };

    useImperativeHandle(ref, () => ({
        /**
         * create
         */
        create: (type, _defaultDictionary) => {
            refEditMode.current = Enumeration.crud.create;
            setItemData(dataDefault);
            setShow(true);
        },

        edit: (d) => {
            setItemData(d);
            refEditMode.current = Enumeration.crud.edit;
            setShow(true);
        }

    }));

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...itemData };
        _product[`${name}`] = val;
        setItemData(_product);
    }


    return (
        <Dialog
            visible={show}
            style={{ width: '450px' }}
            header="Product Details"
            modal
            className="p-fluid"
            footer={() => (
                <>
                    <Button className="p-button-text" label={"Hủy"} onClick={() => cancel()}></Button>
                    <Button className="primary" label={"Lưu"} onClick={() => submit(true)}></Button>
                </>
            )}
            onHide={cancel}
        >
            {show && (
                <div>
                    <div className="field">
                        <label htmlFor="name">Mã loại</label>
                        <InputText id="name"  disabled={true} value={itemData.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.code })} />
                        {submitted && !itemData.code && <small className="p-invalid"></small>}
                    </div>

                    <div className="field">
                        <label htmlFor="name">Tên loại <span className="text-red-600">*</span></label>
                        <InputText id="name" value={itemData.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.name })} />
                        {submitted && !itemData.name && <small className="text-red-600 p-invalid">Dữ liệu không được để trống</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="name">Đơn vị tính <span className="text-red-600">*</span></label>
                        <MultiSelect value={itemData.unit} options={dvt} onChange={(e) => {
                            onInputChange(e, 'unit')
                        }}  optionLabel="name" placeholder="Chọn sản phẩm" display="chip"/>
                        {submitted && itemData.unit.length === 0  && <small className="text-red-600 p-invalid">Dữ liệu không được để trống</small>}
                    </div>

                </div>
            )}
        </Dialog>
    )

}

Category_Details = forwardRef(Category_Details);

export default Category_Details;
