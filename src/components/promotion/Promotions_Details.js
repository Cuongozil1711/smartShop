import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import classNames from "classnames";
import {ItemsService} from "../../service/ItemsService";
import {Checkbox} from "primereact/checkbox";
import {Calendar} from "primereact/calendar";
import {Dropdown} from "primereact/dropdown";
import {donvi} from "../../assets/untils/const";
import {PromotionsService} from "../../service/PromotionsService";

function Promotions_Details(props, ref) {
    const { afterSubmit, toast } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {id: null, typePromotion: "product" ,totalQuantity: 0,
        totalPrice: 0, name: "", code: "", type: "percent", address: "", idItems: null,
        startDate: null, endDate: null, deleteFlg: 1, percent: null, price: null, idItemsDonate: null, quantity: 0};
    const [itemData, setItemData] = useState(dataDefault)
    const [submitted, setSubmitted] = useState(false);
    const [items, setItems] = useState([]);
    const [typeCondition, setTypeCondition] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [checked, setChecked] = useState(false);
    const [checked1, setChecked1] = useState(false);

    useEffect(() => {
        ItemsService.search({
            page: 0,
            size: 99,
            search: "",
        }).then((res) => {
            setItems(res?.data?.content)
        })
    }
    , [])


    const validate = () => {
        let check = 0;
        const props = itemData.typePromotion === 'product' ? {
                totalPrice: null,
                percent: null,
                type: null,
                idItems: null,
                startDate: null,
                endDate: null
            } : {
                    idItemsDonate: null,
                    quantity: null,
                    idItems: null,
                    totalPrice: null,
                    totalQuantity: null,
                    startDate: null,
                    endDate: null
                }
        Object.keys(props).forEach((prop) => {
            if(itemData[prop] === null || itemData[prop]?.length === 0) {
                console.log(prop);
                check+=1
            }

        });
        return check;
    }

    const submit = async () => {
        setSubmitted(true);
        // validate(itemData);

        if(validate() > 0) return;

        switch (refEditMode.current) {
            case Enumeration.crud.create:
                PromotionsService.createPromotions({
                    ...itemData,
                    typeCondition: typeCondition[0]
                }).then(
                    (res) => {
                        if(res?.status === 200){
                            if(res?.data){
                                if (afterSubmit && typeof afterSubmit === "function") {
                                    setShow(false);
                                    afterSubmit(refEditMode.current, res?.data);
                                }
                                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'T???o khuy???n m???i th??nh c??ng', life: 3000 });
                            }
                            else{
                                toast.current.show({ severity: 'error', content: "Kh??ng th??? t???o" + itemData?.name});
                            }
                        }
                    }
                )
                    .catch((ex) => {
                        toast.current.show({ severity: 'error', content: ex.message ?? "Network Error"});
                    })
                break;
            case  Enumeration.crud.edit:
                PromotionsService.edit(itemData.id ,itemData).then(
                    (res) => {
                        if(res?.status === 200){
                            if(res?.data){
                                if (afterSubmit && typeof afterSubmit === "function") {
                                    setShow(false);
                                    afterSubmit(refEditMode.current, res?.data);
                                }
                                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'L??u th??nh c??ng', life: 3000 });
                            }
                            else{
                                toast.current.show({ severity: 'error', content: "Kh??ng th??? t???o" + itemData?.name});
                            }
                        }
                    }
                )
                    .catch((ex) => {
                        toast.current.show({ severity: 'error', content: ex.message ?? "Network Error"});
                    })
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
            setDisabled(false);
            setShow(true);
            setChecked(false);
            setChecked1(false);
        },

        edit: (d, check) => {
            setDisabled(!check);
            const data = {
                id: d?.promotion?.id,
                idItemsDonate: d?.itemsDonate?.idItems,
                quantity: d?.itemsDonate?.quanlity,
                typePromotion: d?.promotion?.typePromotion,
                totalQuantity: d?.condition?.totalQuantity,
                typeCondition: d?.condition?.typeCondition,
                totalPrice: d?.condition?.totalPrice,
                name: d?.promotion?.name,
                code: d?.promotion?.code,
                type: d?.promotion?.type,
                deleteFlg: d?.promotion?.deleteFlg,
                address: "",
                idItems: d?.promotion?.idItems,
                startDate: new Date(d?.promotion?.dateFrom),
                endDate: new Date(d?.promotion?.dateEnd),
                percent: d?.promotion?.percent,
                price:  d?.promotion?.price
            }

            if(data?.typeCondition === 'product'){
                setChecked1(true);
                setChecked(false);
            }
            else if(data?.typeCondition === 'donate'){
                setChecked(true);
                setChecked1(false);
            }
            setTypeCondition([d?.condition?.typeCondition])
            console.log(data);
            setItemData(data);
            refEditMode.current = Enumeration.crud.edit;
            setShow(true);
        }

    }));

    const onInputChange = (e, name) => {
        console.log(e);
        if(name === 'deleteFlg'){
            if(e.checked){
                let _product = { ...itemData };
                _product[`${name}`] = 1;
                setItemData(_product);
            }
            else{
                let _product = { ...itemData };
                _product[`${name}`] = 0;
                setItemData(_product);
            }
        }
        else if(name === 'idItemsDonate'){
            let _product = { ...itemData };
            _product[`${name}`] = e.value;
            setItemData(_product);
        }
        else if(name === 'idItems'){
            let _product = { ...itemData };
            _product[`${name}`] = e.value;
            setItemData(_product);
        }
        else if(name === 'type'){
            let _product = { ...itemData, percent: null, price: null };
            _product[`${name}`] = (e.target && e.target.value) || '';
            setItemData(_product);
        }
        else{
            const val = (e.target && e.target.value) || '';
            let _product = { ...itemData };
            _product[`${name}`] = val;
            setItemData(_product);
        }
    }

    const onCityChange = (e) => {
        let selectedCities = [];

        if (e.checked){
            selectedCities.push(e.value);
            if(e.value === '000'){
                setItemData({
                    ...itemData,
                    totalPrice: 0,
                    totalQuantity: 0,
                })
            }
            else if(e.value === '001'){
                setItemData({
                    ...itemData,
                    totalQuantity: 0,
                })
            }else if(e.value === '002'){
                setItemData({
                    ...itemData,
                    totalPrice: 0,
                })
            }
        }
        setTypeCondition(selectedCities);
    }


    return (
        <Dialog
            visible={show}
            style={{ width: '650px' }}
            header="Ch????ng tr??nh khuy???n m???i"
            modal
            className="p-fluid"
            footer={() => (
                <>
                    <Button  className="p-button-text" label={"H???y"} onClick={() => cancel()}></Button>
                    <Button  className="primary" label={"L??u"} onClick={() => submit(true)}></Button>
                </>
            )}
            onHide={cancel}
        >
            {show && (
                <div className={"row"}>

                    <div className="formgrid row gird">
                        <div className="field col-5">
                            <Button  label={"Gi???m gi?? s???n ph???m"} disabled={itemData.typePromotion === 'donate' && refEditMode.current === Enumeration.crud.edit} onClick={() => setItemData({
                                ...itemData,
                                typePromotion: 'product'
                            })} icon="pi pi-book" style={{'background': itemData.typePromotion === 'product' ? '#6366F1' : '#c3c3c3', 'border' : 'none'}}></Button>
                        </div>
                        <div className="field col-5">
                            <Button  label={"T???ng k??m s???n ph???m"} disabled={itemData.typePromotion === 'product' && refEditMode.current === Enumeration.crud.edit} onClick={() => setItemData({
                                ...itemData,
                                typePromotion: 'donate'
                            })} icon="pi pi-book"  style={{'background': itemData.typePromotion === 'donate' ? '#6366F1' : '#c3c3c3', 'border' : 'none'}}  ></Button>
                        </div>
                    </div>

                    <div className="formgrid row gird">
                        <div className="field col-6">
                            <label htmlFor="name">T??n khuy???n m???i <span className="text-red-600">*</span></label>
                            <InputText disabled={disabled}  id="quantity" value={itemData?.name}  onChange={(e) => onInputChange(e,'name')}/>
                            {submitted && !itemData.name && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                        </div>
                    </div>

                    {
                        itemData?.typePromotion === 'product' &&
                            <>
                                <div className="formgrid row gird">
                                    <div className="field col-6">
                                        <label htmlFor="name">M???c gi???m <span className="text-red-600">*</span></label>
                                        {
                                            itemData?.type === 'vnd' && <>
                                            <InputNumber disabled={disabled} inputId="integeronly"  onValueChange={(e) => onInputChange(e, 'totalPrice')} value={itemData?.price}  style={{"width": "100%"}}/>
                                            {submitted && !itemData.totalPrice && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>} </>
                                        }
                                        {
                                            itemData?.type === 'percent' && <>
                                            <InputNumber disabled={disabled} inputId="integeronly" onValueChange={(e) => onInputChange(e, 'percent')} value={itemData?.percent} min={0} max={100}  prefix="%"  style={{"width": "100%"}}/>
                                            {submitted && !itemData.percent && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>} </>
                                        }
                                    </div>
                                    <div className="field col-3">
                                        <label htmlFor="name">????n v??? <span className="text-red-600">*</span></label>
                                        <Dropdown disabled={disabled} value={itemData?.type} optionValue="code" onChange={(e) => onInputChange(e,'type')} options={donvi} optionLabel="name" placeholder="Select" />
                                        {submitted && !itemData.type && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                                    </div>
                                </div>
                            </>
                    }

                    {
                        itemData?.typePromotion === 'donate' &&
                            <>
                            <div className="formgrid row gird">
                                <div className="field col-6">
                                    <label htmlFor="name">S???n ph???m ????nh k??m <span className="text-red-600">*</span></label>
                                    <Dropdown disabled={disabled} value={itemData?.idItemsDonate} optionValue="id" options={items} onChange={(e) => {
                                        console.log(e.value);
                                        onInputChange(e, 'idItemsDonate')
                                    }}  optionLabel="name" placeholder="Ch???n s???n ph???m" display="chip"/>
                                    {submitted && itemData.idItemsDonate.length === 0 && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                                </div>
                                <div className="field col-3">
                                    <label htmlFor="name">S??? l?????ng <span className="text-red-600">*</span></label>
                                    <InputNumber disabled={disabled} inputId="integeronly"  onValueChange={(e) => onInputChange(e, 'quantity')} value={itemData?.quantity}  style={{"width": "100%"}}/>
                                    {submitted && itemData.quantity.length === 0 && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                                </div>
                            </div>
                            </>
                    }

                    <div className="formgrid row gird">
                        <div className="field col-6">
                            <label htmlFor="name">S???n ph???m ??p d???ng <span className="text-red-600">*</span></label>
                            <Dropdown disabled={disabled} value={itemData?.idItems} optionValue="id" options={items} onChange={(e) => {
                                console.log(e.value);
                                onInputChange(e, 'idItems')
                            }}  optionLabel="name" placeholder="Ch???n s???n ph???m" display="chip"/>
                            {submitted && !itemData.idItems && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}

                        </div>
                    </div>

                    <div className="formgrid row gird">
                        <div className="field col-6">
                            <label htmlFor="name">??i???u ki???n ????n t???i thi???u <span className="text-red-600">*</span></label>
                            <div className="field-checkbox">
                                <Checkbox disabled={disabled} inputId="city1" name="item" value="000" onChange={onCityChange} checked={typeCondition.indexOf('000') !== -1} />
                                <label htmlFor="city1">Kh??ng y??u c???u</label>
                            </div>
                            <div className="field-checkbox">
                                <Checkbox disabled={disabled} inputId="city2" name="item" value="001" onChange={onCityChange} checked={typeCondition.indexOf('001') !== -1} />
                                <label htmlFor="city2">Gi?? tr??? t???i thi???u mua</label>
                            </div>
                            {typeCondition.indexOf('001') !== -1 && <div className="field-checkbox">
                                {typeCondition.indexOf('001') !== -1 && <InputNumber disabled={disabled} inputId="integeronly" id="name" value={itemData.totalPrice} onValueChange={(e) => onInputChange(e, 'totalPrice')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.totalPrice })} />}
                                {submitted && !itemData.totalPrice && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                            </div>}
                            <div className="field-checkbox">
                                <Checkbox disabled={disabled} inputId="city3" name="item" value="002" onChange={onCityChange} checked={typeCondition.indexOf('002') !== -1} />
                                <label htmlFor="city3">S??? l?????ng s???n ph???m t???i thi???u</label>
                            </div>
                            {typeCondition.indexOf('002') !== -1 && <div className="field-checkbox">
                                {typeCondition.indexOf('002') !== -1 && <InputNumber disabled={disabled} inputId="integeronly" id="name" value={itemData.totalQuantity} onValueChange={(e) => onInputChange(e, 'totalQuantity')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.totalQuantity })} />}
                                {submitted && !itemData.totalQuantity && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                            </div>}
                        </div>
                    </div>

                    <div className="formgrid row gird">
                        <label htmlFor="name">Th???i gian hi???u l???c</label>
                        <div className="col-12 flex justify-content-between" style={{"flex-direction": "row"}}>
                            <div className="field col-6 md:col-4">
                                <label htmlFor="basic">Th???i gian t??? <span className="text-red-600">*</span></label>
                                <Calendar id="icon" disabled={disabled} value={itemData?.startDate} onChange={(e) => onInputChange(e, 'startDate')}  dateFormat="mm-dd-yy" />
                                {submitted && !itemData.startDate && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                            </div>
                            <div className="field col-6 md:col-4">
                                <label htmlFor="basic">Th???i gian ?????n <span className="text-red-600">*</span></label>
                                <Calendar id="icon" disabled={disabled}  value={itemData?.endDate} onChange={(e) => onInputChange(e, 'endDate')} dateFormat="mm-dd-yy" />
                                {submitted && !itemData.endDate && <small className="p-invalid text-red-600">D??? li???u kh??ng ???????c ????? tr???ng</small>}
                            </div>
                        </div>
                    </div>

                    <div className="formgrid row gird">
                        <div className="col-12 flex justify-content-start" style={{"flex-direction": "row"}}>
                            <label htmlFor="name" style={{"margin-right" : "5px"}}>S??? d???ng</label>
                            <div className="field-checkbox">
                                <Checkbox  inputId="city1" name="item" value="000"  onChange={(e) => onInputChange(e, 'deleteFlg')} checked={itemData?.deleteFlg === 1} />
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </Dialog>
    )

}

Promotions_Details = forwardRef(Promotions_Details);

export default Promotions_Details;
