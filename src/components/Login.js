import React, {useRef, useState} from "react";
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import 'prismjs/themes/prism-coy.css';
import '../assets/demo/flags/flags.css';
import '../assets/demo/Demos.scss';
import '../assets/layout/layout.scss';
import '../App.scss';
import '../Login.css';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBInput
}
    from 'mdb-react-ui-kit';
import {LoginService} from "../service/userService/loginService";
import { Toast } from 'primereact/toast';
export default function Login({props}) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const toast = useRef(null);

    async function handleSubmit() {
        if(email.length > 0 && password.length > 0){
            const loginService = new LoginService();
            const res = await loginService.login(
                {
                    "username" : email,
                    "password": password
                }
            ).catch(
                (ex) => {
                    console.log(ex);
                    toast.current.show({ severity: 'error', content: ex?.message ?? "Sai thông tin đăng nhập" });
                }
            ) ;
            console.log(res);
            if(res?.status == 200){
                localStorage.setItem("user", JSON.stringify(res?.data));
                window.location.reload();
            }
        }
        else{
            toast.current.show({ severity: 'error', content: "Tài khoản && mật khẩu không hợp lệ" });
        }

    }
    return (
        <MDBContainer className="my-7"  style={{width : '960px'}}>
            <Toast ref={toast} />
            <MDBCard>
                <MDBRow className='g-0'>

                    <MDBCol md='6'>
                        <MDBCardImage src='https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img1.webp' alt="login form" className='rounded-start w-100'  style={{height : '650px'}}/>
                    </MDBCol>

                    <MDBCol md='6'>
                        <MDBCardBody className='d-flex flex-column'>

                            <div className='d-flex flex-row mt-2' style={{justifyContent : "center"}}>
                                <img src="images/blocks/logos/hyper.svg" alt="hyper" height="50" className="mb-3" />
                            </div>

                            <h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px', textAlign: 'center', fontSize: '20px'}}>Sign into your account</h5>

                            <MDBInput wrapperClass='mb-4' label='Username or email' id='formControlLg' type='email' size="lg" style={{height: '40px', fontSize: '14px'}} onChange={e => setEmail(e.target.value)} />
                            <MDBInput wrapperClass='mb-4' label='Password' id='formControlLg' type='password' size="lg" style={{height: '40px', fontSize: '14px'}} onChange={e => setPassword(e.target.value)}/>

                            <MDBBtn className="mb-3 px-5" color='dark' size='lg' style={{height: '40px', fontSize: '14px', marginTop: '15px'}}  onClick={() => handleSubmit()}>Login</MDBBtn>

                            <div className='d-flex flex-row justify-content-center'>
                                <a href="#!" className="small text-muted me-1" style={{fontSize: '12px', marginTop: '15px'}}>© 2022 by CuongNV</a>
                            </div>

                        </MDBCardBody>
                    </MDBCol>

                </MDBRow>
            </MDBCard>

        </MDBContainer>
    )
}
