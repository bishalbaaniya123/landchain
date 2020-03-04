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

import docPressLogoWhite from 'assets/images/docpress_white.png';
import SweetAlert from 'react-bootstrap-sweetalert';
import api from 'ClientSide/routes/Applied/app/api/index';
import {saveAdminToken} from "actions";
import {withRouter} from "react-router-dom";




class SignIn extends React.Component {
    constructor() {
        super();
        this.state = {
            phone: 'demo@example.com',
            password: 'demo#123',
            showLoginError: false,
        }
    }

    componentDidMount() {
        if (this.props.showMessage) {
            setTimeout(() => {
                this.props.hideMessage();
            }, 100);
        }
        if (this.props.authUser !== null) {
            this.props.history.push('/');
        }
        this.props.history.push({
            pathname: "/admin-login"
        })
    }

    adminLogin = () => {
        let body = {
            phone: this.state.phone,
            password: this.state.password,
        };

        api.adminLogin(body)
            .then(result => {
                if(result){
                    this.props.saveAdminToken(result.access_token);
                    this.props.history.push({
                        pathname: "/admin-docpress"
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


/*
        if (this.state.email !== "" && this.state.password !== "") {
            this.props.history.push({
                pathname: "/admin-docpress"
            })
        } else {
            this.setState({
                showLoginError: !this.state.showLoginError,
            })
        }
*/
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

                    <div className="app-logo-content d-flex align-items-center justify-content-center">
                        <Link className="logo-lg" to="/" title="Jambo">
                            <img src={docPressLogoWhite} alt="jambo" title="jambo" style={{maxWidth: "100%"}}/>
                        </Link>
                    </div>

                    <div className="app-login-content">
                        <div className="app-login-header mb-4">
                            <h1>Admin Login</h1>
                        </div>

                        <div className="app-login-form">
                            <form>
                                <div className="form-group mb-3">
                                    <label>Email</label>
                                    <input
                                        placeholder="Email"
                                        onChange={(event) => this.setState({phone: event.target.value})}
                                        // defaultValue={email}
                                        className="form-control form-control-lg"
                                    />
                                </div>

                                <div className="form-group mb-3">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        onChange={(event) => this.setState({password: event.target.value})}
                                        // defaultValue={password}
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

const mapStateToProps = ({auth}) => {
    const {loader, alertMessage, showMessage, authUser} = auth;
    return {loader, alertMessage, showMessage, authUser}
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
