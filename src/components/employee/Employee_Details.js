import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import Enumeration from "../../assets/untils/Enumeration";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import classNames from "classnames";
import {CustomerService} from "../../service/CustomerService";
import {AddressService} from "../../service/AddressService";
import {InputMask} from "primereact/inputmask";
import {Dropdown} from "primereact/dropdown";
import {PositionService} from "../../service/PositionService";
import {Password} from "primereact/password";
import {EmployeeService} from "../../service/userService/EmployeeService";
import {StorageService} from "../../service/storage/StorageService";
import {Calendar} from "primereact/calendar";
function Employee_Details(props, ref) {
    const { afterSubmit, toast } = props;
    const [show, setShow] = useState(false);
    const refEditMode = useRef(null);
    const dataDefault = {name: "", code: "", address: "", tel: "", firstName: "", lastName: "", cmt: "", provinceId: 1, districtId: null, wardId: null, positionId: null, username: "", password: "12345678", birthDay: ""};
    const [itemData, setItemData] = useState(dataDefault)
    const [submitted, setSubmitted] = useState(false);
    const [disabled, setDisable] = useState(false);

    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [position, setPosition] = useState([]);
    const [wards, setWards] = useState([]);
    const [uploadFile, setUploadFile] = React.useState();
    const [file, setFile] = React.useState("");

    useEffect(
        () => {
            AddressService.getAddress().then((res) => {
                if(res?.status === 200){
                    setProvince(res?.data?.province);
                    setDistrict(res?.data?.district);
                    setWards(res?.data?.wards);
                }
            }).catch(
                (ex) => {
                    toast.current.show({ severity: 'error', content: ex?.message ?? "Error NetWork" });
                }
            )

            PositionService.getPosition().then((res) => {
                if(res?.status === 200){
                    setPosition(res?.data)
                }
            }).catch(
                (ex) => {
                    toast.current.show({ severity: 'error', content: ex?.message ?? "Error NetWork" });
                }
            )

            setUploadFile("https://ui-avatars.com/api/?background=random&name=un");
        }, []
    )

    const validate = () => {
        const props = {
            cmt: null,
            firstName: null,
            lastName: null,
            tel: null,
            positionId: null
        };
        let check = 0;
        Object.keys(props).forEach((prop) => {
            if(itemData[prop]?.length ?? 0 < 0){
                check+= 1
            }
        });
        return check;
    }


    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
            setUploadFile(URL.createObjectURL(event.target.files[0]));
        }
    }

    const submit = async () => {
        setSubmitted(true);
        if(validate() === 0) return

        switch (refEditMode.current) {
            case Enumeration.crud.create:
                const dataArray = new FormData();
                dataArray.append("gifFile", file);
                const data = {
                    userLoginDto: {
                        username: itemData?.username,
                        password: itemData?.password
                    },
                    addressDto: {
                        name: itemData?.name,
                        provinceId: itemData?.provinceId,
                        districtId: itemData?.districtId,
                        wardId: itemData?.wardId
                    },
                    fullNameDto: {
                        firstName: itemData?.firstName,
                        lastName: itemData?.lastName,
                    },
                    tel: itemData?.tel,
                    cmt: itemData?.cmt,
                    idPosition: itemData?.positionId,
                    birthDay: itemData?.birthDay
                }

                EmployeeService.create(data).then(
                    (res) => {
                        if(res?.status === 200){
                            if(file != null){
                                dataArray.append("gifFile", file);
                                StorageService.upload("employee", res?.data?.id, dataArray).then(
                                    (res) => {
                                        if (afterSubmit && typeof afterSubmit === "function") {
                                            setFile(null);
                                            setUploadFile(null);
                                            setShow(false);
                                            afterSubmit(refEditMode.current, res?.data);
                                        }
                                    }
                                );
                            }
                            else if (afterSubmit && typeof afterSubmit === "function") {
                                setFile(null);
                                setUploadFile(null);
                                setShow(false);
                                afterSubmit(refEditMode.current, res?.data);
                            }
                        }
                    }
                )

                console.log(data);
                break;
            case  Enumeration.crud.edit:
                CustomerService.edit(itemData.id ,itemData).then(
                    (res) => {
                        if (afterSubmit && typeof afterSubmit === "function") {
                            setShow(false);
                            afterSubmit(refEditMode.current, res?.data);
                        }
                    }
                )
                break;
        }
    }

    const showAccount = (itemData, submitted) => {
        if(!disabled){
            return (
                <div>
                    <h5>Thông tin tài khoản</h5>

                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Email && Tên đăng nhập</label>
                            <InputText id="name" value={itemData.username} onChange={(e) => onInputChange(e, 'username')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.username })} />
                            {submitted && !itemData.username && <small className="p-invalid">Field is required.</small>}
                        </div>
                        <div className="field col">
                            <label htmlFor="name">Mật khẩu</label>
                            <Password value={itemData.password} onChange={(e) => onInputChange(e.target.value, 'password')} toggleMask />
                            {submitted && !itemData.password && <small className="p-invalid">Field is required.</small>}
                        </div>
                    </div>
                </div>
            )
        }
        else return <></>
    }

    /**
     * cancel
     */
    const cancel = () => {
        setShow(false);
    };

    useImperativeHandle(ref, () => ({
        /**
         * create
         */
        create: (type, _defaultDictionary) => {
            refEditMode.current = Enumeration.crud.create;
            setItemData(dataDefault);
            setShow(true);
            setDisable(false);
            setFile(null);
            setUploadFile("https://ui-avatars.com/api/?background=random&name=un");
        },


        edit: (d) => {
            setItemData({
                ...itemData,
                code: d?.cmt,
                cmt: d?.cmt,
                tel: d?.tel,
                birthDay: d?.birthDay,
                firstName: d?.fullNameDto?.firstName,
                lastName: d?.fullNameDto?.lastName,
                provinceId: d?.addressDto.provinceId,
                districtId: d?.addressDto.districtId,
                positionId: d?.idPosition,
                wardId: d?.addressDto.wardId,
                name: d?.addressDto.name,
                image: d?.image,
            });
            setUploadFile(d?.image ?? "https://ui-avatars.com/api/?background=random&name=un");
            refEditMode.current = Enumeration.crud.edit;
            setShow(true);
            setDisable(true);
        }

    }));

    const onInputChange = (e, name) => {
        if(name === 'provinceId' || name === 'districtId' || name === 'wardId' || name === 'positionId' || name === 'password'){
            let _product = { ...itemData };
            _product[`${name}`] = e;
            setItemData(_product);
        }
        else{
            const val = (e.target && e.target.value) || '';
            let _product = { ...itemData };
            _product[`${name}`] = val;
            setItemData(_product);
        }
    }


    return (
        <Dialog
            visible={show}
            style={{ width: '950px' }}
            header="Nhân viên"
            modal
            resizable={disabled}
            className="p-fluid"
            footer={() => (
                <>
                    <Button className="p-button-text" label={"Hủy"} onClick={() => cancel()}></Button>
                    <Button className="primary" label={"Lưu"} onClick={() => submit(true)}></Button>
                </>
            )}
            onHide={cancel}
        >
            {show && (
                <div className={"row"}>

                    <div className="field col-3 flex-center" style={{background: '#ededed'}}>
                        <div className="formgrid grid" style={{display: 'flex', justifyContent : 'center'}}>
                                <img src={uploadFile} alt="preview image" width={"100"} height={100} />
                                <input disabled={disabled} type="file" accept="image/png, .jpeg, .jpg, image/gif" onChange={onImageChange} className="filetype" title="Choose a video please" id="img" style={{marginTop: '15px',}}>
                                </input>
                        </div>
                    </div>

                    <div className="field col-9">
                        <h5>Thông tin chung</h5>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Số chứng minh thư <span className="text-red-600">*</span></label>
                                <InputText type={"text"} disabled={disabled}  value={itemData.cmt}  onChange={(e) => onInputChange(e, 'cmt')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.cmt })} />
                                {submitted && !itemData.cmt && <small className="p-invalid">Dữ liệu không được để trống</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="name">Họ tên <span className="text-red-600">*</span></label>
                                <InputText id="name" disabled={disabled} value={itemData.firstName} onChange={(e) => onInputChange(e, 'firstName')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.firstName })} />
                                {submitted && !itemData.firstName && <small className="text-red-600 p-invalid">Dữ liệu không được để trống</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="name">Tên đệm <span className="text-red-600">*</span></label>
                                <InputText id="name" disabled={disabled} value={itemData.lastName} onChange={(e) => onInputChange(e, 'lastName')} required autoFocus className={classNames({ 'p-invalid': submitted && !itemData.lastName })} />
                                {submitted && !itemData.lastName && <small className="text-red-600 p-invalid">Dữ liệu không được để trống</small>}
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Số điện thoại <span className="text-red-600">*</span></label>
                                <InputMask id="phone" disabled={disabled} mask="(999) 999-9999" value={itemData.tel} placeholder="(999) 999-9999" onChange={(e) => onInputChange(e, 'tel')}></InputMask>
                                {submitted && !itemData.tel && <small className="text-red-600 p-invalid">Dữ liệu không được để trống</small>}
                            </div>
                            <div className="field col">
                                <label htmlFor="basic">Ngày sinh</label>
                                <Calendar id="basic" disabled={disabled}  value={itemData.birthDay} onChange={(e) => onInputChange(e, 'birthDay')} dateFormat="mm-dd-yy" />
                            </div>
                            <div className="field col"></div>
                        </div>

                        <h5>Địa chỉ</h5>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Tỉnh thành</label>
                                <Dropdown value={itemData?.provinceId} disabled={disabled} optionValue="provinceId" onChange={(e) => onInputChange(e.value,'provinceId')} options={province} optionLabel="name" placeholder="Select" />
                            </div>
                            <div className="field col">
                                <label htmlFor="name">Quận huyện</label>
                                <Dropdown value={itemData?.districtId} disabled={disabled} optionValue="districtId" onChange={(e) => onInputChange(e.value,'districtId')} options={district.filter(res => res.provinceId == itemData?.provinceId)} optionLabel="name" placeholder="Select" />
                            </div>
                            <div className="field col">
                                <label htmlFor="name">Phường xã</label>
                                <Dropdown value={itemData?.wardId} disabled={disabled} optionValue="wardId" onChange={(e) => onInputChange(e.value,'wardId')} options={wards.filter(res => res.districtId == itemData?.districtId)} optionLabel="name" placeholder="Select" />
                            </div>
                        </div>

                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name">Địa chỉ chi tiết</label>
                                <InputText id="name" value={itemData.name} disabled={disabled} onChange={(e) => onInputChange(e, 'name')} required autoFocus />
                            </div>
                            <div className="field col">
                            </div>
                        </div>

                        <>{showAccount(itemData, submitted)}</>

                        <div className={"formgrid grid"}>
                            <div className="field col">
                                <label htmlFor="name">Vị trí công việc <span className="text-red-600">*</span></label>
                                <Dropdown value={itemData?.positionId} disabled={disabled} optionValue="id" onChange={(e) => onInputChange(e.value,'positionId')} options={position} optionLabel="name" placeholder="Select" />
                                {submitted && !itemData.positionId && <small className="text-red-600 p-invalid">Field is required.</small>}
                            </div>
                            <div className="field col"></div>
                            <div className="field col"></div>
                        </div>

                    </div>
                </div>
            )}
        </Dialog>
    )

}

Employee_Details = forwardRef(Employee_Details);

export default Employee_Details;
