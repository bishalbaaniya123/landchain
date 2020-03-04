import 'assets/css/LandChain/Landchain.css';
import React from 'react';
import {Button} from 'reactstrap';
import {Link} from 'react-router-dom'
import {connect} from 'react-redux';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import IntlMessages from 'util/IntlMessages';
import {
    hideMessage,
    showAuthLoader,
    userFacebookSignIn,
    userGithubSignIn,
    userGoogleSignIn,
    userSignIn,
    userTwitterSignIn
} from 'actions/Auth';
import CircularProgress from 'components/CircularProgress';

import logoMain from 'assets/images/Landchain/LogoMain.png';
import SweetAlert from 'react-bootstrap-sweetalert';
import api from 'LandChain/api/index';
import {saveAdminToken} from "actions";
import {withRouter} from "react-router-dom";
import $ from 'jquery';


class SignIn extends React.Component {
    constructor() {
        super();
        this.state = {
            phone: '9849578042',
            password: 'pass1234',
            showLoginError: false,
            adminToken: ""
        }
    }

    componentDidMount() {
        document.title="LandChain - Login";
        if (this.props.showMessage) {
            setTimeout(() => {
                this.props.hideMessage();
            }, 100);
        }
        /*if (this.props.authUser !== null) {
            this.props.history.push('/');
        }
        this.props.history.push({
            pathname: "/admin-login"
        })*/
        let thisState = this;

        $(document).keyup(function(event) {
            if ($(".form-control").is(":focus") && event.key === "Enter") {
                // Do work
                thisState.adminLogin();
            }
        });

        if(this.props.adminToken){
            this.setState({
                adminToken: this.props.adminToken
            }, () => {
                let parsedJwt = this.parseJwt(this.state.adminToken);
                let expiryTime = parsedJwt.exp;
                if(expiryTime > (Date.now())/1000){
                    this.props.history.push({
                        pathname: "/users"
                    });
                } else {
                }
            })
        } else {
        }
    }

    parseJwt = (token) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    };

    adminLogin = () => {

        let body = {
            mob_no: this.state.phone,
            password: this.state.password,
        };
        // todo
        api.login(body)
            .then(result => {
                if (result.access_token) {
                    this.props.saveAdminToken(result.access_token)
                        .then(() => {
                            this.props.history.push({
                                pathname: "/users"
                            });
                        });
                } else {
                    this.setState({
                        showLoginError: !this.state.showLoginError,
                    })
                }
            })
            .catch(err => {
                this.setState({
                    showLoginError: !this.state.showLoginError,
                })
            });
        //end todo
    };

    cancelLoginError = () => {
        this.setState({
            showLoginError: !this.state.showLoginError,
        });
    };

    render() {
        const {
            phone,
            password
        } = this.state;
        const {showMessage, loader, alertMessage} = this.props;
        return (
            <div
                className="app-login-container d-flex justify-content-center align-items-center animated slideInUpTiny animation-duration-3">
                <div className="app-login-main-content">

                    <div
                        className="app-logo-content d-flex align-items-center justify-content-center landchain-login-logo">
                        <Link className="logo-lg" to="/" title="Jambo">
                            <img src={logoMain} alt="jambo" title="jambo" style={{maxWidth: "100%"}}/>
                        </Link>
                    </div>

                    <div className="app-login-content">
                        <div className="app-login-header mb-4">
                            <h1>Admin Login</h1>
                        </div>

                        <div className="app-login-form">
                            <form onSubmit={() => this.adminLogin()}>
                                <div className="form-group mb-3">
                                    <label>Phone Number</label>
                                    <input
                                        placeholder="Phone Number"
                                        type="tel"
                                        onChange={(event) => {
                                            if (event.keyCode === 13) {
                                                this.adminLogin();
                                            } else {
                                                this.setState({phone: event.target.value})
                                            }
                                        }
                                        }
                                        defaultValue={"9849578042"}
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        onChange={(event) => {
                                            if (event.keyCode === 13) {
                                                this.adminLogin();
                                            } else {
                                                this.setState({password: event.target.value})
                                            }
                                        }}
                                        defaultValue={"pass1234"}
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="mb-3 d-flex align-items-center justify-content-between">
                                    <Button onClick={() => {
                                        this.adminLogin();
                                        // this.props.showAuthLoader ();
                                        // this.props.userSignIn ({ email, password });
                                    }} color="primary" className="text-uppercase">
                                        Sign In
                                    </Button>
                                </div>

                            </form>
                        </div>
                    </div>

                </div>
                {
                    loader &&
                    <div className="loader-view">
                        <CircularProgress/>
                    </div>
                }
                {showMessage && NotificationManager.error(alertMessage)}
                <NotificationContainer/>

                <SweetAlert show={this.state.showLoginError}
                            error
                            title={<p className="sweet-alert-title">Invalid Credentials</p>}
                            onConfirm={this.cancelLoginError}
                >
                    Please Try Again
                </SweetAlert>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    const {loader, alertMessage, showMessage, authUser} = state.auth;
    if(state.selfReducers){
        return {adminToken: state.selfReducers.adminToken, loader, alertMessage, showMessage, authUser}
    } else {
        return {adminToken: null, loader, alertMessage, showMessage, authUser}
    }
};

export default withRouter(connect(mapStateToProps, {
    userSignIn,
    hideMessage,
    showAuthLoader,
    userFacebookSignIn,
    userGoogleSignIn,
    userGithubSignIn,
    userTwitterSignIn,
    saveAdminToken
})(SignIn));
