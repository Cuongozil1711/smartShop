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
                        labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
                        datasets: [
                            {
                                label: 'Xuất hàng',
                                data: res?.data?.exportItems,
                                fill: false,
                                backgroundColor: '#2f4860',
                                borderColor: '#2f4860',
                                tension: .4
                            },
                            {
                                label: 'Nhập hàng',
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
                        {e?.name}  <span className="text-orange-500 ml-3 font-medium">{e?.countOrder} đơn</span>
                    </div>
                </div>
            </li>)
    }

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12 lg:col-6 xl:col-3 flex justify-content-between">
                <Card title="Smart Shop" style={{"text-align": 'center'}} className="flex justify-content-between">
                    <p className="m-0" style={{lineHeight: '1.5'}}>Cửa hàng tiện lợi Smart Shop được nhượng quyền thương mại từ Mỹ và chính thức xuất hiện tại Việt Nam vào giữa năm 2009 bởi GR International.
                        Trước đó, Circle K đã xuất hiện ở một số nước như Trung Quốc, Hồng Kông, Nhật Bản, Indonesia trong một thời gian dài.
                        Với sự "du nhập" của mình, cửa hàng tiện lợi đã mang đến cho người tiêu dùng Việt Nam một cách thức mua sắm mới bên cạnh các hình thức truyền thống như đi chợ hay siêu thị.</p>

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
                                <span className="block text-500 font-medium mb-3">Đơn hàng</span>
                                <div className="text-900 font-medium text-xl">{data?.statisticalOrder?.sumQuality ?? 0}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                                <i className="pi pi-shopping-cart text-blue-500 text-xl"/>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{data?.statisticalOrder?.sumNow ?? 0} new </span>
                        <span className="text-500">đơn hàng mới</span>
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
                        <span className="text-500">so với tháng trước</span>
                    </div>

                </div>
                <div className="col-4">
                    <div className="card mb-0">
                        <div className="flex justify-content-between mb-3">
                            <div>
                                <span className="block text-500 font-medium mb-3">Khách hàng</span>
                                <div className="text-900 font-medium text-xl">{data?.statisticalCustomer?.sumQuality ?? 0}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{width: '2.5rem', height: '2.5rem'}}>
                                <i className="pi pi-inbox text-cyan-500 text-xl"/>
                            </div>
                        </div>
                        <span className="text-green-500 font-medium">{data?.statisticalCustomer?.sumNow ?? 0}  </span>
                        <span className="text-500">lượt đăng ký mới</span>
                    </div>
                </div>

            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Sản phẩm bán gần đây</h5>
                    <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                        <Column header="Ảnh" body={(data) => <img className="shadow-2" src={`${data.image}`} alt={data.image} width="50"/>}/>
                        <Column field="itemsName" header="Tên" sortable style={{width: '35%'}}/>
                        <Column field="totalPrice" header="Giá" sortable style={{width: '35%'}} body={(data) => Intl.NumberFormat('en-VI').format(data.totalPrice)}/>
                        <Column header="Số lượng" style={{width:'15%'}} body={(data) => data?.quantityItems}/>
                    </DataTable>
                </div>
                <div className="card">
                    <div className="flex justify-content-between align-items-center mb-5">
                        <h5>Top bán hàng trong tháng</h5>
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
                    <h5>Thống kê số lượt nhập hàng - xuất hàng</h5>
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
