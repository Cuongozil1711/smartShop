import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Route, useHistory, useLocation } from 'react-router-dom';
import Category from "./category/Category";
import Publisher from "./publisher/Publisher";
import Stalls from "./stalls/Stalls";
import WareHouse from "./wareHouse/WareHouse";
import ReceiptImportWareHouse from "./receiptImportWareHouse/ReceiptImportWareHouse";
import ReceiptExportWareHouse from "./receiptExportWareHouse/ReceiptExportWareHouse";

const Establish_WareHouse = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const history = useHistory();
    const location = useLocation();

    const checkActiveIndex = useCallback(() => {
        const paths = location.pathname.split('/');
        const currentPath = paths[paths.length - 1];

        switch (currentPath) {
            case 'import':
                setActiveIndex(1);
                break;
            case 'stalls':
                setActiveIndex(2);
                break;
            default:
                break;
        }
    },[location])

    useEffect(() => {
        checkActiveIndex();
    }, [checkActiveIndex])

    const wizardItems = [
        { label: 'Kho hàng', command: () => history.push('/establish_warehouse') },
        { label: 'Phiếu nhập kho', command: () => history.push('/establish_warehouse/import') },
        { label: 'Phiếu xuất kho', command: () => history.push('/establish_warehouse/stalls') },
    ];
    return (
        <div className="grid p-fluid">
            <div className="col-12">
                <div className="card card-w-title">
                    <h5>Thiết lập</h5>
                    <TabMenu model={wizardItems} activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} />
                    <Route exact path={'/establish_warehouse'} component={WareHouse} />
                    <Route path={'/establish_warehouse/import'} component={ReceiptImportWareHouse} />
                    <Route path={'/establish_warehouse/stalls'} component={ReceiptExportWareHouse} />
                </div>
            </div>


        </div>
    )
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Establish_WareHouse, comparisonFn);
