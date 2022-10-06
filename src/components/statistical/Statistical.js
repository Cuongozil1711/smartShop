import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import {StatisticalService} from "../../service/StatisticalService";
import {InputText} from "primereact/inputtext";
import {OverlayPanel} from "primereact/overlaypanel";
import {ImportWareHouseService} from "../../service/ImportWareHouseService";
import {Dropdown} from "primereact/dropdown";
import {formatDate} from "@fullcalendar/core";
import {Avatar} from "primereact/avatar";
import {ExportWareHouseService} from "../../service/ExportWareHouseService";
import {Calendar} from "primereact/calendar";

const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: .4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: .4
        }
    ]
};

const Statistical = (props) => {
    const [data, setData] = useState(null);
    const toast = useRef(null);
    const op = useRef();
    const [search, setSearch] = useState("");
    const [search1, setSearch1] = useState("");
    const defaultData = { first: 0, size: 10, page: 0, total: 0, rows: 10, data: [], data1: [] };
    const [items, setImportWareHouseWareHouse] = useState(defaultData);
    const [items1, setExportWareHouseWareHouse] = useState(defaultData);
    const [qualityExport, setQualityExport] = useState(0);
    const [qualityImport, setQualityImport] = useState(0);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();


    const onPage = (event) => {
        loadData(null, { ...items, size: event.rows, page: event.page });


        // loadData();
    };

    const onPage1 = (event) => {
        loadData1(null, { ...items1, size: event.rows, page: event.page });


        // loadData();
    };

    useEffect(
        () => {
            loadData({
                page: 0,
                size: 10,
            }, defaultData);

            loadData1({
                page: 0,
                size: 10,
            }, defaultData);

        }, [startDate, endDate]
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
                startDate: startDate,
                endDate: endDate
            }

            const res = await ImportWareHouseService.listImport(_params, 1, search, date);
            if(res?.status == 200){
                const data = res?.data;
                let total = 0;
                // eslint-disable-next-line no-unused-expressions
                res?.data?.content.forEach(e => {
                    total += e?.totalPrice ?? 0
                })
                setQualityImport(total);

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

    /**
     * load data
     * @param {*} _recruitment
     */
    const loadData1 = async (_filter, _datas) => {
        try {
            let _params = {
                page: _datas.page || 0,
                size: _datas.size || 20,
                search: search ?? ""
            };

            const date = {
                startDate: startDate,
                endDate: endDate
            }

            const res = await ExportWareHouseService.listExport(_params, 1, search, date);
            if(res?.status == 200){
                const data = res?.data;

                let total = 0;
                // eslint-disable-next-line no-unused-expressions
                res?.data.content?.forEach(e => {
                    total += e?.totalPrice ?? 0
                })
                setQualityExport(total);

                setExportWareHouseWareHouse({
                    ...items1,
                    data1: data?.content,
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



    const afterSubmit = (mode, data) => {
        loadData({}, items);
    }

    useEffect(() => {
        StatisticalService.getStatistical().then(
            (res) => {
                if(res?.status === 200){
                    console.log(res?.data);
                    setData(res?.data);
                }
            }
        ).catch(
            (ex) => {
                toast.current.show({ severity: 'error', content: ex?.message ?? 'Message Detail' });
            }
        )
    }, [])



    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="flex  card mb-0" style={{"flex-direction": "row"}}>
                    <div className="col-3 justify-content-between">
                        <div>
                            <span className="block text-900 font-medium mb-3">Tổng thu</span>
                            <div className="font-medium text-xl center" style={{'color': 'rgb(14, 131, 173)'}}>{Intl.NumberFormat('en-VI').format(qualityExport) ?? 0} VNĐ</div>
                        </div>
                    </div>

                    <div className="col-3 flex justify-content-between">
                        <div>
                            <span className="block text-900 font-medium mb-3">Tổng chi</span>
                            <div className="font-medium text-xl" style={{'color': 'rgb(194, 3, 3)'}}>{Intl.NumberFormat('en-VI').format(qualityImport) ?? 0} VNĐ</div>
                        </div>
                    </div>

                    <div className="col-3 justify-content-between">
                        <div>
                            <span className="block text-900 font-medium mb-3">Lợi nhuận</span>
                            <div className="font-medium text-xl" style={{'color': '#4f9e00'}}>{Intl.NumberFormat('en-VI').format(qualityExport - qualityImport)  ?? 0} VNĐ</div>
                        </div>
                    </div>

                    <div className="col-3 flex justify-content-end">
                        <div>
                            <Button type="button" icon="pi pi-filter" style={{color: '#757575'}} onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="p-button-rounded p-button-success p-button-text"/>
                        </div>
                   </div>
                </div>

            </div>


            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <div className="row" style={{marginBottom: '15px'}}>
                        <div className="col-8">
                            <Button  label={"Xuất file chi"} icon="pi pi-book" style={{marginLeft: '15px'}}></Button>
                        </div>
                        <div className="col-4">
                            <div className="flex justify-content-end">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText value={search}  placeholder="Tìm kiếm theo phiếu" onChange={(e) => {
                                        setSearch(e.target.value);
                                        loadData({}, items, e.target.value);
                                    }} />
                                </span>
                            </div>
                        </div>
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
                                return <> {row.rowIndex + 1} </>
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '10%' }}
                            header={"Mã chi"}
                            body={(d, row) => {
                                return <>{d?.receiptImportWareHouse?.code ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '25%' }}
                            header={"Tên sản phẩm"}
                            body={(d, row) => {
                                return <>{d?.itemName ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Số lượng"}
                            body={(d, row) => {
                                return <>{d?.quantityItems ?? ""}</>;
                            }}
                        ></Column>


                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Tổng tiền"}
                            body={(d) => {
                                return <>{Intl.NumberFormat('en-VI').format(d.totalPrice) ?? "0"}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '10%' }}
                            header={"Ngày chi"}
                            body={(d, row) => {
                                return <>{formatDate(d.createDate) ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Người nhập"}
                            body={(d, row) => {
                                return <><Avatar icon="pi pi-user" className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" label={d?.creatByName[0]} />{d.creatByName ?? ""}</>;
                            }}
                        ></Column>
                    </DataTable>


                </div>
            </div>

            <div className="col-12">
                <Toast ref={toast} />
                <div className="card">
                    <div className="row" style={{marginBottom: '15px'}}>
                        <div className="col-8">
                            <Button  label={"Xuất file thu"} icon="pi pi-book" style={{marginLeft: '15px'}}></Button>
                        </div>
                        <div className="col-4">
                            <div className="flex justify-content-end">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText value={search1}  placeholder="Tìm kiếm theo phiếu" onChange={(e) => {
                                        setSearch1(e.target.value);
                                        loadData({}, items, e.target.value);
                                    }} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <DataTable
                        value={items1.data1}
                        paginator
                        paginatorTemplate={template2}
                        first={items1.first}
                        rows={items1.size}
                        totalRecords={items1.total}
                        rowsPerPageOptions={[20, 25, 50, 100]}
                        onPage={onPage1}
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
                            style={{ width: '10%' }}
                            header={"Mã thu"}
                            body={(d, row) => {
                                if(d?.idReceiptExport)
                                return <>{d?.receiptExportWareHouse?.code ?? ""}</>;
                                else if(d?.order){
                                    return <>{d?.order?.code ?? ""}</>;
                                }
                                else return <>Tặng đính kèm</>
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '25%' }}
                            header={"Tên sản phẩm xuất"}
                            body={(d, row) => {
                                return <>{d?.itemsName ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Số lượng"}
                            body={(d) => {
                                return <>{d?.quantityItems ?? "0"}</>;
                            }}
                        ></Column>


                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Tổng tiền"}
                            body={(d) => {
                                return <>{Intl.NumberFormat('en-VI').format(d.totalPrice) ?? "0"}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '10%' }}
                            header={"Ngày xuất"}
                            body={(d, row) => {
                                return <>{formatDate(d.createDate) ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Người xuất"}
                            body={(d, row) => {
                                return <><Avatar icon="pi pi-user" className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} shape="circle" label={d?.creatByName[0]} />{d.creatByName ?? ""}</>;
                            }}
                        ></Column>

                    </DataTable>


                </div>
            </div>



            <OverlayPanel ref={op}  id="overlay_panel" style={{width: '250px'}} className="overlaypanel-demo">
                <div className="col-12 flex justify-content-between" style={{"flex-direction": "column"}}>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="basic">Thời gian từ</label>
                        <Calendar id="icon" value={startDate} onChange={(e) => setStartDate(e.value)}  dateFormat="mm-dd-yy" />
                    </div>
                    <div className="field col-12 md:col-4">
                        <label htmlFor="basic">Thời gian đến</label>
                        <Calendar id="icon"  value={endDate} onChange={(e) => setEndDate(e.value)} dateFormat="mm-dd-yy" />
                    </div>
                </div>
            </OverlayPanel>

        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Statistical, comparisonFn);
