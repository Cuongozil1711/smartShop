import React  from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

export const AppTopbar = (props) => {

    return (
        <div className="layout-topbar">
            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars"/>
            </button>

            <Link to="/" className="layout-topbar-logo">
                <img src={ 'images/logo.png'} alt="logo" width={70} height={70}/>
                <span>Smart Shop</span>
            </Link>

                <ul className={classNames("layout-topbar-menu lg:flex origin-top", {'layout-topbar-menu-mobile-active': props.mobileTopbarMenuActive })}>
                    <li>
                        <div className="" style={{
                            "padding" : "15px"
                        }}>
                            <span>Xin chào ! {JSON.parse(localStorage.getItem("user"))?.fullName}</span>
                        </div>
                    </li>
                    <li>
                        <button className="p-link layout-topbar-button" onClick={() => {
                            localStorage.removeItem("user");
                            window.location.reload();
                        }}>
                            <i className="pi pi-sign-out"/>
                            <span>Profile</span>
                        </button>
                    </li>
                </ul>
        </div>
    );
}
