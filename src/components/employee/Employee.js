import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {CustomerService} from "../../service/CustomerService";
import { Toast } from 'primereact/toast';
import {Dialog} from "primereact/dialog";
import Employee_Details from "./Employee_Details";
import {AddressService} from "../../service/AddressService";
import {EmployeeService} from "../../service/userService/EmployeeService";
import {formatDate} from "@fullcalendar/core";
const Employee = () => {
    const defaultData = { first: 0, size: 10, page: 0, total: 0, rows: 10, data: [] };
    const [employee, setEmployee] = useState(defaultData);
    const [deleteItem, setDeleteItem] = useState(null);
    const [itemData, setItemData] = useState(null);
    const refEmployee = useRef();
    const toast = useRef(null);
    const onPage = (event) => {
        loadData(null, { ...employee, size: event.rows, page: event.page });
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

            const res = await EmployeeService.search(_params);
            if(res?.status == 200){
                const data = res?.data;
                console.log(data);
                setEmployee({
                    ...employee,
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
                    <span className="mx-1" style={{ color: 'var(--text-color)', userSelect: 'none' }}>page: </span>
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
        refEmployee.current.create();
    }

    const edit = (d) => {
        refEmployee.current.edit(d);
    }

    const confirmDeleteProduct = (rowData) => {
        setItemData(rowData);
        setDeleteItem(true);
    }

    const deleteProduct = () => {
        setDeleteItem(false);
        EmployeeService.delete(itemData?.id).then(
            (res) => {
                loadData({}, employee);
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

    const changeState = (state) => {
        if(state === 0){
            return "Ngừng hoạt động";
        }
        else{
            return "Hoạt động"
        }
    }

    const afterSubmit = (mode, data) => {
        loadData({}, employee);
    }



    return (
        <div className="grid table-demo">
            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <div className="col-3">
                        <Button  label={"Thêm nhân viên"} icon="pi pi-plus" onClick={create} ></Button>
                    </div>
                    <DataTable
                        value={employee.data}
                        paginator
                        paginatorTemplate={template2}
                        first={employee.first}
                        rows={employee.size}
                        totalRecords={employee.total}
                        rowsPerPageOptions={[20, 25, 50, 100]}
                        onPage={onPage}
                        responsiveLayout="scroll"
                    >
                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '5%' }}
                            header={"STT"}
                            body={(d, row) => {
                                return <>{row.rowIndex + 1}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Mã"}
                            body={(d, row) => {
                                return <>{d.cmt ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Tên"}
                            body={(d, row) => {
                                return <>{d?.fullNameDto.firstName + " " + d?.fullNameDto.lastName ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Số điện thoại"}
                            body={(d, row) => {
                                return <>{d.tel ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Chức vụ"}
                            body={(d, row) => {
                                return <>{d.namePosition ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Ngày sinh"}
                            body={(d, row) => {
                                return <>{formatDate(d.birthDay) ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '10%' }}
                            header={"Trạng thái nhân viên"}
                            body={(d, row) => {
                                return <>{changeState(d.status) ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            frozen
                            alignFrozen="right"
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '10%' }}
                            body={(d) => (
                                <>
                                    <Button icon="pi pi-eye" className="p-button-rounded  mr-2 p-button-text" onClick={() => {edit(d)}} />
                                    <Button icon="pi pi-trash" className="p-button-rounded  p-button-text mt-2" onClick={() => confirmDeleteProduct(d)} />
                                </>
                            )}
                        ></Column>
                    </DataTable>
                </div>
            </div>
            <Employee_Details ref={refEmployee} toast={toast}  afterSubmit={afterSubmit}/>

            <Dialog visible={deleteItem} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {itemData && <span>Bạn có muốn ngừng hoạt động nhân viên <b>{itemData?.fullNameDto?.firstName + " " + itemData?.fullNameDto?.lastName ?? " " }</b> ?</span>}
                </div>
            </Dialog>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Employee, comparisonFn);
