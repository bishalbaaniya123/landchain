import React from 'react';
// import IntlMessages from 'util/IntlMessages';
import sampleUser from "assets/images/sampleUser.png";
import $ from 'jquery';
import {NavLink, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {adminLogout, logout, saveDetailsOfMe, saveServerToken, switchLanguage, toggleCollapsedNav} from "actions";

class UserInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            imageUrl: sampleUser,
            userName: "",
            userType: "",
        }
    }

    componentDidMount() {
        $("#settings-button-top").click(function () {
            $("#settings-tab").click();
        });


        /*if(this.props.adminToken === null || this.props.adminToken === undefined){
            this.props.history.push("/admin-login")
        }*/

        this.setState({
            imageUrl: this.props.imageUrl,
            userName: this.props.userName,
            userType: this.props.userType,
        })
    }

    logout = () => {
        this.props.adminLogout();
        window.location.href = "/landchain-login"
    };

    render() {
        return (
            <div>
                <div className="user-profile">
                    <img className="user-avatar border-0 size-40" src={sampleUser}
                         alt="User"/>
                    <div className="user-detail ml-2">
                        <h4 className="user-name mb-0">Admin</h4>
                        {/*<small>
                            Admin
                        </small>*/}
                    </div>
                </div>

                {/*<a className="dropdown-item text-muted" href="https://docpress.io/">*/}
                <a className="dropdown-item text-muted" href="javascript:;" onClick={this.logout}>
                    <i className="zmdi zmdi-sign-in zmdi-hc-fw mr-1"/>
                    Logout
                </a>
            </div>
        );
    }
}

const mapDispatchToProps = {
    logout: logout,
    adminLogout: adminLogout
};


const mapStateToProps = (state) => {
    if(state.selfReducers){
        if(state.selfReducers.adminToken){
            return{
                adminToken: state.selfReducers.adminToken
            };
        }
    }
    return {};

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfo));
// export default UserInfo;


