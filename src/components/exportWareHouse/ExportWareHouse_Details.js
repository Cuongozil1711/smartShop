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
import {dvt, getCode} from "../../assets/untils/const";
import {CustomerService} from "../../service/CustomerService";
import {ReceiptExportWareHouseService} from "../../service/ReceiptExportWareHouseService";
import {ExportWareHouseService} from "../../service/ExportWareHouseService";
import {InputNumber} from "primereact/inputnumber";


function ExportWareHouse_Details(props, ref) {
    const { afterSubmit, toast } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const itemDefault = {idReceiptImport: "",idItems: null, priceItemsDtos: [], dvtCode : "000",  quantity: 0, totalInWareHouse: 0, priceItem: 0, checkQuantity: false, totalPrice: 0, idCustomer: null, name: "", detailItems: []};
    const dataDefault = {code: getCode("EX"), totalPrice: 0, idReceiptExport: null,  data: [itemDefault]};
    const [itemData, setItemData] = useState(dataDefault);
    const [customer, setCustomer] = useState(dataDefault);
    const [submitted, setSubmitted] = useState(false);
    const [items, setItems] = useState([]);
    const [receiptExport, setReceiptExport] = useState([]);
    const [disabled, setDisabled] = useState(false);
    useEffect(() => {
        ItemsService.search({
            page: 0,
            size: 99,
            search: "",
        }).then((res) => {
            setItems(res?.data?.content)
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
            if(prop !== 'data'){
                if(itemData[prop] != null && itemData[prop]?.length === 0){
                    check+=1;
                }
            }
            else{
                itemData.data.forEach(e => {
                    if(!e.quantity){
                        check+=1;
                    }
                })
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
                    idReceiptImport: value?.idReceiptImport
                }
                detailsItemOrders.push(data);
            })
            const dataRequest = {
                data: detailsItemOrders,
                name: itemData?.name ?? '',
                code: itemData?.code,
                idReceiptExport: itemData?.idReceiptExport
            }
            switch (refEditMode.current) {
                case Enumeration.crud.create:
                    ExportWareHouseService.export(dataRequest).then(res => {
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

            ReceiptExportWareHouseService.search({
                page: 0,
                size: 99,
                search: "",
            }).then((res) => {
                setReceiptExport(res?.data?.content.filter(res => res.state === "PROCESSING"))
            })

            setItemData(dataDefault);
            setDisabled(false);
            setShow(true);
        },

        edit: (d) => {
            ReceiptExportWareHouseService.search({
                page: 0,
                size: 99,
                search: "",
            }).then((res) => {
                setReceiptExport(res?.data?.content.filter(res => res.state === "COMPLETE"))
            })
            if(d?.idReceiptExport){
                setDisabled(true);
                ExportWareHouseService.get(d?.idReceiptExport).then((res) =>{
                    if(res?.status === 200){
                        let totalPrice = 0;
                        const data = res?.data?.data?.map((value1) => {
                            value1.priceItem = items.filter(i => i.id === value1?.idItems)[0]?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.priceItems; // khong tinh
                            value1.priceItemsDtos= items.filter(i => i.id === value1?.idItems)[0]?.priceItemsDtos.map(
                                (p) => {
                                    // khong ban le
                                    if(p?.dvtCode !== '000'){
                                        p.name = findNameByDvt(p?.dvtCode);
                                        return p;
                                    }
                                }
                            );
                            value1.totalInWareHouse = items.filter(i => i.id === value1?.idItems)[0]?.totalInWareHouse ?? 0;
                            value1.quantity = value1.quality;
                            totalPrice += value1.quantity * value1.priceItem;
                            return value1;
                        });
                        setItemData(
                            {
                                ...res?.data,
                                totalPrice: totalPrice,
                                idReceiptExport: d?.idReceiptExport,
                                data
                            }
                        )
                    }
                    else{
                        toast.current.show({ severity: 'error', content: res?.message ?? 'Message Detail' });
                    }
                }).catch((ex) => {
                    toast.current.show({ severity: 'error', content: ex?.message ?? 'Message Detail' });
                })
            }
            refEditMode.current = Enumeration.crud.edit;
            setShow(true);
        }

    }));

    const onInputChange = (e, name) => {
        if(name === "idReceiptExport"){
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
        itemData.data.map((value1, index) => {
            if(index === rowIndex){
                if(key === 'quantity'){
                    if(value1.idItems != null){
                        if(items.find(i => i.id === value1.idItems)?.totalInWareHouse < parseInt(value) * items.find(i => i.id === value1.idItems)?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.quality){
                            value1.checkQuantity = true;
                        }
                        else{
                            value1.quantity = parseInt(value);
                            value1.checkQuantity = false;
                        }
                    }
                    return value1;
                }
                else if(key === 'idReceiptImport'){
                    value1.idReceiptImport = value;
                    return value1;
                }
                else if(key === 'dvtCode'){
                    value1.dvtCode = value;
                    value1.priceItem = items.filter(i => i.id === value1?.idItems)[0]?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.priceItems; // khong tinh
                    return value1;
                }
                else{
                    value1.idItems = value;
                    value1.priceItemsDtos= items.filter(i => i.id === value)[0]?.priceItemsDtos.filter(p => p.dvtCode !== '000').map(
                        (p) => {
                            debugger
                            // khong ban le
                                p.name = findNameByDvt(p?.dvtCode);
                                return p;
                        }
                    );
                    value1.dvtCode = items.filter(i => i.id === value)[0]?.priceItemsDtos[0]?.dvtCode;
                    value1.priceItem = items.filter(i => i.id === value)[0]?.priceItemsDtos?.find(e => e.dvtCode === value1?.dvtCode)?.priceItems;
                    value1.totalInWareHouse = items.filter(i => i.id === value)[0]?.totalInWareHouse ?? 0;
                    return value1;
                }
            }
        })

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
    }

    const textEditor = (options) => {
        return <InputNumber mode="decimal" disabled={disabled} type="text" value={options.value}  onChange={(e) => onInputChangeItem(e.value, options?.rowIndex, 'quantity')} />;
    }

    const textEditorIdReceiptImport = (options) => {
        return <InputText disabled={disabled} type="text" value={options.value}  onChange={(e) => onInputChangeItem(e.target.value, options?.rowIndex, 'idReceiptImport')} />;
    }

    const textEditorItem = (options) => {
        return <Dropdown  disabled={disabled} value={options.value}  filter showClear filterBy="name" optionValue="id" onChange={(e) => onInputChangeItem(e.value,  options?.rowIndex, 'idItems')} options={items} optionLabel="name" placeholder="Select" />;
    }

    const findNameByDvt = (typeCode) => {
        return dvt.find(e => e.dvtCode === typeCode)?.name ?? "";
    }

    const textEditorDvt = (options) => {
        return <Dropdown  disabled={disabled} value={options?.dvtCode} optionValue="dvtCode"  options={options?.rowData?.priceItemsDtos} onChange={(e) => onInputChangeItem(e.value,  options?.rowIndex, 'dvtCode')} optionLabel="name" placeholder="Select" />;
    }


    return (
        <Dialog
            visible={show}
            style={{ width: '1150px' }}
            header="Xuất kho"
            modal
            className="p-fluid"
            footer={() => (
                <>
                    <Button className="p-button-text"  disabled={disabled} label={"Hủy"} onClick={() => cancel()}></Button>
                    <Button className="primary"  disabled={disabled} label={"Lưu"} onClick={() => submit(true)}></Button>
                </>
            )}
            onHide={cancel}
        >
            {show && (
                <div>
                    <div className="formgrid grid">
                        <div className="field">
                            <label htmlFor="name">Mã xuất kho</label>
                            <InputText  id="name" disabled={true} value={itemData.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.code })} />
                            {submitted && !itemData.code && <small className="p-invalid">Code is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Phiếu xuất kho <span className="text-red-600">*</span></label>
                            <Dropdown  disabled={disabled}   value={itemData?.idReceiptExport} optionValue="id" onChange={(e) => onInputChange(e.value,'idReceiptExport')} options={receiptExport} optionLabel="name" placeholder="Select" />
                            {submitted && !itemData.idReceiptExport && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                        </div>
                        <div className="field col">
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
                                style={{ width: '18%' }}
                                header={"Sản phẩm"}
                                editor={(options) => textEditorItem(options)}
                                body={(d) => {
                                    return <Dropdown value={d?.idItems ?? 0} disabled={disabled}  filter showClear filterBy="name" optionValue="id"  options={items} optionLabel="name" placeholder="Select" />;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '18%' }}
                                header={"Đơn vị tính"}
                                editor={(options) => textEditorDvt(options)}
                                body={(d) => {
                                    return <Dropdown value={d?.dvtCode}  disabled={disabled} optionValue="dvtCode"  options={d?.priceItemsDtos} optionLabel="name" placeholder="Select" />;
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
                                        <InputText disabled={disabled} id="quantity" value={d.idReceiptImport} className={!d?.idReceiptImport && "p-invalid block"}/>
                                    </>
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '8%' }}
                                header={"Giá"}
                                body={(d, row) => {
                                    return <>{d.priceItem ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '7%' }}
                                header={"Trong kho"}
                                body={(d, row) => {
                                    return <>{d.totalInWareHouse ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Nhập Số lượng"}
                                editor={(options) => textEditor(options)}
                                body={(d) => {
                                    if(d.checkQuantity){
                                        return  <>
                                            <InputNumber mode="decimal" disabled={disabled} id="quantity" value={d?.quantity} className="p-invalid block"/>
                                        </>
                                    }
                                    else{
                                        return  <>
                                            <InputNumber mode="decimal" disabled={disabled} value={d?.quantity} id="quantity"/>
                                        </>
                                    }
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Thao tác"}
                                body={(d, row) => {
                                    return <>
                                        <Button icon="pi pi-plus" disabled={disabled} className="p-button-rounded  p-button-text" onClick={() => addItem(row.rowIndex)} />
                                        <Button icon="pi pi-minus" disabled={disabled} className="p-button-rounded  p-button-text p-button-text" onClick={() => removeItem(row.rowIndex)} />
                                    </>
                                }}
                            ></Column>
                        </DataTable>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col-9">
                        </div>
                        <div className="field col-3">
                            <label htmlFor="name">Tổng tiền</label>
                            <InputText id="name" disabled={true} value={itemData.totalPrice}/>
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    )


}

ExportWareHouse_Details = forwardRef(ExportWareHouse_Details);

export default ExportWareHouse_Details;
