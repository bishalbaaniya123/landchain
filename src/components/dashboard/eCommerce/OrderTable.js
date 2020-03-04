import React, {Component} from 'react';
import OrderTableCell from './OrderTableCell';

import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import api from 'ClientSide/routes/Applied/app/api/index';

import sampleUser from 'assets/images/sampleUser.png';

import {
    Button,
    Card, CardBody, CardHeader,
    Input,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalBody, ModalFooter,
    ModalHeader, Nav, NavItem, NavLink, TabContent, TabPane,
    UncontrolledAlert
} from "reactstrap";
import Moment from "clientSide/components/mail/Compose";
import SweetAlert from 'react-bootstrap-sweetalert';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {NotificationContainer, NotificationManager} from 'react-notifications';


let counter = 0;

function createData(orderId, name, image, orderDate, deliveryDate, status) {
    counter += 1;
    return {id: counter, orderId, name, image, orderDate, deliveryDate, status};
}

class OrderTable extends Component {
    constructor() {
        super();
        this.state = {
            data: [],
            totalItemsCount: 0,
            usersNameList: [],
            current: 1,
            showNoResultsAlert: false,
            editUserModal: false,
            currentEditingUser: {
                created_on: "",
                phone: "",
                id: "",
                id_latest_user_plan: "",
                image_url: "",
                name: "",
                user_roles: [],
                user_type: "",
                made_paid_by_admin: false,
            },
            allPlans: [],
            searchValue: "",
            showDeleteUserAlert: false,
            showUnsubscribeUserAlert: false,
            searchPage: 0,
            isSearching: false
        };
    }


    componentDidMount() {
        let data = [{
            id: 806,
            name: "Bijaya Tuladhar",
            phone: "torchlight.pen@gmail.com",
            image_url: "https://lh5.googleusercontent.com/-i5rg5dsNkOA/AAAAAAAAAAI/AAAAAAAAD4c/6pDsb2mGFKQ/photo.jpg",
            user_roles: [],
            created_on: "2019-01-21",
            user_type: "TRIAL",
            id_latest_user_plan: 2
        }];
        let dataTitles = [];


        api.listAllUsers(0, this.props.adminToken)
            .then(result => {
                this.setState({
                    totalItemsCount: result.totalElements,
                    data: result.content
                })
            });

        /*api.listAllPlans(this.props.adminToken)
            .then(result => {
                this.setState({
                    allPlans: result
                })
            })*/
    }

    onChange = (page) => {
        if (this.state.isSearching === false) {
            api.listAllUsers(page - 1, this.props.adminToken)
                .then(result => {
                    this.setState({
                        totalItemsCount: result.totalElements,
                        data: result.content
                    })
                });
            this.setState({
                current: page,
            });
        } else {
            let searchValue = document.getElementById("search-value").value;
            api.adminSearchUser(this.props.adminToken, searchValue, page - 1, 10)
                .then(result => {
                    this.setState({
                        data: result.content,
                        totalItemsCount: result.totalElements,
                        isSearching: true
                    })
                })
                .catch(err => {
                });
            this.setState({
                current: page,
            });
        }
    };

    editUser = (data) => {
    };

    toggleEditUserModal = (data) => {
        this.setState({
            editUserModal: !this.state.editUserModal,
            currentEditingUser: data
        })
    };

    submitEditUserModal = () => {
    };

    selectPlanType = (e) => {
        let currentValue = e.target.value;
        let array = currentValue.split(/[_]+/);
        let changedUserPlan = array[1];
    };


    deleteUser = () => {
        this.setState({
            showDeleteUserAlert: !this.state.showDeleteUserAlert
        })
    };


    unsubscribeUser = () => {
        this.setState({
            showUnsubscribeUserAlert: !this.state.showUnsubscribeUserAlert
        })
    };

