import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {PublisherService} from "../../service/PublisherService";
import { Toast } from 'primereact/toast';
import {Dialog} from "primereact/dialog";
import Publisher_Details from "./Publisher_Details";
const Publisher = () => {
    const [loading, setLoading] = useState(false);
    const defaultData = { first: 0, size: 10, page: 0, total: 0, rows: 10, data: [] };
    const [publisher, setPosition] = useState(defaultData);
    const [deleteItem, setDeleteItem] = useState(null);
    const [itemData, setItemData] = useState(null);
    const refPosition = useRef();
    const toast = useRef(null);
    const onPage = (event) => {
        loadData(null, { ...publisher, size: event.rows, page: event.page });

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
    const loadData = async (_filter, _datas) => {
        try {
            let _params = {
                page: _datas.page || 0,
                size: _datas.size || 20,
            };

            const res = await PublisherService.search(_params);
            if(res?.status == 200){
                const data = res?.data;
                setPosition({
                    ...publisher,
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
                    <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>Items per page: </span>
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
        PublisherService.delete(itemData?.id).then(
            (res) => {
                loadData({}, publisher);
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
        loadData({}, publisher);
        // if(mode === Enumeration.crud.create){
        //     const _publisher = {...publisher};
        //     _publisher.data.unshift({ ...data, createDate: new Date(), status: 1 });
        //     setPosition(_publisher);
        // }
        // if(mode === Enumeration.crud.edit){
        //     const _publisher = {...publisher};
        //     for (let i = 0; i < _publisher.data.length; i++) {
        //         if (_publisher[i].data.id === data.id) {
        //             _publisher[i].data = data;
        //         }
        //     }
        //     setPosition(_publisher);
        // }
    }



    return (
        <div className="grid table-demo">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <div className="col-3">
                        <Button  label={"Thêm đối tác"} icon="pi pi-plus" onClick={create} ></Button>
                    </div>
                    <DataTable
                        value={publisher.data}
                        paginator
                        paginatorTemplate={template2}
                        first={publisher.first}
                        rows={publisher.size}
                        totalRecords={publisher.total}
                        rowsPerPageOptions={[20, 25, 50, 100]}
                        onPage={onPage}
                        responsiveLayout="scroll"
                    >
                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"STT"}
                            body={(d, row) => {
                                return <>{row.rowIndex + 1}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '30%' }}
                            header={"Mã"}
                            body={(d, row) => {
                                return <>{d.code ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '30%' }}
                            header={"Tên"}
                            body={(d, row) => {
                                return <>{d.name ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '30%' }}
                            header={"Địa chỉ"}
                            body={(d, row) => {
                                return <>{d.address ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            alignFrozen="right"
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            body={(d) => (
                                <>
                                    <Button icon="pi pi-pencil" className="p-button-rounded p-button-text" onClick={() => {edit(d)}} />
                                    <Button icon="pi pi-trash" className="p-button-rounded p-button-text" onClick={() => confirmDeleteProduct(d)} />
                                </>
                            )}
                        ></Column>
                    </DataTable>
                </div>
            </div>
            <Publisher_Details ref={refPosition}  afterSubmit={afterSubmit}/>

            <Dialog visible={deleteItem} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {itemData && <span>Bạn có muốn xóa đối tác <b>{itemData.name}</b>?</span>}
                </div>
            </Dialog>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Publisher, comparisonFn);
