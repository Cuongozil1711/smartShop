import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {ImportWareHouseService} from "../../service/ImportWareHouseService";
import { Toast } from 'primereact/toast';
import {Dialog} from "primereact/dialog";
import ImportWareHouse_Details from "./ImportWareHouse_Details";
import { InputText } from 'primereact/inputtext';
import { Avatar } from 'primereact/avatar';
import {formatDate} from "@fullcalendar/core";
import {role} from "../../assets/untils/const";
import {OverlayPanel} from 'primereact/overlaypanel';
const ImportWareHouseWareHouse = () => {
    const [search, setSearch] = useState("");
    const defaultData = { first: 0, size: 10, page: 0, total: 0, rows: 10, data: [] };
    const [items, setImportWareHouseWareHouse] = useState(defaultData);
    const [deleteItem, setDeleteItem] = useState(null);
    const [restore, setRestore] = useState(null);
    const [itemData, setItemData] = useState(null);
    const refPosition = useRef();
    const toast = useRef(null);
    const [status, setStatus] = useState(1);
    const [label, setLabel] = useState("Quản lý kho / Danh sách nhập kho");
    const op = useRef();
    const onPage = (event) => {
        loadData(null, { ...items, size: event.rows, page: event.page });

        // loadData();
    };

    useEffect(
        () => {
            loadData({
                page: 0,
                size: 10,
            }, defaultData);

            status === 1 ? setLabel("Quản lý kho / Danh sách nhập kho") :
                setLabel("Quản lý kho / Danh sách hủy nhập kho")

        }, [status]
    )

    /**
     * load data
     * @param {*} _recruitment
     */
    const loadData = async (_filter, _datas) => {
        try {
            let _params = {
                page: _datas.page || 0,
                size: _datas.size || 20,
                search: search ?? ""
            };

            const date = {
                startDate : new Date(),
                endDate: new Date()
            }

            const res = await ImportWareHouseService.search(_params, status, search, date);
            if(res?.status == 200){
                const data = res?.data;
                setImportWareHouseWareHouse({
                    ...items,
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
                    <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Per page: </span>
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
        setStatus(1);
        refPosition.current.create();
    }

    const edit = (d) => {
        refPosition.current.edit(d);
    }

    const view = (d) => {
        refPosition.current.view(d);
    }

    const confirmDeleteProduct = (rowData) => {
        setItemData(rowData);
        setDeleteItem(true);
    }

    const confirmRestoreProduct = (rowData) => {
        setItemData(rowData);
        setRestore(true);
    }

    const deleteProduct = () => {
        setDeleteItem(false);
        ImportWareHouseService.delete(itemData?.idReceiptImport).then(
            (res) => {
                if(res?.status === 200){
                    if(res?.data){
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa thành công', life: 3000 });
                        loadData({}, items);
                    }
                    else{
                        toast.current.show({ severity: 'error', content: "Không thể xóa " + itemData?.receiptImportWareHouse?.name});
                    }
                }
            }
        ).catch((ex) => {
            toast.current.show({ severity: 'error', content: ex?.message ?? "Network Error"});
        })

    }

    const restoreProduct = () => {
        setRestore(false);
        let ids = [itemData?.idReceiptImport];
        ImportWareHouseService.restore(ids).then(
            (res) => {
                if(res?.status === 200){
                    if(res?.data){
                        setStatus(1);
                        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Khôi phục thành công thành công', life: 3000 });
                        loadData({}, items);
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

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    const retoreProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={restoreProduct} />
        </>
    );

    const afterSubmit = (mode, data) => {
        loadData({}, items);
    }


    return (
        <div className="grid table-demo">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <h5>{label}</h5>
                    <div className="row" style={{marginBottom: '15px'}}>
                        <div className="col-8">
                            <Button  label={"Nhập kho"} icon="pi pi-plus" onClick={create} ></Button>

                            <Button  label={"Danh sách nhập kho"} icon="pi pi-book" style={{marginLeft: '15px'}} onClick={() => setStatus(1)} ></Button>

                            <Button  label={"Danh sách hủy nhập kho"} icon="pi pi-trash" style={{marginLeft: '15px', backgroundColor: '#ff6259', border: 'none'}} onClick={() => setStatus(0)} ></Button>
                        </div>
                        <div className="col-4">
                            <div className="flex justify-content-end">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText value={search}  placeholder="Tìm kiếm theo mã && tên" onChange={(e) => {
                                        setSearch(e.target.value);
                                        loadData({}, items, e.target.value);
                                    }} />
                                </span>
                                <Button type="button" icon="pi pi-filter" style={{color: '#757575'}} onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="p-button-rounded p-button-success p-button-text"/>
                            </div>
                        </div>
                    </div>

                    {
                        status === 1 &&
                        <DataTable
                            value={items.data}
                            paginator
                            paginatorTemplate={template2}
                            first={items.first}
                            rows={items.size}
                            totalRecords={items.total}
                            rowsPerPageOptions={[20, 25, 50, 100]}
                            onPage={onPage}
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
                                header={"Tên phiếu nhập"}
                                body={(d, row) => {
                                    return <>{d?.receiptImportWareHouse?.name ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '10%' }}
                                header={"Tổng hàng"}
                                body={(d, row) => {
                                    return <>{d?.quantityItems ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Tổng tiền nhập"}
                                body={(d) => {
                                    return <>{Intl.NumberFormat('en-VI').format(d.totalPrice) ?? "0"}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Ngày nhập"}
                                body={(d, row) => {
                                    return <>{formatDate(d.createDate) ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '20%' }}
                                header={"Người nhập kho"}
                                body={(d, row) => {
                                    return <><Avatar icon="pi pi-user" className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" label={d?.creatByName[0]} />{d.creatByName ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                body={(d) => (
                                    <>
                                        <Button icon="pi pi-eye" tooltip="Xem chi tiết"  className="p-button-rounded  p-button-text" onClick={() => {view(d)}} />
                                        {
                                            status === 1 &&
                                            <>
                                                <Button icon="pi pi-pencil"  tooltip="Xos" disabled={(role === 'ROLE_A' || role === 'ROLE_K') ? false : true} className="p-button-rounded  p-button-text" onClick={() => {edit(d)}} />
                                                <Button icon="pi pi-trash" tooltip="Sửa"  disabled={(role === 'ROLE_A' || role === 'ROLE_K') ? false : true} className="p-button-rounded p-button-text p-button-text" onClick={() => confirmDeleteProduct(d)} />
                                            </>}

                                        {
                                            status === 0 &&  <Button icon="pi pi-sync" tooltip="Khôi phục"  disabled={(role === 'ROLE_A' || role === 'ROLE_K') ? false : true} className="p-button-rounded p-button-warning p-button-text p-button-text" onClick={() => confirmRestoreProduct(d)} />}
                                    </>
                                )}
                            ></Column>
                        </DataTable>
                    }

                    {
                        status === 0 &&
                        <DataTable
                            value={items.data}
                            paginator
                            paginatorTemplate={template2}
                            first={items.first}
                            rows={items.size}
                            totalRecords={items.total}
                            rowsPerPageOptions={[20, 25, 50, 100]}
                            onPage={onPage}
                            responsiveLayout="scroll"
                        >
                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '3%' }}
                                header={"STT"}
                                body={(d, row) => {
                                    return <> {row.rowIndex + 1} </>
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '15%' }}
                                header={"Tên phiếu nhập"}
                                body={(d, row) => {
                                    return <>{d?.receiptImportWareHouse?.name ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '5%' }}
                                header={"Tổng hàng"}
                                body={(d, row) => {
                                    return <>{d?.quantityItems ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '5%' }}
                                header={"Tổng tiền"}
                                body={(d) => {
                                    return <>{Intl.NumberFormat('en-VI').format(d.totalPrice) ?? "0"}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '10%' }}
                                header={"Ngày nhập"}
                                body={(d, row) => {
                                    return <>{formatDate(d.createDate) ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '20%' }}
                                header={"Người nhập kho"}
                                body={(d, row) => {
                                    return <><Avatar icon="pi pi-user" className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" label={d?.creatByName[0]} />{d.creatByName ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '10%' }}
                                header={"Ngày hủy"}
                                body={(d, row) => {
                                    return <>{formatDate(d.updateDate) ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '20%' }}
                                header={"Người hủy"}
                                body={(d, row) => {
                                    return <><Avatar icon="pi pi-user" className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" label={d?.updateByName && d?.updateByName?.[0]} />{d.updateByName ?? ""}</>;
                                }}
                            ></Column>

                            <Column
                                headerClassName="justify-content-center"
                                bodyClassName="justify-content-center"
                                style={{ width: '12%' }}
                                body={(d) => (
                                    <>
                                        <Button icon="pi pi-eye" tooltip="Xem chi tiết"  className="p-button-rounded  p-button-text" onClick={() => {view(d)}} />
                                        {status === 0 &&  <Button icon="pi pi-sync" tooltip="Khôi phục"  disabled={(role === 'ROLE_A' || role === 'ROLE_K') ? false : true} className="p-button-rounded p-button-text" onClick={() => confirmRestoreProduct(d)} />}
                                    </>
                                )}
                            ></Column>
                        </DataTable>
                    }


                </div>
            </div>
            <ImportWareHouse_Details ref={refPosition} toast={toast}  afterSubmit={afterSubmit}/>

            <Dialog visible={deleteItem} style={{ width: '450px' }} header="Xác nhận" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {itemData && <span>Bạn có muốn xóa <b>{itemData?.receiptImportWareHouse?.name}</b>?</span>}
                </div>
            </Dialog>

            <Dialog visible={restore} style={{ width: '450px' }} header="Khôi phục" modal footer={retoreProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {itemData && <span>Bạn có khôi phục <b>{itemData?.receiptImportWareHouse?.name}</b>?</span>}
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

export default React.memo(ImportWareHouseWareHouse, comparisonFn);
