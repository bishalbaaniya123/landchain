import React from "react";
import '../../../../../../assets/css/self_css.css';
import {render} from "react-dom";
import {makeData} from "../Utils";
import matchSorter from 'match-sorter';
import {
    Button, Modal, ModalHeader, ModalBody, ModalFooter,
    Card, CardBody, CardHeader, Nav, NavItem, NavLink, TabContent, TabPane
} from 'reactstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

import PropTypes from 'prop-types';


import ReactTable from "react-table";
import "react-table/react-table.css";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";

import api from 'ClientSide/routes/Applied/app/api/index';

import isUrl from 'is-url';
import ClipLoader from 'react-spinners/ClipLoader';

import 'react-notifications/lib/notifications.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';


function TabContainer(props) {
    return (
        <div style={{padding: 20}}>
            {props.children}
        </div>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};


class CustomFilter extends React.Component {
    constructor() {
        super();
        this.state = {
            data: [],
            isFilterable: false,
            modal: false,
            activeTab: '1',
            doc: {
                id: "",
                alternate_link: "",
                thumbnail_link: "",
                title: "",
                owner_name: "",
                owner_email: "",
                owner_picture: "",
                last_modifying_user_name: "",
                last_modifying_user_picture: "",
                last_modifying_user_email: ""
            },
            addUrlModal: false,
            editUrlModal: false,
            editWordpressUsername: "",
            editWordpressUrl: "",
            editWordpressId: "",
            showDeleteAlert: false,
            showDeletedSuccessAlert: false,
            currentDeletionItem: "",
            currentDeletionItemId: "",
            showSuccessfulAddUrlAlert: false,
            showAlreadyAddedUrl: false,
            isPlatformSelected: true,
            isUsernameSelected: false,
            isValidUrlSelected: false,
            isPasswordSelected: false,
            showAddUrlError: false,
            loading: true,
            showTable: false,
            showSuccessfulEditUrlAlert: false,
            showEditUrlError: false,
        };

    }

    componentDidMount() {
        api.getLinkedAccounts(this.props.token)
            .then(result => {
                this.setState({
                    data: result,
                    loading: false,
                    showTable: true,
                })
            })

    }

    filterTable = (filter, row) => {
        return row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) >= 0
    };

    toggleFilter = () => {
        this.setState({
            isFilterable: !this.state.isFilterable
        })
    };

    toggleModal = (currentItem) => {
        this.setState({
            modal: !this.state.modal,
            doc: currentItem
        });
    };


    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };

    toggleAddUrlModal = () => {
        this.setState({
            addUrlModal: !this.state.addUrlModal,
            isPlatformSelected: false,
            isUsernameSelected: false,
            isValidUrlSelected: false,
            isPasswordSelected: false,
        });
    };


    toggleEditUrlModal = (tableProps) => {
        this.setState({
            editUrlModal: !this.state.editUrlModal,
            editWordpressUsername: tableProps.word_press_account_name,
            editWordpressUrl: tableProps.word_press_url,
            editWordpressId: tableProps.id_word_press_account
        });
    };

    submitAddUrlModal = (e) => {
        e.preventDefault();
        // let platform = document.getElementById("select-platform").value;

        let username = document.getElementById("add-username").value;

        let url = document.getElementById("add-url-form").value;


        let password = document.getElementById("add-password").value;

        if (username === "") {
            $("#add-username").addClass("is-invalid")
        }
        if (password === "") {
            $("#add-password").addClass("is-invalid")
        }
        /*if (platform === "") {
            $("#select-platform").addClass("is-invalid")
        }*/


        if (isUrl(url)) {
            $("#add-url-form").removeClass("is-invalid");
            $(".invalid-feedback-add-url").css("opacity", "0");
            this.setState({
                isValidUrlSelected: true
            });

            if (username !== "" && password !== "") {
                let body = {
                    word_press_url: url,
                    word_press_account_name: username,
                    word_press_account_password: password,
                };


                api.getAddWordpressAccount(body, this.props.token)
                    .then(result => {
                        if (result.status === 208) {
                            this.setState({
                                showAlreadyAddedUrl: !this.state.showAlreadyAddedUrl
                            });
                        } else if (result.status === 200) {
                            api.getLinkedAccounts(this.props.token)
                                .then(respose => {
                                    this.setState({
                                        data: respose,
                                        addUrlModal: !this.state.addUrlModal,
                                        showSuccessfulAddUrlAlert: !this.state.showSuccessfulAddUrlAlert
                                    })
                                });
                        } else {
                            this.setState({
                                showAddUrlError: !this.state.showAddUrlError,
                            })
                        }
                    });
            }
        } else {
            $("#add-url-form").addClass("is-invalid");
            $(".invalid-feedback-add-url").css("opacity", "1");
            this.setState({
                isValidUrlSelected: false
            })
        }
    };

    submitEditUrlModal = (e) => {
        e.preventDefault();
        let username = document.getElementById("edit_wordpress_username").value;
        let url = document.getElementById("edit_wordpress_url").value;
        let password = document.getElementById("edit_wordpress_password").value;
        let id = this.state.editWordpressId;


        if (isUrl(url)) {
            let finalBody = {
                word_press_url: url,
                word_press_account_name: username,
                word_press_account_password: password,
                id: id,
            };
            api.updateWordpressAccount(finalBody, this.props.token)
                .then(result => {
                    if (result.status === 208) {
                        this.setState({
                            showAlreadyAddedUrl: !this.state.showAlreadyAddedUrl
                        });
                    } else if (result.status === 200) {
                        // NotificationManager.success('Url has been edited successfully', 'Success', 3000);
                        this.setState({
                            showSuccessfulEditUrlAlert: !this.state.showSuccessfulEditUrlAlert
                        });
                        api.getLinkedAccounts(this.props.token)
                            .then(response => {
                                this.setState({
                                    data: response
                                })
                            })
                    } else {
                        this.setState({
                            showEditUrlError: !this.state.showEditUrlError
                        });

                        // NotificationManager.error('Invalid Credentials. Please Try again', 'Error');
                    }
                });
            this.setState({
                editUrlModal: !this.state.editUrlModal
            });
        }
    };


    deleteUrl = () => {
        api.deleteWordpressAccount(this.state.currentDeletionItemId, this.props.token)
            .then(result => {
                api.getLinkedAccounts(this.props.token)
                    .then(response => {
                        this.setState({
                            data: response,
                            showDeleteAlert: false,
                            showDeletedSuccessAlert: true
                        })
                    });
            })
    };

    showDeleteSweetAlert = (tableProps) => {
        this.setState({
            showDeleteAlert: true,
            currentDeletionItem: tableProps.word_press_url,
            currentDeletionItemId: tableProps.id_word_press_account,
        })
    };


    cancelDeleteUrl = () => {
        this.setState({
            showDeleteAlert: false
        })
    };

    onCloseSuccessfulDeletion = () => {
        this.setState({
            showDeletedSuccessAlert: false
        })
    };

    onCloseSuccessfulAddUrlAlert = () => {
        this.setState({
            showSuccessfulAddUrlAlert: !this.state.showSuccessfulAddUrlAlert
        })
    };

    onCloseAlreadyAddedUrl = () => {
        this.setState({
            showAlreadyAddedUrl: !this.state.showAlreadyAddedUrl
        })
    };

    checkUrlValidity = (e) => {
        let value = e.target.value;
        if (isUrl(value)) {
            $("#add-url-form").removeClass("is-invalid");
            $(".invalid-feedback-add-url").css("opacity", "0");
            this.setState({
                isValidUrlSelected: true
            })
        } else {
            $("#add-url-form").addClass("is-invalid");
            $(".invalid-feedback-add-url").css("opacity", "1");
            this.setState({
                isValidUrlSelected: false
            })
        }
    };

    checkIfUrlExists = (e) => {
        if (e.target.value !== "") {
            $("#add-url-form").removeClass("is-invalid");
            $(".invalid-feedback-add-url").css("opacity", "0");
        }
    };

    selectPlatform = (e) => {
        $("#select-platform").removeClass("is-invalid");
        this.setState({
            isPlatformSelected: true
        })
    };


    checkUsername = (e) => {
        if (e.target.value !== "") {
            $("#add-username").removeClass("is-invalid");
            this.setState({
                isUsernameSelected: true
            })
        }
    };


    checkPassword = (e) => {
        if (e.target.value !== "") {
            $("#add-password").removeClass("is-invalid")
            this.setState({
                isPasswordSelected: true
            })
        }
    };

    cancelAddUrlError = () => {
        this.setState({
            showAddUrlError: !this.state.showAddUrlError
        })
    };

    onCloseSuccessfulEditUrlAlert = () => {
        this.setState({
            showSuccessfulEditUrlAlert: !this.state.showSuccessfulEditUrlAlert,
        })
    };

    cancelEditUrlError = () => {
        this.setState({
            showEditUrlError: !this.state.showEditUrlError,
        })
    };


    render() {
        return (
            <div>
                <Button color="primary" className="toggle-filter" onClick={this.toggleAddUrlModal}>
                    <i className="zmdi zmdi-plus-circle-o"/> Add URL
                </Button>


                <div className="loading-icon" style={{textAlign: "center"}}>
                    <ClipLoader
                        sizeUnit={"px"}
                        size={50}
                        color={'#7095e0'}
                        loading={this.state.loading}
                    />
                </div>


                <ReactTable
                    noDataText='No URLs Found'
                    resizable={false}
                    data={this.state.data}
                    sortable={false}
                    filterable={this.state.isFilterable}
                    filterAll={false}
                    style={{display: this.state.showTable ? "block" : "none"}}
                    defaultFilterMethod={(filter, row) =>
                        this.filterTable(filter, row)}
                    columns={[
                        {
                            Header: "URL",
                            accessor: "word_press_url",
                            Cell: props => {
                                return (
                                    <a href={props.original.word_press_url} target="_blank">
                                        {props.original.word_press_url}
                                    </a>
                                )
                            }
                        },
                        {
                            Header: "Username",
                            accessor: "word_press_account_name",
                            Cell: props => {
                                return (
                                    <p>
                                        {props.original.word_press_account_name}
                                    </p>
                                )
                            }
                        },
                        {
                            Header: "Actions",
                            Cell: props => {
                                return (
                                    <div style={{marginTop: "-15px"}}>
                                        <Button
                                            onClick={() => this.toggleEditUrlModal(props.original)}
                                            className="action-buttons" color="primary">
                                            <i className="zmdi zmdi-edit"/>
                                            Edit
                                        </Button>
                                        <Button className="action-buttons" color="danger"
                                                onClick={() => this.showDeleteSweetAlert(props.original)}
                                                style={{marginTop: "10px", marginBottom: "10px"}}
                                        >
                                            <i className="zmdi zmdi-delete"/>
                                            Delete
                                        </Button>
                                    </div>
                                )
                            }
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />


                <Modal isOpen={this.state.addUrlModal} toggle={this.toggleAddUrlModal}>
                    <ModalHeader>Add URL</ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.submitAddUrlModal} autoComplete="off">

                            <CardBody>
                                <div>

                                    <div className="form-group">
                                        {/*<div className="col-md-12 col-12 mt-4">
                                            <label htmlFor="select-platform">Select Platform</label>
                                            <select className="custom-select mt-3" id="select-platform"
                                                    onChange={(value) => this.selectPlatform(value)}
                                                    defaultValue=""
                                            >
                                                <option disabled value="">Select Platform</option>
                                                <option value="WordPress">WordPress</option>
                                                <option value="Joomla">Joomla</option>
                                                <option value="Drupal">Drupal</option>
                                            </select>
                                        </div>*/}

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="add-url-form">Website</label>
                                                <input type="text" className="form-control" id="add-url-form"
                                                       placeholder="Enter Url" autoComplete="false"
                                                       onChange={(event) => this.checkIfUrlExists(event)}
                                                       onBlur={(event) => this.checkUrlValidity(event)}
                                                    // disabled={!this.state.isUsernameSelected}
                                                />
                                                <div className="invalid-feedback invalid-feedback-add-url"
                                                     style={{opacity: "0"}}
                                                >
                                                    Please enter a valid url.
                                                </div>
                                                <div className=""
                                                     style={{color: "#6480b7", marginTop: "5px", fontSize: "10px"}}>
                                                    Add full URL including http or https.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="add-username">Username</label>
                                                <input type="text" className="form-control" id="add-username"
                                                       placeholder="Enter Username" autoComplete="false"
                                                    // disabled={!this.state.isPlatformSelected}
                                                       onChange={(event) => this.checkUsername(event)}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="add-password">Password</label>
                                                <input type="password" className="form-control" id="add-password"
                                                       placeholder="Enter Password" autoComplete="false"
                                                    // disabled={!this.state.isValidUrlSelected}
                                                       onChange={(event) => this.checkPassword(event)}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </CardBody>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitAddUrlModal}>Submit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleAddUrlModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <Modal isOpen={this.state.editUrlModal} toggle={this.toggleEditUrlModal}>
                    <ModalHeader>Edit URL</ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.submitEditUrlModal}>
                            <div className="form-group mt-2">
                                <label className="mb-2">Website</label>
                                <input type="text" className="form-control" id="edit_wordpress_url"
                                       placeholder="Enter Url" required={true}
                                       defaultValue={this.state.editWordpressUrl}
                                />
                            </div>
                            <div className="form-group mt-2">
                                <label className="mb-2">Username</label>
                                <input type="text" className="form-control" id="edit_wordpress_username"
                                       placeholder="Enter Username" required={true}
                                       defaultValue={this.state.editWordpressUsername}
                                />
                            </div>
                            <div className="form-group mt-2">
                                <label className="mb-2">Password</label>
                                <input type="password" className="form-control" id="edit_wordpress_password"
                                       placeholder="Enter Password" required={true}/>
                            </div>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitEditUrlModal}>Submit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditUrlModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                <SweetAlert show={this.state.showAddUrlError}
                            error
                            title={<p className="sweet-alert-title">Authentication Error</p>}
                            onConfirm={this.cancelAddUrlError}
                >
                    Please check your credentials and try again
                </SweetAlert>


                <SweetAlert show={this.state.showDeleteAlert}
                            warning
                            showCancel
                            confirmBtnText="Delete"
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                            title={<p className="sweet-alert-title">{this.state.currentDeletionItem}</p>}
                            onConfirm={this.deleteUrl}
                            onCancel={this.cancelDeleteUrl}
                >
                    Will Be Removed from the list
                </SweetAlert>

                <SweetAlert show={this.state.showSuccessfulAddUrlAlert} success
                            title={<p className="sweet-alert-title"/>}
                            onConfirm={this.onCloseSuccessfulAddUrlAlert}>
                    Successfully added
                </SweetAlert>

                <SweetAlert show={this.state.showAlreadyAddedUrl} warning
                            title={<p className="sweet-alert-title"/>}
                            onConfirm={this.onCloseAlreadyAddedUrl}>
                    Url has already been added!
                </SweetAlert>


                <SweetAlert show={this.state.showSuccessfulEditUrlAlert} success
                            title={<p className="sweet-alert-title"/>}
                            onConfirm={this.onCloseSuccessfulEditUrlAlert}>
                    Successfully Edited
                </SweetAlert>

                <SweetAlert show={this.state.showEditUrlError}
                            error
                            title={<p className="sweet-alert-title">Authentication Error</p>}
                            onConfirm={this.cancelEditUrlError}
                >
                    Please check your credentials and try again
                </SweetAlert>


                <SweetAlert show={this.state.showDeletedSuccessAlert} success
                            title={<p className="sweet-alert-title">{this.state.currentDeletionItem}</p>}
                            onConfirm={this.onCloseSuccessfulDeletion}>
                    Has Been Deleted
                </SweetAlert>

                <NotificationContainer/>

            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return ({
        allUserInfo: state.selfReducers.profile,
        token: state.selfReducers.serverToken
    })
};


export default withRouter(connect(mapStateToProps)(CustomFilter));
// export default DocumentsTable;
