import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {CustomerService} from "../../service/CustomerService";
import {getCode} from "../../assets/untils/const";


function Customer_Details(props, ref) {
    const { afterSubmit } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {name: "", code: getCode('CU'), address: "", tel: ""};
    const [itemData, setItemData] = useState(dataDefault)
    const [submitted, setSubmitted] = useState(false);

    const validate = (props) => {
        let check = 0;
        Object.keys(props).forEach((prop) => {
            if(itemData[prop].length === 0 && prop !== 'address'){
                check+=1;
            }
        });
        return check;
    }

    const submit = async () => {
        setSubmitted(true);
        if(validate(itemData) > 0) return;

        switch (refEditMode.current) {
            case Enumeration.crud.create:
                CustomerService.create(itemData).then(
                    (res) => {
                        if (afterSubmit && typeof afterSubmit === "function") {
                            setShow(false);
                            afterSubmit(refEditMode.current, res?.data);
                        }
                    }
                )
                break;
            case  Enumeration.crud.edit:
                CustomerService.edit(itemData.id ,itemData).then(
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
            header="Customer Details"
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
                        <label htmlFor="name">Mã khách hàng</label>
                        <InputText id="name" disabled={true} value={itemData.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.code })} />
                        {submitted && !itemData.code && <small className="p-invalid">Code is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="name">Tên khách hàng <span className="text-red-600">*</span></label>
                        <InputText id="name" value={itemData.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.name })} />
                        {submitted && !itemData.name && <small className="text-red-600 p-invalid">Tên không được để trống</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="name">Địa chỉ</label>
                        <InputText id="name" value={itemData.address} onChange={(e) => onInputChange(e, 'address')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.address })} />
                    </div>

                    <div className="field">
                        <label htmlFor="name">Số điện thoại <span className="text-red-600">*</span></label>
                        <InputText id="name" value={itemData.tel} onChange={(e) => onInputChange(e, 'tel')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.tel })} />
                        {submitted && !itemData.tel && <small className="text-red-600 p-invalid">Số điện thoại không được để trống</small>}
                    </div>
                </div>
            )}
        </Dialog>
    )

}

Customer_Details = forwardRef(Customer_Details);

export default Customer_Details;
