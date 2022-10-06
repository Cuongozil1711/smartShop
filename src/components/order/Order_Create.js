import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {Dropdown} from "primereact/dropdown";
import { DataTable } from 'primereact/datatable';
import {Column} from "primereact/column";
import {ItemsService} from "../../service/ItemsService";
import {CustomerService} from "../../service/CustomerService";
import {OrderService} from "../../service/OrderService";
import {dvt, getCode} from "../../assets/untils/const";
import {InputNumber} from "primereact/inputnumber";


function Order_Create(props, ref) {
    const { afterSubmit } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const itemDefault = {idReceiptImport: "", idItems: null, priceItemsDtos: [], dvtCode : "000",  quantity: 0, totalInWareHouse: 0, priceItem: 0, priceSale: 0, checkQuantity: false, totalPrice: 0, idCustomer: null, name: "", donate: "", idPromotion: null ,detailItems: []};
    const dataDefault = {code: getCode("OR"), name: "", totalPrice: 0, totalPriceSale: 0, idCustomer: null,  data: [itemDefault]};
    const [itemData, setItemData] = useState(dataDefault);
    const [customer, setCustomer] = useState(dataDefault);
    const [submitted, setSubmitted] = useState(false);
    const [items, setItems] = useState([]);
    useEffect(() => {
        ItemsService.getList().then((res) => {
            setItems(res?.data)
        })

        CustomerService.search({
            page: 0,
            size: 99,
            search: "",
        }).then((res) => {
            setCustomer(res?.data?.content);
        })

    }, []);

    const validate = (props) => {
        let check = 0;
        Object.keys(props).forEach((prop) => {
            if(itemData[prop] === null && itemData[prop]?.length === 0){
                check++;
            }
        });
        return check;
    }

    const submit = async () => {
        setSubmitted(true);
        if(validate(itemData) > 0) return;

        let filter = itemData.data.filter(value => value.idItems != null);
        if(filter.length > 0){
            const detailsItemOrders = [];
            filter.forEach(value => {
                const data = {
                    dvtCode: value?.dvtCode,
                    quality: value?.quantity,
                    idItems: value?.idItems,
                    idReceiptImport: value?.idReceiptImport,
                    idPromotion: value?.idPromotion
                }
                detailsItemOrders.push(data);
            })
            const dataRequest = {
                detailsItemOrders: detailsItemOrders,
                name: itemData?.name,
                idCustomer: itemData?.idCustomer
            }
            console.log(dataRequest);
            switch (refEditMode.current) {
                case Enumeration.crud.create:
                    OrderService.createOrder(dataRequest).then(res => {
                        if (afterSubmit && typeof afterSubmit === "function") {
                            setShow(false);
                            afterSubmit(refEditMode.current, res?.data);
                        }
                    })
                    break;
                case  Enumeration.crud.edit:
                    break;
            }
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
        if(name === "idCustomer"){
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

    const onInputChangeItem = (value, rowIndex, key) => {
        debugger
        let total = 0;
        itemData.data.forEach((value1, index) => {
            if(value1.idItems != null){
                if(index === rowIndex && key === 'quantity'){
                    total += value * value1.priceItem;
                }
                else total += value1.quantity * value1.priceItem;
            }
        })

        itemData.data.map( (value1, index) => {
            if (index === rowIndex) {
                if (key === 'quantity') {
                    if (value1.idItems != null) {
                        if (items.find(i => i.id === value1.idItems)?.totalInWareHouse < parseInt(value) * items.find(i => i.id === value1.idItems)?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.quality) {
                            value1.checkQuantity = true;
                        } else {
                            value1.quantity = parseInt(value);
                            value1.checkQuantity = false;
                        }
                        if(value1.quantity === 0){
                            value1.priceSale = 0;
                        }
                        else{
                            value1.priceSale = value1.quantity * value1.priceItem;
                        }
                        const checkDonate =  renderDonate(value1, total);
                        value1.donate = checkDonate?.name;
                        value1.priceSale = checkDonate?.priceSale;
                        value1.idPromotion = checkDonate?.idPromotion;
                        return value1;
                    }
                } else if (key === 'idReceiptImport') {
                    value1.idReceiptImport = value;
                    return value1;
                } else if (key === 'dvtCode') {
                    value1.dvtCode = value;
                    value1.priceItem = items.filter(i => i.id === value1?.idItems)[0]?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.priceItems;
                    value1.priceSale = items.filter(i => i.id === value1?.idItems)[0]?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.priceItems;
                    return value1;
                } else {
                    value1.idItems = value;
                    value1.promotionResponseDto = items.filter(i => i.id === value)[0]?.promotionResponseDto;
                    value1.priceItemsDtos = items.filter(i => i.id === value)[0]?.priceItemsDtos.map(
                        (p) => {
                            p.name = findNameByDvt(p?.dvtCode);
                            return p;
                        }
                    );
                    value1.dvtCode = items.filter(i => i.id === value)[0]?.priceItemsDtos[0]?.dvtCode;
                    value1.priceItem = items.filter(i => i.id === value)[0]?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.priceItems;
                    value1.priceSale = items.filter(i => i.id === value)[0]?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.priceItems;
                    value1.totalInWareHouse = items.filter(i => i.id === value)[0]?.totalInWareHouse ?? 0;
                    const checkDonate =  renderDonate(value1, total);
                    value1.donate = checkDonate?.name;
                    value1.idPromotion = checkDonate?.idPromotion;
                    value1.priceSale = checkDonate?.priceSale ?? value1.priceItem;
                    if(value1.quantity === 0){
                        value1.priceSale = 0;
                    }
                    return value1;
                }
            }
            else{
                const checkDonate =  renderDonate(value1, total);
                value1.donate = checkDonate?.name;
                value1.priceSale = checkDonate?.priceSale;
                value1.idPromotion = checkDonate?.idPromotion;
                return value1;
            }
        })

        let totalSale = 0;
        itemData.data.forEach((value1, index) => {
            if(value1.idItems != null){
                totalSale += value1?.priceSale ?? 0;
            }
        })

        setItemData({
            ...itemData,
            totalPrice: total,
            totalPriceSale: totalSale
        });
    }


    const addItem = () => {
        itemData.data.push(itemDefault);
        setItemData({
            ...itemData,
        })
    }

    const removeItem = (rowIndex) => {
        itemData.data.splice(rowIndex, 1);
        let total = 0;
        itemData.data.forEach(value1 => {
            if(value1.idItems != null){
                total += value1.quantity * value1.priceItem;
            }
        })
        setItemData({
            ...itemData,
            totalPrice: total
        })

        console.log(itemData);
    }

    const textEditor = (options) => {
        return <InputNumber  mode="decimal" type="text" value={options.value}  onChange={(e) => onInputChangeItem(e.value, options?.rowIndex, 'quantity')} />;
    }

    const textEditorIdReceiptImport = (options) => {
        return <InputText  type="text" value={options.value}  onChange={(e) => onInputChangeItem(e.target.value, options?.rowIndex, 'idReceiptImport')} />;
    }

    const textEditorItem = (options) => {
        return <Dropdown value={options.value}  filter showClear filterBy="name" optionValue="id" onChange={(e) => onInputChangeItem(e.value,  options?.rowIndex, 'idItems')} options={items} optionLabel="name" placeholder="Select" />;
    }

    const findNameByDvt = (typeCode) => {
        return dvt.find(e => e.dvtCode === typeCode)?.name ?? "";
    }

    const textEditorDvt = (options) => {
        return <Dropdown value={options?.dvtCode} optionValue="dvtCode"  options={options?.rowData?.priceItemsDtos} onChange={(e) => onInputChangeItem(e.value,  options?.rowIndex, 'dvtCode')} optionLabel="name" placeholder="Select" />;
    }

    const renderDonate =  (d, total) => {
        if(d?.promotionResponseDto?.length > 0){
            let promotion = d?.promotionResponseDto[0]?.promotion;
            debugger
            let condition = d?.promotionResponseDto[0]?.condition;
            if(promotion?.typePromotion === 'donate'){
                let donate = d?.promotionResponseDto[0]?.itemsDonate;
                if(condition.typeCondition === '000'){
                    return {
                        name: donate?.quanlity + ' ' + items.find(i => i.id === donate?.idItems)?.name,
                        idPromotion: promotion?.id,
                        priceSale: d?.priceSale
                    };
                }
                else if(condition.typeCondition === '001'){
                    if(condition.totalPrice <= total){
                        return {
                            name: donate?.quanlity + ' ' + items.find(i => i.id === donate?.idItems)?.name,
                            idPromotion: promotion?.id,
                            priceSale: d?.priceSale
                        };
                    }
                }
                else if(condition.typeCondition === '002'){
                    if(condition.totalQuantity <= d?.quantity){
                        return {
                            name: donate?.quanlity + ' ' + items.find(i => i.id === donate?.idItems)?.name,
                            idPromotion: promotion?.id,
                            priceSale: d?.priceSale
                        };
                    }
                }
            }

            if(promotion?.typePromotion === 'product'){
                if(condition.typeCondition === '000'){
                    if(promotion?.type === 'percent'){
                        return {
                            name: promotion?.percent + '%',
                            idPromotion: promotion?.id,
                            priceSale: d?.priceSale - d?.priceSale * promotion?.percent /100
                        }
                    }
                    else{
                        return {
                            name: promotion?.price + 'VNĐ',
                            priceSale: d?.priceSale - promotion?.price,
                            idPromotion: promotion?.id
                        }
                    }
                }
                else if(condition.typeCondition === '001'){
                    if(condition?.totalPrice <= total){
                        if(promotion?.type === 'percent'){
                            return {
                                name: promotion?.percent + '%',
                                idPromotion: promotion?.id,
                                priceSale: d?.priceSale - d?.priceSale * promotion?.percent /100
                            }
                        }
                        else{
                            return {
                                name: promotion?.price + 'VNĐ',
                                idPromotion: promotion?.id,
                                priceSale: d?.priceSale - promotion?.price,
                            }
                        }
                    }
                }
                else if(condition.typeCondition === '002'){
                    if(condition.totalQuantity <= d?.quantity){
                        if(promotion?.type === 'percent'){
                            return {
                                name: promotion?.percent + '%',
                                idPromotion: promotion?.id,
                                priceSale: d?.priceSale - d?.priceSale * promotion?.percent /100
                            }
                        }
                        else{
                            return {
                                name: promotion?.price + 'VNĐ',
                                idPromotion: promotion?.id,
                                priceSale: d?.priceSale - promotion?.price,
                            }
                        }
                    }
                }
            }

        }
        return {
            name: null,
            idPromotion: null,
            priceSale: d?.priceSale
        };
    }


    return (
        <Dialog
            visible={show}
            style={{ width: '1150px' }}
            header="Đơn hàng"
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
                    <div className="formgrid grid">
                        <div className="field">
                            <label htmlFor="name">Mã đơn hàng</label>
                            <InputText id="name" disabled={true} value={itemData.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.code })} />
                            {submitted && !itemData.code && <small className="p-invalid">Code is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Tên khách hàng <span className="text-red-600">*</span></label>
                            <Dropdown value={itemData?.idCustomer} optionValue="id" onChange={(e) => onInputChange(e.value,'idCustomer')} options={customer} optionLabel="name" placeholder="Select" />
                            {submitted && !itemData.idCustomer && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Tên đơn hàng <span className="text-red-600">*</span></label>
                            <InputText id="name" value={itemData.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.name })} />
                            {submitted && !itemData.name && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                        </div>
                    </div>

                    <div className="field">
                        <label htmlFor="name">Chọn sản phẩm</label>
                        <DataTable
                            value={itemData.data}
                            responsiveLayout="scroll"
                        >
                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '4%' }}
                                header={"STT"}
                                body={(d, row) => {
                                    return <> {row.rowIndex + 1} </>
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Sản phẩm"}
                                editor={(options) => textEditorItem(options)}
                                body={(d) => {
                                    return <>
                                        <Dropdown value={d?.idItems ?? 0} filter showClear filterBy="name" optionValue="id" options={items} optionLabel="name" placeholder="Select"/>
                                        <small className="p-invalid text-red-600">{d?.promotionResponseDto?.[0]?.promotion?.name}</small>
                                    </>
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '18%' }}
                                header={"Đơn vị tính"}
                                editor={(options) => textEditorDvt(options)}
                                body={(d) => {
                                    return <Dropdown value={d?.dvtCode} optionValue="dvtCode"  options={d?.priceItemsDtos} optionLabel="name" placeholder="Select" />
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Mã phiếu"}
                                editor={(options) => textEditorIdReceiptImport(options)}
                                body={(d) => {
                                    return  <>
                                        <InputText  id="quantity" value={d?.idReceiptImport} className={!d?.idReceiptImport && "p-invalid block"}/>
                                    </>
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '8%' }}
                                header={"Giá"}
                                body={(d, row) => {
                                    return <>{Intl.NumberFormat('en-VI').format(d?.priceItem) ?? ""}</>;
                                }}
                            ></Column>


                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '10%' }}
                                header={"Khuyến mại"}
                                body={(d, row) => {
                                    return <>{d?.donate?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '10%' }}
                                header={"Số lượng"}
                                editor={(options) => textEditor(options)}
                                body={(d) => {
                                    if(d?.checkQuantity){
                                        return  <>
                                            <InputNumber id="quantity" value={d?.quantity} className="p-invalid block"/>
                                        </>
                                    }
                                    else{
                                        return  <>
                                            <InputNumber id="quantity" value={d?.quantity}/>
                                        </>
                                    }
                                }}
                            ></Column>


                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '10%' }}
                                header={"Thành tiền"}
                                body={(d, row) => {
                                    return <>{Intl.NumberFormat('en-VI').format(d?.priceSale) ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '10%' }}
                                header={"Thao tác"}
                                body={(d, row) => {
                                    return <>
                                        <Button icon="pi pi-plus" className="p-button-rounded  p-button-text" onClick={() => addItem(row.rowIndex)} />
                                        <Button icon="pi pi-minus" className="p-button-rounded  p-button-text p-button-text" onClick={() => removeItem(row.rowIndex)} />
                                    </>
                                }}
                            ></Column>
                        </DataTable>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col-8">
                        </div>
                        <div className="field col-2">
                            <label htmlFor="name">Tổng tiền</label>
                            <InputText id="name" disabled={true} value={Intl.NumberFormat('en-VI').format(itemData.totalPrice)}/>
                        </div>
                        <div className="field col-2">
                            <label htmlFor="name">Tiền khách thanh toán</label>
                            <InputText id="name" disabled={true} value={Intl.NumberFormat('en-VI').format(itemData.totalPriceSale)}/>
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    )

}

Order_Create = forwardRef(Order_Create);

export default Order_Create;
