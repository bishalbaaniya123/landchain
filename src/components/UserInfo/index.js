import React from 'react';
// import IntlMessages from 'util/IntlMessages';
import sampleUser from "assets/images/sampleUser.png";
import $ from 'jquery';
import {NavLink, withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {logout, saveDetailsOfMe, saveServerToken, switchLanguage, toggleCollapsedNav} from "actions";

class UserInfo extends React.Component {
    constructor() {
        super();
        this.state = {
            imageUrl: sampleUser,
            userName: "",
            userType: "",
            isFreeTrial: "",
        }
    }

    componentDidMount() {
        $("#settings-button-top").click(function () {
            $("#settings-tab").click();
        });

        this.setState({
            imageUrl: this.props.imageUrl,
            userName: this.props.userName,
            userType: this.props.userType,
            isFreeTrial: this.props.isFreeTrial,
        }, () => {
            if (this.state.userType === "NONE") {
                this.props.history.push({
                    pathname: "/new-user"
                });
            } else if (this.state.userType === "FREE" && this.state.isFreeTrial === false) {
                this.props.history.push({
                    pathname: "/new-user"
                });
            }
        });

    }

    logout = () => {
        this.props.logout();
        window.location.href = "https://docpress.io"
    };

    render() {
        return (
            <div>
                <div className="user-profile">
                    <img className="user-avatar border-0 size-40" src={this.state.imageUrl}
                         alt="User"/>
                    <div className="user-detail ml-2">
                        <h4 className="user-name mb-0">{this.state.userName}</h4>
                        <small>
                            {this.state.userType.charAt(0).toUpperCase() + this.state.userType.slice(1).toLowerCase()}
                            &nbsp;User
                        </small>
                    </div>
                </div>
                {this.state.userType !== "FREE" ?
                    <NavLink to="/settings" className="dropdown-item text-muted" id="settings-button-top">
                        <i className="zmdi zmdi-settings zmdi-hc-fw mr-1"/>
                        Settings
                    </NavLink>
                    :
                    null
                }
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
};


const mapStateToProps = (state) => {
    if (!state.selfReducers) {
        window.location.href = "https://docpress.io"
    } else if (state.selfReducers.profile === "") {
        window.location.href = "https://docpress.io"
    }
    try {
        return {
            userName: state.selfReducers.profile.name,
            imageUrl: state.selfReducers.profile.image_url,
            userType: state.selfReducers.profile.user_type,
            isFreeTrial: state.isFreeTrial
        };

    } catch (e) {
        window.location.href = "https://docpress.io"
    }

};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserInfo));
// export default UserInfo;


