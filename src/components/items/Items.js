import React, {useState, useEffect, useRef} from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import {ItemsService} from "../../service/ItemsService";
import { Toast } from 'primereact/toast';
import {Dialog} from "primereact/dialog";
import Items_Details from "./Items_Details";
import { InputText } from 'primereact/inputtext';
import Items_Details_Import from "./Items_Details_Import";
import {OverlayPanel} from "primereact/overlaypanel";
import {PublisherService} from "../../service/PublisherService";
import {StallsService} from "../../service/StallsService";
import {CategoryService} from "../../service/CategoryService";
import * as XLSX from 'xlsx'
const Items = () => {
    const [search, setSearch] = useState("");
    const defaultData = { first: 0, size: 10, page: 0, total: 0, rows: 10, data: [] };
    const [items, setItems] = useState(defaultData);
    const [deleteItem, setDeleteItem] = useState(null);
    const [itemData, setItemData] = useState(null);
    const refPosition = useRef();
    const refDetails = useRef();
    const toast = useRef(null);
    const op = useRef();
    const [publisher, setPublisher] = useState(null);
    const [category, setCategory] = useState(null);
    const [stalls, setStalls] = useState(null);
    const [bodySearch, setBodySearch] = useState({idPubliser: null, idStall: null, idCategory: null});
    const onPage = (event) => {
        loadData(null, { ...items, size: event.rows, page: event.page });

        // loadData();
    };

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

            const res = await ItemsService.search(_params);
            if(res?.status == 200){
                const data = res?.data;
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

    const onExportFile = () => {
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(items.data.map((e) => {return {
            'Mã sản phẩm' : e.code,
            'Tên sản phẩm' : e.name,
            'Tổng đã bán': e.totalSold,
            'Số lượng còn trong kho': e.totalInWareHouse,
        }}));

        var wscols = [
            {wch:20},
            {wch:25},
            {wch:30},
            {wch:30}
        ];
        ws['!cols'] = wscols;
        XLSX.utils.book_append_sheet(wb, ws, 'Dssp');
        XLSX.writeFile(wb, 'Dssp.xlsx');
    }

    const edit = (d) => {
        refPosition.current.edit(d);
    }

    const view = (d) => {
        refDetails.current.view(d);
    }

    const confirmDeleteProduct = (rowData) => {
        setItemData(rowData);
        setDeleteItem(true);
    }

    const onInputChange = (e, name) => {
        if (name === "idPubliser" || name === "idStall" || name === "idCategory") {
            let _product = {...itemData};
            _product[`${name}`] = e;
            setBodySearch(_product);
        }
    }

    const deleteProduct = () => {
        setDeleteItem(false);
        ItemsService.delete(itemData?.id).then(
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
                    <div className="row" style={{marginBottom: '15px'}}>
                        <div className="col-8">
                            <Button  label={"Thêm mặt hàng"} icon="pi pi-plus" onClick={create} ></Button>
                            <Button  label={"Xuất file"} icon="pi-file-excel" onClick={onExportFile} style={{"marginLeft": '10px'}} ></Button>
                        </div>
                        <div className="col-4">
                            <div className="flex justify-content-end">
                                <span className="p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText value={search}  placeholder="Tìm kiếm sản phẩm" onChange={(e) => {
                                        setSearch(e.target.value);
                                        loadData({}, items, e.target.value);
                                    }} />
                                </span>
                                <Button type="button" icon="pi pi-filter" style={{color: '#757575'}} onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="p-button-rounded p-button-success p-button-text"/>
                            </div>
                        </div>
                    </div>
                    <DataTable
                        value={items.data}
                        paginator
                        emptyMessage={'Không có dữ liệu'}
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
                            header={"Ảnh sản phẩm"}
                            body={(d) => {
                                return <img className="shadow-2" src={`${d.image}`} alt={d.image} width="100" height="100"/>
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '10%' }}
                            header={"Mã"}
                            body={(d, row) => {
                                return <>{d.code ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Tên"}
                            body={(d, row) => {
                                return <>{d.name ?? ""}</>;
                            }}
                        ></Column>

                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Tổng đã bán"}
                            body={(d, row) => {
                                return <>{d.totalSold ?? "0"}</>;
                            }}
                        ></Column>


                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '15%' }}
                            header={"Còn lại trong kho"}
                            body={(d) => {
                                return <>{d.totalInWareHouse ?? "0"}</>;
                            }}
                        ></Column>


                        <Column
                            headerClassName="justify-content-center"
                            bodyClassName="justify-content-center"
                            style={{ width: '20%' }}
                            body={(d) => (
                                <>
                                    <Button icon="pi pi-pencil" tooltip={'Sửa'} className="p-button-rounded  p-button-text" onClick={() => {edit(d)}} />
                                    <Button icon="pi pi-eye" tooltip={'Xem'} className="p-button-rounded  p-button-text" onClick={() => {view(d)}} />
                                    <Button icon="pi pi-trash" tooltip={'Xóa'} className="p-button-rounded  p-button-text" onClick={() => confirmDeleteProduct(d)} />
                                </>
                            )}
                        ></Column>
                    </DataTable>
                </div>
            </div>
            <Items_Details ref={refPosition}  afterSubmit={afterSubmit}/>

            <Items_Details_Import ref={refDetails} toast={toast} afterSubmit={afterSubmit}/>

            <Dialog visible={deleteItem} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {itemData && <span>Bạn có muốn xóa mặt hàng <b>{itemData.name}</b>?</span>}
                </div>
            </Dialog>

            <OverlayPanel ref={op}  id="overlay_panel" style={{width: '350px'}} className="overlaypanel-demo">
                <div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Nhà sản xuất</label>
                            <Dropdown value={bodySearch?.idPubliser} optionValue="id" onChange={(e) => onInputChange(e.value,'idPubliser')} options={publisher} optionLabel="name" placeholder="Select" />
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Quầy hàng</label>
                            <Dropdown value={bodySearch?.idStall} optionValue="id" onChange={(e) => onInputChange(e.value,'idStall')} options={stalls} optionLabel="name" placeholder="Select" />
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Mặt hàng</label>
                            <Dropdown value={bodySearch?.idCategory} optionValue="id" onChange={(e) => onInputChange(e.value,'idCategory')} options={category} optionLabel="name" placeholder="Select" />
                        </div>
                        <div className="field col">
                        </div>
                    </div>
                </div>
            </OverlayPanel>
        </div>

    );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Items, comparisonFn);
