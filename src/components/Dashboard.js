import React, { useState, useEffect, useRef } from 'react';
import { Menu } from 'primereact/menu';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import {StatisticalService} from "../service/StatisticalService";
import { Card }from 'primereact/card';
import {ExportWareHouseService} from "../service/ExportWareHouseService";
import {EmployeeService} from "../service/userService/EmployeeService";
import {Avatar} from "primereact/avatar";
const Dashboard = (props) => {
    const [products, setProducts] = useState(null);
    const menu1 = useRef(null);
    const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null)
    const [data, setData] = useState(null);
    const toast = useRef(null);
    const [chartData, setChartData] = useState();
    const [employee, setEmployee] = useState([]);
    const [employeeSale, setEmployeeSale] = useState([]);

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

        let _params = {
            page: 0,
            size: 99,
        };
        EmployeeService.search(_params).then((res) => {
            if(res?.status === 200){
                setEmployee(res?.data?.content);
            }
        }).catch((ex) => {
            toast.current.show({ severity: 'error', content: ex?.message ?? 'Message Detail' });
        })

        StatisticalService.getOrderByEmployee().then((res) => {
            if(res?.status === 200){
                setEmployeeSale(res?.data);
            }
        }).catch((ex) => {
            toast.current.show({ severity: 'error', content: ex?.message ?? 'Message Detail' });
        })

        StatisticalService.chartInfo().then(
            (res) => {
                if(res?.status === 200){
                    console.log(res?.data);
                    const lineData = {
                        labels: ['Th??ng 1', 'Th??ng 2', 'Th??ng 3', 'Th??ng 4', 'Th??ng 5', 'Th??ng 6', 'Th??ng 7', 'Th??ng 8', 'Th??ng 9', 'Th??ng 10', 'Th??ng 11', 'Th??ng 12'],
                        datasets: [
                            {
                                label: 'Xu???t h??ng',
                                data: res?.data?.exportItems,
                                fill: false,
                                backgroundColor: '#2f4860',
                                borderColor: '#2f4860',
                                tension: .4
                            },
                            {
                                label: 'Nh???p h??ng',
                                data: res?.data?.importItems,
                                fill: false,
                                backgroundColor: '#00bb7e',
                                borderColor: '#00bb7e',
                                tension: .4
                            }
                        ]
                    }
                    setChartData(lineData);
                }
            }
        ).catch(
            (ex) => {
                toast.current.show({ severity: 'error', content: ex?.message ?? 'Message Detail' });
            }
        )

    }, [])




    const applyLightTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };

        setLineOptions(lineOptions)
    }

    useEffect(() => {
        ExportWareHouseService.getListOrder().then(res => {
            if(res?.status == 200){
                setProducts(res?.data)
            }
        });
    }, []);

    useEffect(() => {
        if (props.colorMode === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);


    const itemEmployeeSle = (e) => {
        return (
            <li className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4">
                <div>
                    <Avatar image={e?.image} className="mr-2" size="large" shape="circle" />
                </div>
                <div className="mt-2 md:mt-0 flex align-items-center">
                    <div className="" style={{height: '8px'}}>
                        {e?.name}  <span className="text-orange-500 ml-3 font-medium">{e?.countOrder} ????n</span>
                    </div>
                </div>
            </li>)
    }

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12 lg:col-6 xl:col-3 flex justify-content-between">
                <Card title="Smart Shop" style={{"text-align": 'center'}} className="flex justify-content-between">
                    <p className="m-0" style={{lineHeight: '1.5'}}>C???a h??ng ti???n l???i Smart Shop ???????c nh?????ng quy???n th????ng m???i t??? M??? v?? ch??nh th???c xu???t hi???n t???i Vi???t Nam v??o gi???a n??m 2009 b???i GR International.
                        Tr?????c ????, Circle K ???? xu???t hi???n ??? m???t s??? n?????c nh?? Trung Qu???c, H???ng K??ng, Nh???t B???n, Indonesia trong m???t th???i gian d??i.
                        V???i s??? "du nh???p" c???a m??nh, c???a h??ng ti???n l???i ???? mang ?????n cho ng?????i ti??u d??ng Vi???t Nam m???t c??ch th???c mua s???m m???i b??n c???nh c??c h??nh th???c truy???n th???ng nh?? ??i ch??? hay si??u th???.</p>

                    <div style={{"margin-top": '15px'}}>
                    {
                        employee.map(e => {
                            return <Avatar image={e?.image} className="mr-2" size="large" shape="circle" />
                        })
                    }
                    </div>
                </Card>
            </div>
            <div className="col-12 lg:col-6 xl:col-3 flex justify-content-between">
                <div className="col-4">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">????n h??ng</span>
                                <div className="text-900 font-medium text-xl">{data?.statisticalOrder?.sumQuality ?? 0}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                                <i className="pi pi-shopping-cart text-blue-500 text-xl"/>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{data?.statisticalOrder?.sumNow ?? 0} new </span>
                        <span className="text-500">????n h??ng m???i</span>
                    </div>
                </div>
                <div className="col-4">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Doanh thu</span>
                                <div className="text-900 font-medium text-xl">{Intl.NumberFormat('en-VI').format(data?.statisticalRevenue?.sumPriceNow) ?? 0} VND</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                                <i className="pi pi-map-marker text-orange-500 text-xl"/>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">%{(data?.statisticalRevenue?.sumPriceNow/(data?.statisticalRevenue?.sumPriceAfter + data?.statisticalRevenue?.sumPriceNow))*100}+ </span>
                        <span className="text-500">so v???i th??ng tr?????c</span>
                    </div>

                </div>
                <div className="col-4">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Kh??ch h??ng</span>
                                <div className="text-900 font-medium text-xl">{data?.statisticalCustomer?.sumQuality ?? 0}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                                <i className="pi pi-inbox text-cyan-500 text-xl"/>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{data?.statisticalCustomer?.sumNow ?? 0}  </span>
                        <span className="text-500">l?????t ????ng k?? m???i</span>
                    </div>
                </div>

            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>S???n ph???m b??n g???n ????y</h5>
                    <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                        <Column header="???nh" body={(data) => <img className="shadow-2" src={`${data.image}`} alt={data.image} width="50"/>}/>
                        <Column field="itemsName" header="T??n" sortable style={{width: '35%'}}/>
                        <Column field="totalPrice" header="Gi??" sortable style={{width: '35%'}} body={(data) => Intl.NumberFormat('en-VI').format(data.totalPrice)}/>
                        <Column header="S??? l?????ng" style={{width:'15%'}} body={(data) => data?.quantityItems}/>
                    </DataTable>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Top b??n h??ng trong th??ng</h5>
                        <div>
                            <Button type="button" icon="pi pi-ellipsis-v" className="p-button-rounded p-button-text p-button-plain" onClick={(event) => menu1.current.toggle(event)}/>
                            <Menu ref={menu1} popup model={[{ label: 'Add New', icon: 'pi pi-fw pi-plus' }, { label: 'Remove', icon: 'pi pi-fw pi-minus' }]}/>
                        </div>
                    </div>
                    <ul className="list-none p-0 m-0">

                        {
                            employeeSale.map((e) => {
                                return itemEmployeeSle(e);
                            })
                        }

                    </ul>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Th???ng k?? s??? l?????t nh???p h??ng - xu???t h??ng</h5>
                    <Chart type="line" data={chartData} options={lineOptions} />
                </div>
            </div>
        </div>
    );
}

const comparisonFn = function (prevProps, nextProps) {
    return (prevProps.location.pathname === nextProps.location.pathname) && (prevProps.colorMode === nextProps.colorMode);
};

export default React.memo(Dashboard, comparisonFn);
