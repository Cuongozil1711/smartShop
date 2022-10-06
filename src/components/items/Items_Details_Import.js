import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import classNames from "classnames";
import {PublisherService} from "../../service/PublisherService";
import {StallsService} from "../../service/StallsService";
import {Dropdown} from "primereact/dropdown";
import {ItemsService} from "../../service/ItemsService";
import {CategoryService} from "../../service/CategoryService";
import {StorageService} from "../../service/storage/StorageService";
import {Column} from "primereact/column";
import {DataTable} from "primereact/datatable";
import {dvt} from "../../assets/untils/const";
import {formatDate} from "@fullcalendar/core";
import Barcode from 'react-barcode';


function Items_Details_Import(props, ref) {
    const { afterSubmit, toast } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {name: "", code: "", priceItem: 0, idPubliser: null, idStall: null, idCategory: null, data: []};
    const [itemData, setItemData] = useState(dataDefault)
    const [submitted, setSubmitted] = useState(false);
    const [publisher, setPublisher] = useState(null);
    const [category, setCategory] = useState(null);
    const [stalls, setStalls] = useState(null);
    const [uploadFile, setUploadFile] = React.useState();
    const [file, setFile] = React.useState("");

    useEffect(() => {
        PublisherService.search({
            page: 0,
            size: 99,
        }).then((res) => {
            setPublisher(res?.data?.content)
        })

        StallsService.search({
            page: 0,
            size: 99,
        }).then((res) => {
            setStalls(res?.data?.content)
        })

        CategoryService.search({
            page: 0,
            size: 99,
        }).then((res) => {
            setCategory(res?.data?.content)
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
        //
        console.log(itemData);

        switch (refEditMode.current) {
            case Enumeration.crud.create:
                const dataArray = new FormData();
                dataArray.append("gifFile", file);
                ItemsService.create(itemData).then(
                    (res) => {
                        if(file != null){
                            dataArray.append("gifFile", file);
                            StorageService.upload("items", res?.data?.id, dataArray).then(
                                (res) => {
                                    if (afterSubmit && typeof afterSubmit === "function") {
                                        setFile(null);
                                        setUploadFile(null);
                                        setShow(false);
                                        afterSubmit(refEditMode.current, res?.data);
                                    }
                                }
                            );
                        }
                        else if (afterSubmit && typeof afterSubmit === "function") {
                            setFile(null);
                            setUploadFile(null);
                            setShow(false);
                            afterSubmit(refEditMode.current, res?.data);
                        }
                    }
                )
                break;
            case  Enumeration.crud.edit:
                ItemsService.edit(itemData.id ,itemData).then(
                    (res) => {
                        const dataArray = new FormData();
                        if(file != null){
                            dataArray.append("gifFile", file);
                            StorageService.upload("items", itemData.id, dataArray).then(
                                (res) => {
                                    if (afterSubmit && typeof afterSubmit === "function") {
                                        setFile(null);
                                        setUploadFile(null);
                                        setShow(false);
                                        afterSubmit(refEditMode.current, res?.data);
                                    }
                                }
                            );
                        }
                        else{
                            if (afterSubmit && typeof afterSubmit === "function") {
                                setFile(null);
                                setUploadFile(null);
                                setShow(false);
                                afterSubmit(refEditMode.current, res?.data);
                            }
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
        setFile(null);
        setUploadFile(null);
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

        view: (d) => {
            if(d?.id != null){
                ItemsService.details(d?.id).then((res) => {
                    if(res?.status === 200){
                        setItemData({
                            ...d,
                            data: res?.data
                        })
                    }
                    else{
                        toast.current.show({ severity: 'error', content: res?.message ?? 'Message Detail' });
                    }
                }).catch((ex) => {
                    toast.current.show({ severity: 'error', content: ex?.message ?? 'Message Detail' });
                })
            }
            setUploadFile(d.image);
            refEditMode.current = Enumeration.crud.edit;
            setShow(true);
        }

    }));

    const onInputChange = (e, name) => {
        if(name === "idPubliser" || name === "idStall" || name === "idCategory"){
            let _product = { ...itemData };
            _product[`${name}`] = e;
            setItemData(_product);
            if(name === 'idCategory'){
                setItemData({
                    ...itemData,
                    idCategory: e,
                    priceItemsDtos: category.filter(item => item?.id === e)[0]?.unit ?? []
                })
            }
        }
        else{
            const val = (e.target && e.target.value) || '';
            let _product = { ...itemData };
            _product[`${name}`] = val;
            setItemData(_product);
        }
    }

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setUploadFile(URL.createObjectURL(event.target.files[0]));
        }
    }

    const onInputChangeItem = (value, rowIndex, key) => {
        itemData.priceItemsDtos.map((value1, index) => {
            if (index === rowIndex) {
                value1[key] = parseInt(value);
            }
            return value1;
        });
    }
    const textEditor = (options, prop) => {
        return <InputText type="text" value={options.value}  onChange={(e) => onInputChangeItem(e.target.value, options?.rowIndex, prop)} />;
    }


    const findNameByDvt = (typeCode) => {
        return dvt.find(e => e.dvtCode === typeCode)?.name ?? "";
    }


    return (
        <Dialog
            visible={show}
            style={{ width: '1050px' }}
            header="Chi tiết sản phẩm"
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
                        <div className="field col">
                            <label htmlFor="name">Mã mặt hàng</label>
                            <InputText id="name" disabled={true} value={itemData?.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData?.code })} />
                            {submitted && !itemData?.code && <small className="p-invalid">Code is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Tên mặt hàng</label>
                            <InputText id="name" disabled={true} value={itemData?.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData?.name })} />
                            {submitted && !itemData?.name && <small className="p-invalid">Address is required.</small>}
                        </div>

                        <div className="field col">
                            <label htmlFor="name">đối tác</label>
                            <Dropdown value={itemData?.idPubliser} disabled={true} optionValue="id" onChange={(e) => onInputChange(e.value,'idPubliser')} options={publisher} optionLabel="name" placeholder="Select" />
                        </div>

                        <div className="field col">
                            <label htmlFor="name">Chọn loại mặt hàng</label>
                            <Dropdown value={itemData?.idCategory} disabled={true} optionValue="id" onChange={(e) => onInputChange(e.value,'idCategory')} options={category} optionLabel="name" placeholder="Select" />
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <DataTable
                                value={itemData?.data}
                                responsiveLayout="scroll"
                            >
                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '10%' }}
                                    header={"ID (PN)"}
                                    body={(d, row) => {
                                        return <> <Barcode value={d?.receiptImportWareHouse?.id} height={100} /> </>
                                    }}
                                ></Column>
                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '10%' }}
                                    header={"Mã (PN)"}
                                    body={(d, row) => {
                                        return <> {d?.receiptImportWareHouse?.code } </>
                                    }}
                                ></Column>

                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '20%' }}
                                    header={"Tên (PN)"}
                                    body={(d, row) => {
                                        return <> {d?.receiptImportWareHouse?.name } </>
                                    }}
                                ></Column>

                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '15%' }}
                                    header={"Ngày nhập"}
                                    body={(d, row) => {
                                        return <> {d?.createDate ?? ""} </>
                                    }}
                                ></Column>

                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '10%' }}
                                    header={"Số lượng nhập"}
                                    body={(d, row) => {
                                        return <> {d?.qualityImport ?? ""} </>
                                    }}
                                ></Column>

                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '10%' }}
                                    header={"Số lượng xuất"}
                                    body={(d, row) => {
                                        return <> {d?.qualityExport ?? ""} </>
                                    }}
                                ></Column>

                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '10%' }}
                                    header={"Số lượng hủy"}
                                    body={(d, row) => {
                                        return <> {d?.qualityCanceled ?? ""} </>
                                    }}
                                ></Column>

                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '15%' }}
                                    header={"Ngày hết hạn"}
                                    body={(d, row) => {
                                        return <> {formatDate(d?.dateExpired ?? "") ?? ""} </>
                                    }}
                                ></Column>

                            </DataTable>
                        </div>

                    </div>

                    <div className="formgrid grid">
                        <div className="field col-3">
                            <label htmlFor="name">Chọn ảnh mặt hàng</label>
                            <div className="field">
                                <input type="file" onChange={onImageChange} className="filetype" />
                                {uploadFile && <img src={uploadFile} alt="preview image" width={100} height={100} />}
                            </div>
                        </div>
                        <div className="field col"></div>
                        <div className="field col"></div>
                    </div>




                </div>
            )}
        </Dialog>
    )

}

Items_Details_Import = forwardRef(Items_Details_Import);

export default Items_Details_Import;
