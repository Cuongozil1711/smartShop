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
import {dvt, getCode} from "../../assets/untils/const";
import {InputNumber} from "primereact/inputnumber";


function Items_Details(props, ref) {
    const { afterSubmit } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {name: "", code: getCode("MH") ?? "", priceItem: 0, idPubliser: null, idStall: null, idCategory: null, priceItemsDtos: []};
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

    const validate = () => {
        let check = 0;
        const props = dataDefault;
        Object.keys(props).forEach((prop) => {
            if(prop !== 'priceItemsDtos'){
                if(itemData[prop] === null || itemData[prop]?.length === 0){
                    check+=1;
                }
            }
            else{
                if(itemData['priceItemsDtos'].length === 0){
                    check+=1;
                }
                else{
                    itemData['priceItemsDtos'].forEach(e => {
                        if(!e?.quality){
                            check+= 1;
                        }
                        else if(!e?.priceItems){
                            check+=1;
                        }
                    })
                }
            }

        });
        return check;
    }

    const submit = async () => {
        setSubmitted(true);
        if(validate(itemData) > 0) return;
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
            setItemData({
                ...dataDefault,
                priceItemsDtos: []
            });
            setShow(true);
        },

        edit: (d) => {
            setItemData(d);
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
        let priceItemsDto = itemData.priceItemsDtos.map((value1, index) => {
            if (index === rowIndex) {
                value1[key] = value;
            }
            return value1;
        });

        setItemData({
            ...itemData,
            priceItemsDtos: priceItemsDto
        })
    }
    const textEditor = (options, prop) => {
        return <InputNumber mode="decimal" type="text" value={options?.value}  onChange={(e) => onInputChangeItem(e.value, options?.rowIndex, prop)} />;
    }


    const findNameByDvt = (typeCode) => {
        return dvt.find(e => e.dvtCode === typeCode)?.name ?? "";
    }


    return (
        <Dialog
            visible={show}
            style={{ width: '850px' }}
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
                            <label htmlFor="name">Tên mặt hàng <span className="text-red-600">*</span></label>
                            <InputText id="name" value={itemData?.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData?.name })} />
                            {submitted && !itemData.name && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Chọn đối tác <span className="text-red-600">*</span></label>
                            <Dropdown value={itemData?.idPubliser} optionValue="id" onChange={(e) => onInputChange(e.value,'idPubliser')} options={publisher} optionLabel="name" placeholder="Select" />
                            {submitted && !itemData.idPubliser && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                        </div>

                        <div className="field col">
                            <label htmlFor="name">Chọn quầy hàng <span className="text-red-600">*</span></label>
                            <Dropdown value={itemData?.idStall} optionValue="id" onChange={(e) => onInputChange(e.value,'idStall')} options={stalls} optionLabel="name" placeholder="Select" />
                            {submitted && !itemData.idStall && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                        </div>

                        <div className="field col">
                            <label htmlFor="name">Chọn loại mặt hàng <span className="text-red-600">*</span></label>
                            <Dropdown value={itemData?.idCategory} optionValue="id" onChange={(e) => onInputChange(e.value,'idCategory')} options={category} optionLabel="name" placeholder="Select" />
                            {submitted && !itemData.idCategory && <small className="p-invalid text-red-600">Dữ liệu không được để trống</small>}
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <DataTable
                                value={itemData?.priceItemsDtos}
                                responsiveLayout="scroll"
                            >
                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '15%' }}
                                    header={"STT"}
                                    body={(d, row) => {
                                        return <> {row.rowIndex + 1} </>
                                    }}
                                ></Column>
                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '25%' }}
                                    header={"Đơn vị tính"}
                                    body={(d) => {
                                        if(refEditMode.current === Enumeration.crud.edit)
                                        return <>{findNameByDvt(d?.dvtCode)}</>;
                                        else{
                                            return  <>{findNameByDvt(d?.dvtCode)}</>
                                        }
                                    }}
                                ></Column>

                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '25%' }}
                                    header={"Số lượng"}
                                    editor={(options) => textEditor(options, 'quality')}
                                    body={(d, row) => {
                                        if(d?.quality != null){
                                            return  <>
                                                <InputNumber mode="decimal" id="quantity" value={d?.quality} />
                                            </>
                                        }
                                        else{
                                            return  <>
                                                <InputNumber mode="decimal" id="quantity" value={d?.quality} className="p-invalid block"/>
                                            </>
                                        }
                                    }}
                                ></Column>

                                <Column
                                    headerClassName="justify-content-center"
                                    bodyClassName="justify-content-center"
                                    style={{ width: '25%' }}
                                    header={"Giá bán theo đơn vị"}
                                    editor={(options) => textEditor(options, 'priceItems')}
                                    body={(d, row) => {
                                        if(d?.priceItems != null){
                                            return  <>
                                                <InputNumber id="quantity" value={d?.priceItems} />
                                            </>
                                        }
                                        else{
                                            return  <>
                                                <InputNumber id="quantity" value={d?.priceItems} className="p-invalid block"/>
                                            </>
                                        }
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

Items_Details = forwardRef(Items_Details);

export default Items_Details;
