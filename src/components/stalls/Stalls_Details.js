import React, {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {StallsService} from "../../service/StallsService";
import {getCode} from "../../assets/untils/const";


function Stalls_Details(props, ref) {
    const { afterSubmit } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {name: "", code: getCode('ST'), address: ""};
    const [itemData, setItemData] = useState(dataDefault)
    const [submitted, setSubmitted] = useState(false);

    const validate = (props) => {
        let check = 0;
        Object.keys(props).forEach((prop) => {
            if(itemData[prop].length < 0){
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
                StallsService.create(itemData).then(
                    (res) => {
                        if (afterSubmit && typeof afterSubmit === "function") {
                            setShow(false);
                            afterSubmit(refEditMode.current, res?.data);
                        }
                    }
                )
                break;
            case  Enumeration.crud.edit:
                StallsService.edit(itemData.id ,itemData).then(
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
            header="Qu???y h??ng"
            modal
            className="p-fluid"
            footer={() => (
                <>
                    <Button className="p-button-text" label={"H???y"} onClick={() => cancel()}></Button>
                    <Button className="primary" label={"L??u"} onClick={() => submit(true)}></Button>
                </>
            )}
            onHide={cancel}
        >
            {show && (
                <div>
                    <div className="field">
                        <label htmlFor="name">M?? qu???y h??ng</label>
                        <InputText id="name" disabled={true} value={itemData.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.code })} />
                        {submitted && !itemData.code && <small className="p-invalid">Code is required.</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="name">T??n qu???y h??ng <span className="text-red-600">*</span></label>
                        <InputText id="name" value={itemData.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.name })} />
                        {submitted && !itemData.name && <small className="text-red-600 p-invalid">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                    </div>

                    <div className="field">
                        <label htmlFor="name">?????a ch??? <span className="text-red-600">*</span></label>
                        <InputText id="name" value={itemData.address} onChange={(e) => onInputChange(e, 'address')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.address })} />
                        {submitted && !itemData.address && <small className="text-red-600 p-invalid">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                    </div>
                </div>
            )}
        </Dialog>
    )

}

Stalls_Details = forwardRef(Stalls_Details);

export default Stalls_Details;
