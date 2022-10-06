import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {ReceiptExportWareHouseService} from "../../service/ReceiptExportWareHouseService";
import { Toast } from 'primereact/toast';
import {Dialog} from "primereact/dialog";
import ReceiptExportWareHouse_Details from "./ReceiptExportWareHouse_Details";
import { InputText } from 'primereact/inputtext';
const ReceiptExportWareHouse = () => {
    const [search, setSearch] = useState("");
    const defaultData = { first: 0, size: 10, page: 0, total: 0, rows: 10, data: [] };
    const [items, setReceiptExportWareHouse] = useState(defaultData);
    const [deleteItem, setDeleteItem] = useState(null);
    const [itemData, setItemData] = useState(null);
    const refPosition = useRef();
    const toast = useRef(null);

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

        }, []
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

            const res = await ReceiptExportWareHouseService.search(_params);
            if(res?.status == 200){
                const data = res?.data;
                setReceiptExportWareHouse({
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
        refPosition.current.create();
    }

    const edit = (d) => {
        refPosition.current.edit(d);
    }

    const confirmDeleteProduct = (rowData) => {
        setItemData(rowData);
        setDeleteItem(true);
    }

    const deleteProduct = () => {
        setDeleteItem(false);
        ReceiptExportWareHouseService.delete(itemData?.id).then(
            (res) => {
                loadData({}, items);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa thành công', life: 3000 });
            }
        )

    }

    const hideDeleteProductDialog = () => {
        setDeleteItem(false);
    }

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    const afterSubmit = (mode, data) => {
        loadData({}, items);
    }

    const parseState = (state) => {
        if (state === 'COMPLETE') {
            return "Hoàn thành";
        } else if (state === 'CANCELED'){
            return "Hủy bỏ";
        }
        else{
            return "Đang thực hiện";
        }
    }

    const header2 = () => {
        return (
            <div className="flex justify-content-end">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={search}  placeholder="Tìm kiếm sản phẩm" onChange={(e) => {
                        setSearch(e.target.value);
                        loadData({}, items, e.target.value);
                    }} />
                </span>
            </div>
        )
    }



    return (
        <div className="grid table-demo">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <div className="col-2">
                        <Button  label={"Tạo phiếu"} icon="pi pi-plus" onClick={create} ></Button>
                    </div>
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
                                return <>{row.rowIndex + 1}</>
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Mã"}
                            body={(d, row) => {
                                return <>{d.code ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Tên"}
                            body={(d, row) => {
                                return <>{d.name ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Tên kho xuất hàng"}
                            body={(d, row) => {
                                return <>{d.nameWareHouse ?? "0"}</>;
                            }}
                        ></Column>


                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Trạng thái"}
                            body={(d, row) => {
                                return <>{parseState(d?.state) ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            body={(d) => (
                                <>
                                    <Button icon="pi pi-pencil" className="p-button-rounded  p-button-text" onClick={() => {edit(d)}} />
                                    <Button icon="pi pi-trash" className="p-button-rounded  p-button-text" onClick={() => confirmDeleteProduct(d)} />
                                </>
                            )}
                        ></Column>
                    </DataTable>
                </div>
            </div>
            <ReceiptExportWareHouse_Details ref={refPosition}  afterSubmit={afterSubmit}/>

            <Dialog visible={deleteItem} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {itemData && <span>Bạn có muốn phiếu xuất <b>{itemData.name}</b>?</span>}
                </div>
            </Dialog>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(ReceiptExportWareHouse, comparisonFn);
