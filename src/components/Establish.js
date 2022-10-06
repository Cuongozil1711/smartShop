import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Route, useHistory, useLocation } from 'react-router-dom';
import Category from "./category/Category";
import Publisher from "./publisher/Publisher";
import Stalls from "./stalls/Stalls";
import Customer from "./customer/Customer";
import {role} from "../assets/untils/const";
import Employee from "./employee/Employee";
const Establish = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const history = useHistory();
    const location = useLocation();

    const checkActiveIndex = useCallback(() => {
        const paths = location.pathname.split('/');
        const currentPath = paths[paths.length - 1];

        switch (currentPath) {
            case 'publisher':
                setActiveIndex(1);
                break;
            case 'stalls':
                setActiveIndex(2);
                break;
            case 'customer':
                setActiveIndex(3);
                break;
            case 'employee':
                setActiveIndex(4);
                break;
            default:
                break;
        }
    },[location])

    useEffect(() => {
        checkActiveIndex();
        if(role === 'ROLE_A'){
            wizardItems.push(
                { label: 'Nhân viên', command: () => history.push('/establish/employee') }
            )
        }
    }, [])


    const wizardItems = [
        { label: 'Loại mặt hàng', command: () => history.push('/establish') },
        { label: 'Đối tác', command: () => history.push('/establish/publisher') },
        { label: 'Quầy hàng', command: () => history.push('/establish/stalls') },
        { label: 'Khách hàng', command: () => history.push('/establish/customer') },
        role === 'ROLE_A' && { label: 'Nhân viên', command: () => history.push('/establish/employee') }
    ];
    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card card-w-title">
                    <h5>Thiết lập</h5>
                    <TabMenu model={wizardItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    <Route exact path={'/establish'} component={Category} />
                    <Route path={'/establish/publisher'} component={Publisher} />
                    <Route path={'/establish/stalls'} component={Stalls} />
                    <Route path={'/establish/customer'} component={Customer} />
                    {role === 'ROLE_A' && <Route path={'/establish/employee'} component={Employee} />}
                </div>
            </div>


        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Establish, comparisonFn);
