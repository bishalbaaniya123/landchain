import React from 'react';
import '../../../../assets/css/self_css.css';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import api from '../app/api/index';
import {Redirect, withRouter} from "react-router-dom";
import {saveDetailsOfMe, saveServerToken} from '../../../../actions/SelfActions'

import ClipLoader from 'react-spinners/ClipLoader';


// import {authAction} from "../redux-stuffs/actions/auth_action";


class RedirectGoogleComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        let results = regex.exec(this.props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    render() {
        const token = this.getUrlParameter('token');
        const error = this.getUrlParameter('error');

        let currentHref = window.location.href;
        let splitWithEquals = currentHref.split("=");
        let googleToken = splitWithEquals[1].split("#")[0];
        // googleToken = "ey";

        if (googleToken.substring(0, 2) === "ey") {
            localStorage.setItem('accessToken', googleToken);
            this.props.saveServerToken(googleToken);
            api.getUserInfoAfterLogin(googleToken)
                .then(result => {
                    // window.location.href = "/documents";
                    this.props.saveDetailsOfMe(result);
                    if (result.user_type === "NONE") {
                        this.props.history.push({
                            pathname: "/new-user"
                        })
                    } else {
                        this.props.history.push({
                            pathname: "/documents"
                        })
                    }
                    /*this.props.history.push({
                        pathname: "/documents"
                    })*/

                    /*
                                        setInterval(function () {
                                            return (
                                                <Redirect to={'/client/documents'}/>
                                            )
                                        }, 3000);
                    */

                    /*setInterval(this.props.history.push({
                        pathname: "/client/documents"
                    }), 3000);*/


                    /*.then(() => {
                    })
                    .catch(e => {
                    })*/

                    /*this.props.saveToken(result)
                        .then(() => {
                            this.props.history.push({
                                pathname: "/documents"
                            });
                        });*/
                });
            return <div className="row redirect-page-main-div">

                <div className="loading-icon" style={{textAlign: "center"}}>
                    <ClipLoader
                        sizeUnit={"px"}
                        size={50}
                        color={'#7095e0'}
                        loading={true}
                    />
                </div>

                {/*Redirecting......*/}
            </div>
        } else {
            return <div>
                There is no googleToken
            </div>
        }

        /*if (token) {
            // localStorage.setItem('accessToken', token);
            /!*api.getUserInfoAfterLogin(token)
                .then(result => {
                    this.props.saveToken(result)
                        .then(() => {
                            this.props.history.push({
                                pathname: "/documents"
                            });
                        });
                });*!/
            return <div>
                <h1>Redirecting......</h1>
            </div>;

        } else {
            // window.location.href = "http://docpress.io";
            return (<div>
                <h1>Error while logging in</h1>
                <p>Please try again</p>
                <p>{error}</p>
            </div>);
        }*/
    }
}

/*
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        saveToken: authAction
    }, dispatch)
};
const mapStateToProps = (state) => {
    return {};
};
*/

/*
const smartRedirectGoogleComponent = connect(mapStateToProps, mapDispatchToProps)(RedirectGoogleComponent);
export default smartRedirectGoogleComponent;
*/


/*const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        saveDetailsOfMe: saveDetailsOfMe
    }, dispatch)
};*/

const mapDispatchToProps = {
    saveDetailsOfMe: saveDetailsOfMe,
    saveServerToken: saveServerToken,
};

const mapStateToProps = (state) => {
    return {}
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RedirectGoogleComponent));