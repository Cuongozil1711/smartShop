import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import {OrderService} from "../../service/OrderService";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {dvt, getCode} from "../../assets/untils/const";


function Order_Details(props, ref) {
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const [itemData, setItemData] = useState([])

    useEffect(() => {
    }, []);

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
            setShow(true);
            setItemData(
                {
                    ...itemData,
                    code: getCode("OR")
                }
            )
        },

        edit: (d) => {
            OrderService.getById(d?.id).then(value => {
                console.log(value?.data);
                setItemData(value?.data);
            })
            setItemData(d);
            setShow(true);
        }

    }));

    const findNameByDvt = (typeCode) => {
        return dvt.find(e => e.dvtCode === typeCode)?.name ?? "";
    }

    const onInputChange = (e, name) => {
        if(name === "idPubliser" || name === "idStall" || name === "idCategory"){
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
            style={{ width: '750px' }}
            header="Xem chi tiết đơn hàng"
            modal
            className="p-fluid"
            footer={() => (
                <>
                </>
            )}
            onHide={cancel}
        >
            {show && (
                <div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Mã mặt hàng</label>
                            <InputText disabled={"true"} id="name" value={itemData?.code} onChange={(e) => onInputChange(e, 'code')} required autoFocus />
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Tên đơn hàng</label>
                            <InputText id="name" disabled={"true"} value={itemData.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus  />
                        </div>
                    </div>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Tên khách hàng</label>
                            <InputText id="name" disabled={"true"} value={itemData?.customerDto?.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus  />
                        </div>
                        <div className="field col">
                        </div>
                    </div>

                    <DataTable
                        value={itemData?.detailsItemOrders}
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
                            style={{ width: '25%' }}
                            header={"Tên Sản phẩm"}
                            body={(d) => {
                                return <>{d?.itemsResponseDTO?.name}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '40%' }}
                            header={"Giá/Đơn vị"}
                            body={(d, row) => {
                                return <>{d?.itemsResponseDTO?.priceItemsDtos?.find(e => e.dvtCode === d?.dvtCode)?.priceItems ?? ""}/ {findNameByDvt(d?.dvtCode)}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Số lượng"}
                            body={(d) => {
                                return <>{d?.quality}</>
                            }}
                        ></Column>
                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Thành tiền"}
                            body={(d) => {
                                return <>{d?.totalPrice}</>
                            }}
                        ></Column>
                    </DataTable>

                    <div className="formgrid grid" style={{marginTop : "15px"}}>
                        <div className="field col-9">
                        </div>
                        <div className="field col-3">
                            <label htmlFor="name">Tổng tiền</label>
                            <InputText  id="name" disabled={true} value={itemData.totalPrice}/>
                        </div>
                    </div>
                </div>
            )}
        </Dialog>
    )

}

Order_Details = forwardRef(Order_Details);

export default Order_Details;