    onConfirmDeleteUser = () => {
        let email = this.state.currentEditingUser.phone;
        this.setState({
            showDeleteUserAlert: false,
            editUserModal: false,
        });
        let currentPage = this.state.current;
        api.deleteUserAdmin(this.props.adminToken, email)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success('Successfully deleted user.', 'Success');
                    api.listAllUsers(0, this.props.adminToken)
                        .then(result => {
                            this.setState({
                                totalItemsCount: result.totalElements,
                                data: result.content,
                            }, () => {
                                this.onChange(currentPage);
                            })
                        });
                } else {
                    NotificationManager.error('Failed to delete user. Please try again.', 'Error');
                }
            })
    };


    onConfirmUnsubscribeUser = () => {
        let currentPage = this.state.current;
        let email = this.state.currentEditingUser.phone;
        this.setState({
            showUnsubscribeUserAlert: !this.state.showUnsubscribeUserAlert,
            editUserModal: !this.state.editUserModal,
        });

        api.unsubscribeUserAdmin(this.props.adminToken, email)
            .then(response => {
                if (response.status === 200) {
                    NotificationManager.success('Successfully unsubscribed user.', 'Success');
                    api.listAllUsers(0, this.props.adminToken)
                        .then(result => {
                            this.setState({
                                totalItemsCount: result.totalElements,
                                data: result.content,
                            }, () => {
                                this.onChange(currentPage);
                            })
                        });
                } else {
                    NotificationManager.error('Failed to delete user. Please try again.', 'Error');
                }
            })
    };

    onCancelDeleteUser = () => {
        this.setState({
            showDeleteUserAlert: !this.state.showDeleteUserAlert
        })
    };


    onCancelUnsubscribeUser = () => {
        this.setState({
            showUnsubscribeUserAlert: !this.state.showUnsubscribeUserAlert
        })
    };

    changeUserType = (e) => {
        let value = e.target.value;
        let body = {
            user_email: this.state.currentEditingUser.phone,
            user_type: value
        };
        let currentPage = this.state.current;
        api.changeUserTypeAdmin(this.props.adminToken, body)
            .then(result => {
                api.listAllUsers(0, this.props.adminToken)
                    .then(result => {
                        NotificationManager.success('Successfully changed', 'Success');
                        this.setState({
                            totalItemsCount: result.totalElements,
                            data: result.content,
                        }, () => {
                            this.onChange(currentPage);
                        })
                    });
            })
    };

    submitSearch = (e) => {
        e.preventDefault();
        let searchValue = document.getElementById("search-value").value;
        api.adminSearchUser(this.props.adminToken, searchValue, this.state.searchPage, 10)
            .then(result => {
                this.setState({
                    data: result.content,
                    totalItemsCount: result.totalElements,
                    isSearching: true,
                    current: 1,
                    showNoResultsAlert: false
                })
            })
            .catch(err => {
                this.setState({
                    showNoResultsAlert: !this.state.showNoResultsAlert
                })
            })
        /*this.setState({
            searchValue: searchValue
        })*/
    };

    clearSearch = () => {
        document.getElementById("search-value").value = "";
        api.listAllUsers(0, this.props.adminToken)
            .then(result => {
                this.setState({
                    totalItemsCount: result.totalElements,
                    data: result.content,
                    current: 1,
                    isSearching: false
                })
            });
    };

    onToggleAlert = () => {
        this.setState({
            showNoResultsAlert: !this.state.showNoResultsAlert
        })
    };

    render() {
        let ButtonMaker = (props) => {
            if (props.stats === "FREE") {
                return <div
                    className={`badge text-uppercase text-white bg-grey`}>
                    Free
                </div>
            } else if (props.stats === "TRIAL") {
                return <div
                    className={`badge text-uppercase bg-purple`}>
                    Trial
                </div>
            } else if (props.stats === "EXPIRED") {
                return <div
                    className={"badge text-uppercase text-white bg-danger"}>
                    Expired
                </div>
            } else if (props.stats === "CANCELED") {
                return <div
                    className={"badge text-uppercase text-white bg-danger"}>
                    Canceled
                </div>
            } else if (props.stats === "PREMIUM") {
                return <div
                    className={`badge text-uppercase bg-amber`} style={{color: "#000"}}>
                    Premium
                </div>
            } else if (props.stats === "PAID") {
                if(props.made_paid_by_admin === true){
                    return <div
                        className={`badge text-uppercase`} style={{color: "#000", backgroundColor: "#ff9800"}}>
                        Paid<span className="made-by-admin">(Admin)</span>
                    </div>
                }
                return <div
                    className={`badge text-uppercase bg-amber`} style={{color: "#000"}}>
                    Paid
                </div>
            } else {
                return <div/>
            }
        };
        return (
            <div>
                <div className={"jr-card"}>
                    <div className={`search-bar right-side-icon bg-transparent`}>
                        <form onSubmit={this.submitSearch}>
                            <InputGroup>
                                <Input name="searchValue"
                                       id="search-value" className="search-main-page"
                                       placeholder="Search Users..."
                                       autoComplete="off"
                                       defaultValue=""
                                />
                                <InputGroupAddon addonType="append">
                                    <Button color="info" id="search-button-main">
                                        <i className="zmdi zmdi-search zmdi-hc-lg"/>
                                        Search
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </form>
                        <div style={{display: this.state.isSearching ? "block" : "none"}}>
                            <Button
                                style={{float: "right", marginTop: "10px"}}
                                onClick={this.clearSearch}
                            >
                                Clear
                            </Button>
                        </div>

                    </div>
                </div>

                <p style={{opacity: 0, height: 0}}>
                    a
                </p>
                <br/>


                <UncontrolledAlert
                    className="bg-dark border-dark text-white no-docs-alert"
                    toggle={this.onToggleAlert}
                    isOpen={this.state.showNoResultsAlert}
                >
                    No User found
                </UncontrolledAlert>


                <div className="table-responsive-material">
                    <table className="default-table table-unbordered table table-sm table-hover">
                        <thead className="th-border-b">
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th className="status-cell">User Type</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.data.map(data => {
                            return (
                                <tr
                                    tabIndex={-1}
                                    key={data.id}
                                >
                                    {/*<td>{data.orderId}</td>*/}
                                    <td>
                                        <div className="user-profile d-flex flex-row align-items-center">
                                            {data.image_url ?
                                                <img
                                                    alt={data.name}
                                                    src={data.image_url}
                                                    className="user-avatar rounded-circle mr-3"
                                                />
                                                :
                                                <img
                                                    alt={data.name}
                                                    src={sampleUser}
                                                    className="user-avatar rounded-circle mr-3"
                                                />
                                            }
                                            <div className="user-detail">
                                                <h5 className="user-name">{data.name} </h5>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{data.phone}</td>
                                    {/*<td>{data.deliveryDate}</td>*/}
                                    <td className="status-cell">
                                        <ButtonMaker stats={data.user_type} made_paid_by_admin={data.made_paid_by_admin}/>
                                    </td>
                                    <td>
                                        <Button color="primary" onClick={() => this.toggleEditUserModal(data)}>
                                            <i className="zmdi zmdi-edit"/>&nbsp;
                                            Edit
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}

                        {/*<OrderTableCell key={data.id} data={data}/>*/}

                        </tbody>
                    </table>

                    <div>
                        <Pagination
                            onChange={this.onChange}
                            current={this.state.current}
                            total={this.state.totalItemsCount}
                            showTitle={false}
                            hideOnSinglePage={true}
                        />
                    </div>
                </div>


                <Modal isOpen={this.state.editUserModal} toggle={this.toggleEditUserModal}>
                    <ModalHeader>Edit User</ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.submitEditUserModal}>
                            <div className="form-group">
                                <div className="col-md-12 col-12 mt-4">
                                    <p>
                                        {this.state.currentEditingUser.image_url ?
                                            <img src={this.state.currentEditingUser.image_url}
                                                 className="edit-user-image"/>
                                            :
                                            <img src={sampleUser} className="edit-user-image"/>
                                        }
                                        {this.state.currentEditingUser.name}
                                        {this.state.currentEditingUser.made_paid_by_admin === true ?
                                            <span className="made-paid-by-admin-span">(Made paid by admin)</span>
                                            :
                                            ""
                                        }
                                    </p>
                                </div>
                            </div>


                            <div className="form-group">
                                <div className="col-md-12 col-12 mt-4">
                                    <label className="mb-2">Email</label>
                                    <input type="text" className="form-control" id="edit_user_email"
                                           placeholder="User Email" required={true}
                                           defaultValue={this.state.currentEditingUser.phone}
                                           disabled
                                    />
                                </div>
                            </div>


                            <div className="form-group">
                                <div className="col-md-12 col-12 mt-4">
                                    <label htmlFor="select-plan-type">Select Plan Type</label>
                                    <select className="custom-select mt-3" id="select-plan-type"
                                            onChange={(value) => this.changeUserType(value)}
                                            defaultValue={this.state.currentEditingUser.user_type}
                                    >
                                        <option disabled value="">Select Plan Type</option>
                                        <option value="FREE">Free</option>
                                        <option value="PAID">Paid</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                        <div className="form-group">
                            <div className="col-md-12 col-12 mt-4">
                                {this.state.currentEditingUser.made_paid_by_admin === false ?
                                    this.state.currentEditingUser.user_type === "PAID" || this.state.currentEditingUser.user_type === "TRIAL"
                                            ?
                                            <Button color="secondary" onClick={this.unsubscribeUser}>Unsubscribe User</Button>
                                            :
                                            ""
                                    :
                                    ""
                                }

                                {' '}
                                <Button color="danger" onClick={this.deleteUser}>Delete User</Button>{' '}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleEditUserModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <SweetAlert show={this.state.showDeleteUserAlert}
                            error
                            showCancel
                            confirmBtnText="Delete"
                            confirmBtnBsStyle="danger"
                            title={<p className="sweet-alert-title">Are you sure?</p>}
                            onConfirm={this.onConfirmDeleteUser}
                            onCancel={this.onCancelDeleteUser}
                >
                    {this.state.currentEditingUser.name} will be deleted
                </SweetAlert>

                <SweetAlert show={this.state.showUnsubscribeUserAlert}
                            error
                            showCancel
                            confirmBtnText="Unsubscribe"
                            confirmBtnBsStyle="danger"
                            title={<p className="sweet-alert-title">Are you sure?</p>}
                            onConfirm={this.onConfirmUnsubscribeUser}
                            onCancel={this.onCancelUnsubscribeUser}
                >
                    {this.state.currentEditingUser.name} will be unsubscribed
                </SweetAlert>

                <NotificationContainer/>

            </div>
        );
    }
}


const mapStateToProps = (state) => {
    const {drawerType, navigationStyle, horizontalNavPosition} = state.settings;
    if (state.selfReducers) {
        if (state.selfReducers.adminToken) {
            return {
                adminToken: state.selfReducers.adminToken,
                drawerType, navigationStyle, horizontalNavPosition
            }
        } else {
            return {drawerType, navigationStyle, horizontalNavPosition}
        }
    } else {
        return {drawerType, navigationStyle, horizontalNavPosition}
    }
};
export default withRouter(connect(mapStateToProps)(OrderTable));
