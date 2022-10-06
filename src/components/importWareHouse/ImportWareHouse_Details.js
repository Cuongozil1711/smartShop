import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {Dropdown} from "primereact/dropdown";
import {ImportWareHouseService} from "../../service/ImportWareHouseService";
import {ItemsService} from "../../service/ItemsService";
import {ReceiptImportWareHouseService} from "../../service/ReceiptImportWareHouseService";
import {getCode} from "../../assets/untils/const";
import {Column} from "primereact/column";
import { DataTable } from 'primereact/datatable';
import {Calendar} from 'primereact/calendar';
import {formatDate} from "@fullcalendar/core";
import {InputNumber} from "primereact/inputnumber";
function ImportWareHouse_Details(props, ref) {
    const { afterSubmit, toast } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {numberBox: 1, idItems: null, dateExpired: null, totalPrice: 0, quantity: 0, id: null};
    const [itemData, setItemData] = useState({code: getCode("IN"), idReceiptImport: null, data: [dataDefault]});
    const [submitted, setSubmitted] = useState(false);
    const [receiptImport, setReceiptImport] = useState(null);
    const [items, setItems] = useState(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        ReceiptImportWareHouseService.search({
            page: 0,
            size: 99,
        }).then((res) => {
            setReceiptImport(res?.data?.content.filter(res => res.state === 'PROCESSING'))
        })

        ItemsService.search({
            page: 0,
            size: 99,
            search: "",
        }).then((res) => {
            setItems(res?.data?.content)
        })
    }, []);

    const validate = (props) => {
        Object.keys(props).forEach((prop) => {
            if(itemData[prop] != null && itemData[prop]?.length < 0){
                return false;
            }
        });
        return true;
    }

    const submit = async () => {
        setSubmitted(true);
        validate(itemData);

        switch (refEditMode.current) {
            case Enumeration.crud.create:
                ImportWareHouseService.create(itemData).then(
                    (res) => {
                      if(res?.status === 200){
                          if (afterSubmit && typeof afterSubmit === "function") {
                              setShow(false);
                              afterSubmit(refEditMode.current, res?.data);
                          }
                      }
                      else{
                          toast.current.show({ severity: 'error', content: res?.message ?? "Error NetWork" });
                      }
                    }
                ).catch(
                    (ex) => {
                        toast.current.show({ severity: 'error', content: ex?.message ?? "Error NetWork" });
                    }
                )
                break;
            case  Enumeration.crud.edit:
                console.log(itemData);
                ImportWareHouseService.edit(itemData).then(
                    (res) => {
                        if(res?.status === 200){
                            if (afterSubmit && typeof afterSubmit === "function") {
                                setShow(false);
                                afterSubmit(refEditMode.current, res?.data);
                            }
                        }
                        else{
                            toast.current.show({ severity: 'error', content: res?.message ?? "Error NetWork" });
                        }
                    }
                ).catch(
                    (ex) => {
                        toast.current.show({ severity: 'error', content: ex?.message ?? "Error NetWork" });
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
            setItemData({
                ...itemData,
                data: [dataDefault]
            });
            setShow(true);
            setDisabled(false);
        },

        edit: (d) => {
            if(d?.receiptImportWareHouse?.id){
                ImportWareHouseService.get(d?.receiptImportWareHouse?.id).then(res => {
                    if(res?.status === 200){
                        setItemData(res?.data ?? dataDefault);
                    }
                }).catch(ex => {
                    toast.current.show({ severity: 'error', content: ex?.message ?? 'Message Detail' });
                })
            }
            setDisabled(false);
            setItemData(d);
            refEditMode.current = Enumeration.crud.edit;
            setShow(true);
        },

        view: (d) => {
            if(d?.receiptImportWareHouse?.id){
                ImportWareHouseService.get(d?.receiptImportWareHouse?.id).then(res => {
                    if(res?.status === 200){
                        setItemData(res?.data ?? dataDefault);
                    }
                }).catch(ex => {
                    toast.current.show({ severity: 'error', content: ex?.message ?? 'Message Detail' });
                })
            }
            setItemData(d);
            setDisabled(true);
            refEditMode.current = Enumeration.crud.view;
            setShow(true);
        }

    }));

    const onInputChange = (e, name) => {
        if(name === "idReceiptImport" || name === "idItems"){
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
            if (index === rowIndex) {
                value1[key] = value;
                return value1;
            }
        });
    }

    const textEditorItem = (options) => {
        if(refEditMode.current === Enumeration.crud.edit){
            return  <Dropdown value={options.value} disabled={refEditMode.current === Enumeration.crud.edit ? true : false} optionValue="id" onChange={(e) => onInputChangeItem(e.value,  options?.rowIndex, 'idItems')} options={items} optionLabel="name" placeholder="Select" />;
        }
        else return <Dropdown value={options.value} disabled={disabled} optionValue="id" onChange={(e) => onInputChangeItem(e.value,  options?.rowIndex, 'idItems')} options={items} optionLabel="name" placeholder="Select" />;
    }

    const textEditor = (options, key) => {
        if(key === 'dateExpired'){
            return <Calendar disabled={disabled} id="icon" value={options.value} onChange={(e) => onInputChangeItem(e.target.value, options?.rowIndex, key)} showIcon />
        }
        else return <InputNumber  mode="decimal" disabled={disabled} type="text" value={options?.value}  onChange={(e) => onInputChangeItem(e.value, options?.rowIndex, key)} />;
    }


    const addItem = () => {
        itemData.data.push(dataDefault);
        setItemData({
            ...itemData,
        })
    }

    const removeItem = (item, row) => {
        if(item?.id != null && refEditMode.current === Enumeration.crud.edit){
            ImportWareHouseService.checkRemoveItem(item?.id).then((res) => {
                if(res?.status === 200){
                    if(res?.data === true){
                        itemData.data.splice(row?.rowIndex, 1);
                        setItemData({
                            ...itemData,
                        })
                    }
                    else{
                        toast.current.show({ severity: 'error', content: "Không thể xóa sản phẩm đã được sử dụng" });
                    }
                }
            })
        }
        else{
            itemData.data.splice(row?.rowIndex, 1);
            setItemData({
                ...itemData,
            })
        }
    }

    return (
        <Dialog
            visible={show}
            style={{ width: '950px' }}
            header="Chi tiết nhập kho"
            modal
            className="p-fluid"
            footer={() => (
                <>
                    <Button className="p-button-text" disabled={disabled} label={"Hủy"} onClick={() => cancel()}></Button>
                    <Button className="primary" disabled={disabled}  label={"Lưu"} onClick={() => submit(true)}></Button>
                </>
            )}
            onHide={cancel}
        >
            {show && (
                <div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Mã nhập</label>
                            <InputText disabled={true} id="name" value={itemData.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.code })} />
                        </div>

                        <div className="field col">
                            <label htmlFor="name">Chọn phiếu nhập kho</label>
                            <Dropdown disabled={disabled} value={itemData?.idReceiptImport} optionValue="id" onChange={(e) => onInputChange(e.value,'idReceiptImport')} options={receiptImport} optionLabel="name" placeholder="Select" />
                            {submitted && !itemData.idReceiptImport && <small className="p-invalid">Field is required.</small>}
                        </div>
                        <div className="field col"></div>
                    </div>


                    <DataTable
                        value={itemData.data}
                        responsiveLayout="scroll"
                    >
                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '5%' }}
                            header={"STT"}
                            body={(d, row) => {
                                return <> {row.rowIndex + 1} </>
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Tên sản phẩm"}
                            editor={(options) => textEditorItem(options)}
                            body={(d) => {
                                if(refEditMode.current === Enumeration.crud.edit){
                                    return  <Dropdown disabled={true} value={d?.idItems ?? 0} optionValue="id"  options={items} optionLabel="name" placeholder="Select" />;
                                }
                                else return <Dropdown disabled={disabled} value={d?.idItems ?? 0} optionValue="id"  options={items} optionLabel="name" placeholder="Select" />;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"SL/Thùng"}
                            editor={(options) => textEditor(options, 'quantity')}
                            body={(d) => {
                                return  <>
                                    <InputNumber mode="decimal" disabled={disabled} id="quantity" value={d?.quantity} className={!d?.quantity && "p-invalid block"}/>
                                </>
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '12%' }}
                            header={"Số thùng"}
                            editor={(options) => textEditor(options, 'numberBox')}
                            body={(d) => {
                                return  <>
                                    <InputNumber  mode="decimal" disabled={disabled} id="numberBox" value={d?.numberBox} className={!d?.numberBox && "p-invalid block"}/>
                                </>
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Tổng tiền nhập"}
                            editor={(options) => textEditor(options, 'totalPrice')}
                            body={(d) => {
                                return  <>
                                    <InputNumber  disabled={disabled} id="totalPrice" value={d?.totalPrice} className={!d?.totalPrice && "p-invalid block"}/>
                                </>
                            }}
                        ></Column>


                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Ngày hết hạn"}
                            editor={(options) => textEditor(options, 'dateExpired')}
                            body={(d) => {
                                return  <>
                                    <p>{formatDate(d?.dateExpired)}</p>
                                    {/*<Calendar disabled={disabled}  id="icon" value={d?.dateExpired} onChange={(e) => onInputChangeItem(e.target.value, d?.rowIndex, 'dateExpired')} showIcon />*/}
                                </>
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '18%' }}
                            header={""}
                            body={(d, row) => {
                                return <>
                                    <Button icon="pi pi-plus" disabled={disabled} className="p-button-rounded p-button-success p-button-text" onClick={() => addItem(row.rowIndex)} />
                                    <Button icon="pi pi-minus" disabled={disabled} className="p-button-rounded p-button-warning p-button-text p-button-text" onClick={() => removeItem(d,row)} />
                                </>
                            }}
                        ></Column>
                    </DataTable>



                </div>
            )}
        </Dialog>
    )

}

ImportWareHouse_Details = forwardRef(ImportWareHouse_Details);

export default ImportWareHouse_Details;
