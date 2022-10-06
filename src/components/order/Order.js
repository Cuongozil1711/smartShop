import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {OrderService} from "../../service/OrderService";
import { Toast } from 'primereact/toast';
import {Dialog} from "primereact/dialog";
import Order_Details from "./Order_Details";
import { InputText } from 'primereact/inputtext';
import Order_Create from "./Order_Create";
import {role, uid} from "../../assets/untils/const";
import {OverlayPanel} from "primereact/overlaypanel";
const Order = () => {
    const [search, setSearch] = useState("");
    const defaultData = { first: 0, size: 10, page: 0, total: 0, rows: 10, data: [] };
    const [order, setOrder] = useState(defaultData);
    const [deleteItem, setDeleteItem] = useState(null);
    const [itemData, setItemData] = useState(null);
    const refOrder = useRef();
    const refOrderCreate = useRef();
    const toast = useRef(null);
    const [status, setStatus] = useState(1);
    const [label, setLabel] = useState("Quản bán hàng / Đơn hàng");
    const op = useRef();
    const [restore, setRestore] = useState(null);
    const onPage = (event) => {
        loadData(null, { ...order, size: event.rows, page: event.page });

        // loadData();
    };

    useEffect(
        () => {
            loadData({
                page: 0,
                size: 10,
            }, defaultData);

            status === 1 ? setLabel("Quản bán hàng / Đơn hàng") :
                setLabel("Quản bán hàng / Đơn hủy")

        }, [status]
    )

    /**
     * load data
     * @param {*} _recruitment
     */
    const loadData = async (_filter, _datas, search) => {
        try {
            let _params = {
                page: _datas.page || 0,
                size: _datas.size || 20,
                search: search ?? ""
            };

            const res = await OrderService.search(_params, status);
            if(res?.status == 200){
                const data = res?.data;
                setOrder({
                    ...order,
                    data: data?.content,
                    page:  data?.pageable?.pageNumber,
                    first: data?.pageable?.pageNumber * data?.pageable?.pageSize,
                    size: data?.pageable?.pageSize,
                    total: data?.totalElements
                })
            }
        } catch (error) {
            console.log(error);
        }
    };
    const template2 = {
        layout: 'RowsPerPageDropdown CurrentPageReport PrevPageLink NextPageLink',
        'RowsPerPageDropdown': (options) => {
            const dropdownOptions = [
                { label: 10, value: 10 },
                { label: 20, value: 20 },
                { label: 50, value: 50 }
            ];

            return (
                <React.Fragment>
                    <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Page: </span>
                    <Dropdown value={options.value} options={dropdownOptions} onChange={options.onChange} />
                </React.Fragment>
            );
        },
        'CurrentPageReport': (options) => {
            return (
                <span style={{ color: 'var(--text-color)', userSelect: 'none', width: '120px', textAlign: 'center' }}>
                    {options.first} - {options.last} of {options.totalRecords}
                </span>
            )
        }
    };

    const create = () => {
        refOrderCreate.current.create();
    }

    const edit = (d) => {
        refOrder.current.edit(d);
    }

    const confirmDeleteProduct = (rowData) => {
        setItemData(rowData);
        setDeleteItem(true);
    }

    const deleteProduct = () => {
        setDeleteItem(false);
        OrderService.delete(itemData?.id).then(
            (res) => {
                if(res?.status === 200){
                    if(res?.data){
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa thành công', life: 3000 });
                        loadData({}, order);
                    }
                    else{
                        toast.current.show({ severity: 'error', content: "Không thể xóa đơn hàng " + itemData?.name});
                    }
                }
            }
        ).catch((ex) => {
            toast.current.show({ severity: 'error', content: ex?.message ?? "Network Error"});
        })

    }

    const restoreProduct = () => {
        setRestore(false);
        let ids = itemData?.id;
        OrderService.restore(ids).then(
            (res) => {
                if(res?.status === 200){
                    if(res?.data){
                        setStatus(1);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Khôi phục thành công thành công', life: 3000 });
                        loadData({}, order);
                    }
                    else{
                        toast.current.show({ severity: 'error', content: "Không thể khôi phục"});
                    }
                }
            }
        ).catch((ex) => {
            toast.current.show({ severity: 'error', content: ex?.message ?? "Network Error"});
        })

    }

    const hideDeleteProductDialog = () => {
        setDeleteItem(false);
        setRestore(false);
    }

    const confirmRestoreProduct = (rowData) => {
        setItemData(rowData);
        setRestore(true);
    }

    const retoreProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={restoreProduct} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    const afterSubmit = (mode, data) => {
        loadData({}, order);
    }

    return (
        <div className="grid table-demo">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <h5>{label}</h5>
                    <div className="row" style={{marginBottom: '15px'}}>
                        <div className="col-8">
                            <Button  label={"Tạo đơn hàng"} icon="pi pi-plus" onClick={create} ></Button>

                            <Button  label={"Đơn hàng"} icon="pi pi-book" style={{marginLeft: '15px'}} onClick={() => setStatus(1)} ></Button>

                            <Button  label={"Đơn hủy"} icon="pi pi-trash" style={{marginLeft: '15px', backgroundColor: '#ff6259', border: 'none'}} onClick={() => setStatus(0)} ></Button>
                        </div>
                        <div className="col-4">
                            <div className="flex justify-content-end">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText value={search}  placeholder="Tìm kiếm sản phẩm" onChange={(e) => {
                                        setSearch(e.target.value);
                                        loadData({}, order, e.target.value);
                                    }} />
                                </span>
                                <Button type="button" icon="pi pi-filter" style={{color: '#757575'}} onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="p-button-rounded p-button-success p-button-text"/>
                            </div>
                        </div>
                    </div>

                    {
                        status === 1 &&      <DataTable
                            value={order.data}
                            paginator
                            paginatorTemplate={template2}
                            first={order.first}
                            rows={order.size}
                            totalRecords={order.total}
                            rowsPerPageOptions={[20, 25, 50, 100]}
                            onPage={onPage}
                            responsiveLayout="scroll"
                        >
                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Mã đơn hàng"}
                                body={(d) => {
                                    return <>{d?.code}</>
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Tên đơn hàng"}
                                body={(d, row) => {
                                    return <>{d?.name ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Tên khách hàng"}
                                body={(d) => {
                                    return <>{d?.customerDto?.name ?? "Don tu do"}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Số lượng"}
                                body={(d, row) => {
                                    return <>{d.quantity ?? "0"}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Thành tiền"}
                                body={(d) => {
                                    return <>{Intl.NumberFormat('en-VI').format(d.totalPrice) ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                body={(d) => (
                                    <>
                                        <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2 p-button-text p-button-text" onClick={() => {edit(d)}} />
                                        <Button icon="pi pi-trash"  disabled={(role === 'ROLE_A' || d?.createBy === uid) ? false : true} className="p-button-rounded p-button-warning p-button-text p-button-text" onClick={() => confirmDeleteProduct(d)} />
                                    </>
                                )}
                            ></Column>
                        </DataTable>
                    }

                    {
                        status === 0 &&
                        <DataTable
                            value={order.data}
                            paginator
                            paginatorTemplate={template2}
                            first={order.first}
                            rows={order.size}
                            totalRecords={order.total}
                            rowsPerPageOptions={[20, 25, 50, 100]}
                            onPage={onPage}
                            responsiveLayout="scroll"
                        >
                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Mã đơn hàng"}
                                body={(d) => {
                                    return <>{d?.code}</>
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Tên đơn hàng"}
                                body={(d, row) => {
                                    return <>{d?.name ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Tên khách hàng"}
                                body={(d) => {
                                    return <>{d?.customerDto?.name ?? "Don tu do"}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Số lượng"}
                                body={(d, row) => {
                                    return <>{d.quantity ?? "0"}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Thành tiền"}
                                body={(d) => {
                                    return <>{Intl.NumberFormat('en-VI').format(d.totalPrice) ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                body={(d) => (
                                    <>
                                        <Button icon="pi pi-eye" className="p-button-rounded p-button-success mr-2 p-button-text p-button-text" onClick={() => {edit(d)}} />
                                        {status === 0 &&  <Button icon="pi pi-sync" tooltip="Khôi phục"  disabled={(role === 'ROLE_A' || role === 'ROLE_K') ? false : true} className="p-button-rounded p-button-warning p-button-text p-button-text" onClick={() => confirmRestoreProduct(d)} />}
                                    </>
                                )}
                            ></Column>
                        </DataTable>
                    }
                </div>
            </div>
            <Order_Details ref={refOrder}  afterSubmit={afterSubmit}/>
            <Order_Create ref={refOrderCreate}  afterSubmit={afterSubmit}/>

            <Dialog visible={deleteItem} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-order-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {itemData && <span>Bạn có muốn đơn hàng <b>{itemData.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={restore} style={{ width: '450px' }} header="Khôi phục" modal footer={retoreProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {itemData && <span>Bạn có khôi phục <b>{itemData?.name}</b>?</span>}
                </div>
            </Dialog>

            <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{width: '450px'}} className="overlaypanel-demo">

            </OverlayPanel>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Order, comparisonFn);
