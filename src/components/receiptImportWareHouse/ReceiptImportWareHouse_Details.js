import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {Dropdown} from "primereact/dropdown";
import {ReceiptImportWareHouseService} from "../../service/ReceiptImportWareHouseService";
import {WareHouseService} from "../../service/WareHouseService";


function ReceiptImportWareHouse_Details(props, ref) {
    const { afterSubmit } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {name: "", code: "I",  idWareHouse: null};
    const [itemData, setItemData] = useState(dataDefault)
    const [submitted, setSubmitted] = useState(false);
    const [wareHouse, setWareHouse] = useState(null);

    useEffect(() => {
        WareHouseService.search({
            page: 0,
            size: 99,
        }).then((res) => {
            setWareHouse(res?.data?.content)
        })
    }, []);

    const validate = (props) => {
        let check = 0;
        Object.keys(props).forEach((prop) => {
            if(itemData[prop] === null || itemData[prop]?.length === 0){
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
                ReceiptImportWareHouseService.create(itemData).then(
                    (res) => {
                        if (afterSubmit && typeof afterSubmit === "function") {
                            setShow(false);
                            afterSubmit(refEditMode.current, res?.data);
                        }
                    }
                )
                break;
            case  Enumeration.crud.edit:
                ReceiptImportWareHouseService.edit(itemData.id ,itemData).then(
                    (res) => {
                        const dataArray = new FormData();
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
        if(name === "idWareHouse"){
            let _product = { ...itemData };
            _product[`${name}`] = e;
            setItemData(_product);
        }
        else{
            const val = (e.target && e.target.value) || '';
            let _product = { ...itemData };
            _product[`${name}`] = val;
            setItemData(_product);
        }
    }



    return (
        <Dialog
            visible={show}
            style={{ width: '450px' }}
            header="Chi tiết phiếu nhập"
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
                        <label htmlFor="name">Mã phiếu</label>
                        <InputText disabled={true} id="name" value={itemData.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.code })} />
                        {submitted && !itemData.code && <small className="p-invalid">Code is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="name">Tên phiếu nhập kho <span className="text-red-600">*</span></label>
                        <InputText id="name" value={itemData.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.name })} />
                        {submitted && !itemData.name && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="name">Chọn kho nhập hàng <span className="text-red-600">*</span></label>
                        <Dropdown value={itemData?.idWareHouse} optionValue="id" onChange={(e) => onInputChange(e.value,'idWareHouse')} options={wareHouse} optionLabel="name" placeholder="Select" />
                        {submitted && !itemData.idWareHouse && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                    </div>

                </div>
            )}
        </Dialog>
    )

}

ReceiptImportWareHouse_Details = forwardRef(ReceiptImportWareHouse_Details);

export default ReceiptImportWareHouse_Details;
