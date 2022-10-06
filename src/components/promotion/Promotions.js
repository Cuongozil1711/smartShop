import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import {InputText} from "primereact/inputtext";
import {OverlayPanel} from "primereact/overlaypanel";
import {Dropdown} from "primereact/dropdown";
import {formatDate} from "@fullcalendar/core";
import {Calendar} from "primereact/calendar";
import Promotions_Details from "./Promotions_Details";
import {PromotionsService} from "../../service/PromotionsService";

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

const Promotions = (props) => {
    const [data, setData] = useState(null);
    const toast = useRef(null);
    const op = useRef();
    const [search, setSearch] = useState("");
    const [search1, setSearch1] = useState("");
    const defaultData = { first: 0, size: 10, page: 0, total: 0, rows: 10, data: [], data1: [] };
    const [items, setItems] = useState(defaultData);
    const [items1, setExportWareHouseWareHouse] = useState(defaultData);
    const [qualityExport, setQualityExport] = useState(0);
    const [qualityImport, setQualityImport] = useState(0);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();


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

            const res = await PromotionsService.search(_params, 1, search, date);
            if(res?.status == 200){
                const data = res?.data;
                let total = 0;
                // eslint-disable-next-line no-unused-expressions
                res?.data?.content.forEach(e => {
                    total += e?.totalPrice ?? 0
                })
                setQualityImport(total);

                setItems({
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



    const afterSubmit = (mode, data) => {
        loadData({}, items);
    }

    const refPosition = useRef();



    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const create = () => {
        refPosition.current.create();
    }

    const edit = (d, disabled) => {
        refPosition.current.edit(d, disabled);
    }

    const checkUser = (d) => {
        let date = new Date();
        let dateFrom = new Date(d?.promotion?.dateFrom);
        let dateEnd = new Date(d?.promotion?.dateEnd);
        if(date >= dateFrom && date <= dateEnd && d?.promotion?.deleteFlg === 1){
            return true;
        }
        return false;
    }

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card">
                    <div className="row" style={{marginBottom: '15px'}}>
                        <div className="col-8">
                            <Button  label={"Tạo khuyến mại"} icon="pi pi-book" style={{marginLeft: '15px'}} onClick={() => create()} ></Button>
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
                            style={{ width: '15%' }}
                            header={"Mã khuyến mại"}
                            body={(d, row) => {
                                return <>{d?.promotion?.code ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '30%' }}
                            header={"Tên chương trình khuyến mại"}
                            body={(d, row) => {
                                return <>{d?.promotion?.name ?? ""}</>;
                            }}
                        ></Column>


                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Ngày bắt đầu"}
                            body={(d) => {
                                return <>{formatDate(d?.promotion?.dateFrom) ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            header={"Ngày kết thúc"}
                            body={(d) => {
                                return <>{formatDate(d?.promotion?.dateEnd) ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '10%' }}
                            header={"Hiệu lực"}
                            body={(d) => {
                                if(!checkUser(d)){
                                    return <>Hết hiệu lực</>;
                                }
                                else{
                                    return <>Còn hiệu lực</>;
                                }

                            }}
                        ></Column>

                        <Column
                            frozen
                            alignFrozen="right"
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '5%' }}
                            body={(d) => (
                                <>
                                    <Button icon="pi pi-pencil" className="p-button-rounded mr-2 p-button-text" onClick={() => {edit(d, checkUser(d))}} />
                                </>
                            )}
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

            <Promotions_Details ref={refPosition} afterSubmit={afterSubmit} toast={toast}/>

        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Promotions, comparisonFn);
