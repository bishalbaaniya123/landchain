import React from "react";
import 'react-toastify/dist/ReactToastify.css';
import '../../../../assets/css/self_css.css';
// import {makeData} from "../Utils";
import {ToastContainer, toast} from 'react-toastify';

import {
    Button,
    CardBody,
    Input,
    InputGroup, InputGroupAddon,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    UncontrolledAlert
} from 'reactstrap';
import Moment from 'react-moment';

import api from 'LandChain/api/index';


import PropTypes from 'prop-types';


import ReactTable from "react-table";
import "react-table/react-table.css";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ClipLoader from 'react-spinners/ClipLoader';
import $ from "jquery";

import SweetAlert from 'react-bootstrap-sweetalert';
import {adminLogout, logout, saveLandLocation, saveLandUuid} from "actions";
import citizenshipFront from '../../../../assets/images/Landchain/citizenship-front.jpg';
import citizenshipBack from '../../../../assets/images/Landchain/citizenship-back.jpg';
import lalPurja from '../../../../assets/images/Landchain/lal-purja.jpg';
import passportPhoto from '../../../../assets/images/Landchain/passport-photo.png';
import {ToastMessage} from "react-toastr";


Moment.startPooledTimer(10000);


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


class UserDetails extends React.Component {
    constructor() {
        super();
        this.state = {
            isFilterable: false,
            modal: false,
            activeTab: '1',
            currentEditItem: {
                id_plan_type: "",
                plan_access_time: "",
                plan_cms_domain: "",
                plan_price: "",
                plan_time_enum: "",
                plan_type: ""
            },
            usersList: [],
            usersNameList: [],
            showNoResultsAlert: false,
            searchItems: [],
            isSearching: false,
            dataPlans: [],
            showTable: false,
            loading: true,
            addPlanModal: false,
            userDetailsModal: false,
            isAddButtonDisabled: true,
            isPlanTypeSelected: false,
            isPlanTimeSelected: false,
            isPlanNumberSelected: true,
            isPlanPriceSelected: true,
            isActiveSelected: false,
            currentTime: "",
            showSuccessfulAddition: false,
            showErrorAddition: false,
            showSuccessfulEdit: false,
            editPlanModal: false,
            isPlanNameFilled: true,
            isTrialTimeFilled: true,
            isTrialPriceFilled: true,
            isMonthlyPriceFilled: true,
            isDescriptionFilled: true,
            landDetailsArray: [{
                land_uuid: "d4965d9d-3a59-4a1a-b7f5-431b50d6cbb5",
                land_location: {
                    state: 3,
                    municipality: "Koteshwor",
                    district: "Kathmandu",
                    ward_no: 1,
                    kitta_no: 2
                },
                land_owner: {
                    email: "bishalbaaniya@gmail.com",
                    first_name: "Bishal",
                    middle_name: "",
                    last_name: "Baaniya",
                    mob_no: "9849578042",
                    identification_no: "28-01-068-02398"
                }
            }],
            landDetailsArrayBackup: [{
                land_uuid: "d4965d9d-3a59-4a1a-b7f5-431b50d6cbb5",
                land_location: {
                    state: 3,
                    municipality: "Koteshwor",
                    district: "Kathmandu",
                    ward_no: 1,
                    kitta_no: 2
                },
                land_owner: {
                    email: "bishalbaaniya@gmail.com",
                    first_name: "Bishal",
                    middle_name: "",
                    last_name: "Baaniya",
                    mob_no: "9849578042",
                    identification_no: "28-01-068-02398"
                }
            }],
            isOpen: false,
            activationCurrentId: null,
            activationCurrentName: null,
            showMakeVerifiedAlert: false,
            showMakeRejectedAlert: false,
            showVerifyWarning: false,
            showSuccessfulActivation: false,
            showSuccessfulLandAddition: false,
            showErrorPlanAddition: false,
            isPlanLoading: false,
            addLandDto: {
                land_location: {
                    state: "3",
                    district: "Kathmandu",
                    municipality: "Koteshwor",
                    ward_no: "10",
                    kitta_no: "12"
                },
                mobile_no: "9849578042",
                identification_no: "28-01-068-02398"
            },
            errorMessage: "",
            usersArray: [
                {
                    email: "",
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    address: "",
                    mob_no: "",
                    current_status: "",
                    identification_no: ""
                }
            ],
            usersArrayBackup: [
                {
                    email: "",
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    address: "",
                    mob_no: "",
                    current_status: "",
                    identification_no: ""
                }
            ],
            currentUser: {
                email: "",
                first_name: "",
                middle_name: "",
                last_name: "",
                address: "",
                mob_no: "",
                current_status: "",
                identification_no: ""
            },
            verifiedOrRejected: "",
            adminToken: "",
        };
    }

    componentDidMount() {
        if(!this.props.token){
            this.props.history.push({
                pathname: "/landchain-login"
            })
        } else {
        }

        api.getAllUsers(this.props.token)
            .then(result => {
                this.setState({
                    usersArray: result,
                    usersArrayBackup: result,
                    loading: false
                })
            })
    }


    toggleModal = (currentItem) => {
        this.setState({
            modal: !this.state.modal,
            doc: currentItem
        });
    };


    toggleAddPlanModal = () => {
        this.setState({
            addPlanModal: !this.state.addPlanModal,
        })
    };


    toggleLandDetailsModal = (currentItem) => {
        this.setState({
            userDetailsModal: !this.state.userDetailsModal,
        })
        /*
                this.props.history.push({
                    pathname: "/land-details"
                })
        */
    };


    selectPlanType = (e) => {
        if (e.target.value !== "") {
            this.setState({
                isPlanTypeSelected: true
            })
        } else {
            this.setState({
                isPlanTypeSelected: false
            })
        }
    };


    selectTime = (e) => {
        if (e.target.value !== "") {
            this.setState({
                isPlanTimeSelected: true,
                currentTime: " of " + e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1).toLowerCase(),
            });
        } else {
            this.setState({
                isPlanTimeSelected: false
            })
        }
    };

    checkIfNumberExists = (e) => {
        if (e.target.value !== "") {
            this.setState({
                isPlanNumberSelected: true
            })
        } else {
            this.setState({
                isPlanNumberSelected: false
            })
        }
    };


    checkIfPriceExists = (e) => {
        if (e.target.value !== "") {
            this.setState({
                isPlanPriceSelected: true
            })
        } else {
            this.setState({
                isPlanPriceSelected: false
            })
        }
    };

    selectIsActive = (e) => {
        if (e.target.value !== "") {
            this.setState({
                isActiveSelected: true
            })
        } else {
            this.setState({
                isActiveSelected: false
            })
        }
    };

    onCloseSuccessfulAddition = () => {
        this.setState({
            showSuccessfulAddition: !this.state.showSuccessfulAddition
        })
    };

    onCloseErrorAddition = () => {
        this.setState({
            showErrorAddition: !this.state.showErrorAddition
        })
    };

    onCloseSuccessfulEdit = () => {
        this.setState({
            showSuccessfulEdit: !this.state.showSuccessfulEdit
        })
    };

    toggleEditPlanModal = (props) => {
        this.setState({
            isPlanTypeSelected: true,
            isPlanTimeSelected: true,
            editPlanModal: !this.state.editPlanModal,
            currentEditItem: props
        })
    };

    submitEditPlanModal = () => {
        // let planType = document.getElementById("edit-select-plan-type").value;
        let planType = $("#edit-select-plan-type").val();
        let time = document.getElementById("edit-select-time").value;
        let number = document.getElementById("edit-select-number").value;
        let price = document.getElementById("edit-select-price").value;
        let isActive = $('input[name=edit-customRadio]:checked').val();

        isActive = isActive === "active";

        let finalBody = {
            plan_access_time: number,
            plan_price: price,
            plan_type: planType,
        };

        if (1 === 1) {
            this.setState({
                showSuccessfulEdit: !this.state.showSuccessfulEdit,
                editPlanModal: !this.state.editPlanModal,
            });
        } else {
            this.setState({
                showErrorAddition: !this.state.showErrorAddition,
            });
        }

    };


    submitAddPlanModal = (e) => {
        e.preventDefault();
        let phoneNumber = document.getElementById("input-owner-phone-number").value;
        let identificationNumber = document.getElementById("input-owner-identification-number").value;
        let state = document.getElementById("select-state").value;
        let district = document.getElementById("select-district").value;
        let municipality = document.getElementById("select-municipality").value;
        let ward = document.getElementById("input-ward-number").value;
        let kitta = document.getElementById("input-kitta-number").value;

        if (!phoneNumber || !identificationNumber || !state
            || !district || !municipality || !ward || !kitta) {
            this.setState({
                errorMessage: "Please Enter All The Fields",
                showErrorAddition: true,
            })
        } else {
            this.setState({
                addLandDto: {
                    land_location: {
                        state: state,
                        district: district,
                        municipality: municipality,
                        ward_no: ward,
                        kitta_no: kitta
                    },
                    mobile_no: phoneNumber,
                    identification_no: identificationNumber
                }
            }, () => {
                api.addLand(this.state.addLandDto, this.props.token)
                    .then(result => {
                        if (result.success) {
                            api.getAllLands(this.props.token)
                                .then(result => {
                                    this.setState({
                                        landDetailsArray: result,
                                        showSuccessfulLandAddition: true
                                    })
                                });
                        } else {
                            this.setState({
                                errorMessage: "Incorrect credentials. Please try again",
                                showErrorAddition: true,
                            })
                        }
                    })
                    .catch(err => {
                        this.setState({
                            errorMessage: "Bad credentials. Please try again",
                            showErrorAddition: true,
                        })
                    })
            })
        }

    };

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    };

    makeActive = (id, planName) => {
        this.setState({
            activationCurrentId: id,
            activationCurrentName: planName,
            showMakeVerifiedAlert: !this.state.showMakeVerifiedAlert,
        })
    };

    confirmMakeVerifiedUser = () => {
        api.changeUserStatus(this.state.currentUser.mob_no, this.state.currentUser.identification_no, "VERIFIED", this.props.token)
            .then(result => {
                api.getAllUsers(this.props.token)
                    .then(result => {
                        this.setState({
                            showSuccessfulActivation: !this.state.showSuccessfulActivation,
                            showMakeVerifiedAlert: !this.state.showMakeVerifiedAlert,
                            verifiedOrRejected: "Verified",
                            usersArray: result,
                            usersArrayBackup: result
                        });
                    });
            });
    };


    confirmMakeRejectedUser = () => {
        api.changeUserStatus(this.state.currentUser.mob_no, this.state.currentUser.identification_no, "REJECTED", this.props.token)
            .then(result => {
                api.getAllUsers(this.props.token)
                    .then(result => {
                        this.setState({
                            showSuccessfulActivation: !this.state.showSuccessfulActivation,
                            showMakeRejectedAlert: !this.state.showMakeRejectedAlert,
                            verifiedOrRejected: "Rejected",
                            usersArray: result,
                            usersArrayBackup: result
                        });
                    });
            });

    };


    confirmShowVerify = () => {
        this.setState({
            showVerifyWarning: !this.state.showVerifyWarning,
        })
    };


    cancelMakeActiveAlert = () => {
        this.setState({
            showMakeVerifiedAlert: !this.state.showMakeVerifiedAlert
        });
    };


    cancelMakeRejectedAlert = () => {
        this.setState({
            showMakeRejectedAlert: !this.state.showMakeRejectedAlert
        });
    };


    cancelShowVerify = () => {
        this.setState({
            showVerifyWarning: !this.state.showVerifyWarning
        });
    };


    onCloseSuccessfulActivation = () => {
        this.setState({
            showSuccessfulActivation: !this.state.showSuccessfulActivation,
            userDetailsModal: false,
        });
    };


    onCloseSuccessfulLandAddition = () => {
        this.setState({
            showSuccessfulLandAddition: !this.state.showSuccessfulLandAddition,
            addPlanModal: false
        });
    };


    onCloseErrorPlanAddition = () => {
        this.setState({
            showErrorPlanAddition: !this.state.showErrorPlanAddition
        });
    };

    goToLandDetailsPage = (currentItem) => {
        this.props.saveLandUuid(currentItem.land_uuid)
            .then(() => {
                this.props.saveLandLocation(currentItem.land_location)
                    .then(() => {
                        this.props.history.push({
                            pathname: "/land-details"
                        })
                    });
            });
    };


    onToggleAlert = () => {
        this.setState({
            showNoResultsAlert: !this.state.showNoResultsAlert
        })
    };


    clearSearch = () => {
        document.getElementById('search-value').value = '';
        this.setState({
            isSearching: false,
            showNoResultsAlert: false,
            searchItems: [],
            usersArray: this.state.usersArrayBackup
        })
    };


    submitSearch = (e) => {
        e.preventDefault();
        let searchValue = document.getElementById("search-value").value;
        if (searchValue !== "") {
            this.setState({
                isSearching: true,
            });
            let finalSearchValues = [];
            let titles = this.state.usersNameList;
            let items = this.state.usersArray;
            for (let i = 0; i < items.length; i++) {
                let fullName = "";
                if (items[i].middle_name) {
                    fullName = items[i].first_name.toLowerCase() + " " +
                        items[i].middle_name.toLowerCase() + " " +
                        items[i].last_name.toLowerCase();
                } else {
                    fullName = items[i].first_name.toLowerCase() + " " +
                        items[i].last_name.toLowerCase();
                }

                if (
                    /*
                                        items[i].first_name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
                                        ||
                                        items[i].middle_name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
                                        ||$
                                        items[i].last_name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
                                        ||
                                        items[i].address.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
                                        ||
                    */
                    fullName.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
                ) {
                    finalSearchValues.push(items[i])
                }
            }
            if (finalSearchValues.length === 0) {
                this.setState({
                    searchItems: finalSearchValues,
                    showNoResultsAlert: true,
                    usersArray: this.state.usersArrayBackup
                });
            } else {
                this.setState({
                    usersArray: finalSearchValues,
                    showNoResultsAlert: false
                });
            }
        }
    };

    toggleUserDetailsModal = (item) => {
        this.setState({
            userDetailsModal: !this.state.userDetailsModal,
            currentUser: item
        })
    };

    notify = () => toast.info('🦄 Wow so easy!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true
    });

    makeVerified = (props) => {
        if (props) {
            this.setState({
                currentUser: props
            })
        } else {
        }

        this.setState({
            showMakeVerifiedAlert: !this.state.showMakeVerifiedAlert
        });
    };

    makeRejected = (props) => {
        if (props) {
            this.setState({
                currentUser: props
            })
        } else {
        }

        this.setState({
            showMakeRejectedAlert: !this.state.showMakeRejectedAlert
        });


    };

    render() {
        return (
            <div>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnVisibilityChange
                    draggable
                    pauseOnHover
                />
                {/*for search*/}
                <div className={"jr-card"}>
                    <div className={`search-bar right-side-icon bg-transparent`}>
                        <form onSubmit={this.submitSearch}>
                            <InputGroup>
                                <Input name="searchValue"
                                       id="search-value" className="search-main-page"
                                       placeholder="Search users' name or address"
                                       autoComplete="off"
                                />
                                <InputGroupAddon addonType="append">
                                    <Button color="info" id="search-button-main">
                                        <i className="zmdi zmdi-search zmdi-hc-lg"/>&nbsp;
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
                    No Users Found
                </UncontrolledAlert>


                {/*end for search*/}


                {/*
                <Button color="primary" className="toggle-filter" onClick={this.toggleAddPlanModal}>
                    <i className="zmdi zmdi-plus-circle-o"/> Add Land
                </Button>
*/}

                <div className="loading-icon" style={{textAlign: "center"}}>
                    <ClipLoader
                        sizeUnit={"px"}
                        size={50}
                        color={'#7095e0'}
                        loading={this.state.loading}
                    />
                </div>


                <ReactTable
                    noDataText='No Plans Found'
                    data={this.state.usersArray}
                    filterable={this.state.isFilterable}
                    filterAll={false}
                    sortable={false}
                    style={{display: !this.state.loading ? "block" : "none"}}
                    resizable={false}
                    defaultFilterMethod={(filter, row) =>
                        this.filterTable(filter, row)}
                    columns={[
                        {
                            Header: "Name",
                            accessor: "first_name",
                            Cell: props => {
                                return (
                                    <span>
                                        {props.original.middle_name ?
                                            props.original.first_name + " " +
                                            props.original.middle_name + " " +
                                            props.original.last_name
                                            :
                                            props.original.first_name + " " +
                                            props.original.last_name
                                        }
                                    </span>
                                )
                            }
                        },
                        {
                            Header: "Status",
                            accessor: "current_status",
                            Cell: props => {
                                return (
                                    <span
                                        className={props.original.current_status === "PENDING" ? "badge pending-status" :
                                            props.original.current_status === "VERIFIED" ? "badge verified-status" :
                                                "badge rejected-status"
                                        }
                                    >
                                        {props.original.current_status}
                                    </span>
                                )
                            }
                        },
                        {
                            Header: "Actions",
                            Cell: props => {
                                return (
                                    <div>
                                        <Button
                                            onClick={() => this.toggleUserDetailsModal(props.original)}
                                        >
                                            Details
                                        </Button>
                                        {props.original.current_status === "VERIFIED" ?
                                            null
                                            :
                                            <Button color="success"
                                                    onClick={() => this.makeVerified(props.original)}
                                            >
                                                Verify
                                            </Button>
                                        }


                                        {props.original.current_status === "REJECTED" || props.original.current_status === "VERIFIED" ?
                                            null
                                            :
                                            <Button color="danger"
                                                    onClick={() => this.makeRejected(props.original)}
                                            >
                                                Reject
                                            </Button>
                                        }
                                    </div>
                                )
                            }
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight plans-table"
                />

                {/*add land details modal*/}
                <Modal
                    isOpen={this.state.addPlanModal}
                    toggle={this.toggleAddPlanModal}>
                    <ModalHeader>Add Plan</ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.submitAddPlanModal} autoComplete="off">

                            <CardBody>
                                <div>

                                    <div className="form-group">
                                        {/*
                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-number">Land Id</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="select-land-id"
                                                       placeholder="Enter Land Id" autoComplete="false"
                                                />
                                            </div>
                                        </div>
*/}

                                        <h1 className="header-add-modal">Owner Details</h1>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="input-owner-phone-number">
                                                    Owner Phone Number
                                                </label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="input-owner-phone-number"
                                                       placeholder="Enter Owner Phone Number" autoComplete="false"
                                                />
                                            </div>
                                        </div>


                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="input-owner-identification-number">
                                                    Owner Identification Number
                                                </label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="input-owner-identification-number"
                                                       placeholder="Enter Owner Identification Number"
                                                       autoComplete="false"
                                                />
                                            </div>
                                        </div>


                                        <h1 className="header-add-modal">Address</h1>

                                        <div className="col-md-12 col-12 mt-4">
                                            <label htmlFor="select-state">State</label>
                                            <select className="custom-select mt-3" id="select-state"
                                                    onChange={(value) => this.selectPlanType(value)}
                                            >
                                                <option disabled selected value="">Select State</option>
                                                <option value="3">3</option>
                                            </select>
                                        </div>


                                        <div className="col-md-12 col-12 mt-4">
                                            <label htmlFor="select-district">District</label>
                                            <select className="custom-select mt-3" id="select-district"
                                                    onChange={(value) => this.selectPlanType(value)}
                                            >
                                                <option disabled selected value="">Select District</option>
                                                <option value="Kathmandu">Kathmandu</option>
                                            </select>
                                        </div>


                                        <div className="col-md-12 col-12 mt-4">
                                            <label htmlFor="select-municipality">Municipality</label>
                                            <select className="custom-select mt-3" id="select-municipality"
                                                    onChange={(value) => this.selectPlanType(value)}
                                            >
                                                <option disabled selected value="">Select Municipality</option>
                                                <option value="Koteshwor">Koteshwor</option>
                                            </select>
                                        </div>


                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="input-ward-number">Ward Number</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="input-ward-number"
                                                       placeholder="Enter Land Address" autoComplete="false"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="input-kitta-number">Kitta Number</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="input-kitta-number"
                                                       placeholder="Enter Land Address" autoComplete="false"
                                                />
                                            </div>
                                        </div>

                                        <h1 className="header-add-modal">Land Area</h1>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="input-kitta-number">Kitta Number</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="input-kitta-number"
                                                       placeholder="Enter Land Address" autoComplete="false"
                                                />
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </CardBody>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitAddPlanModal} disabled={this.state.isPlanLoading}>
                            <ClipLoader
                                sizeUnit={"px"}
                                size={10}
                                color={'#7095e0'}
                                loading={this.state.isPlanLoading}
                            />{' '}
                            Submit
                        </Button>
                        {' '}
                        <Button color="secondary" onClick={this.toggleAddPlanModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
                {/*end add land details modal*/}


                {/*land details modal*/}

                <Modal isOpen={this.state.userDetailsModal} toggle={this.toggleUserDetailsModal}>
                    <ModalHeader>User Details</ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.submitAddPlanModal} autoComplete="off">

                            <CardBody>
                                <div>

                                    <div className="form-group">
                                        {/*
                                        <div className="col-md-12 col-12 mt-4">
                                            <label htmlFor="select-plan-type">Select Plan Type</label>
                                            <select className="custom-select mt-3" id="select-plan-type"
                                                    onChange={(value) => this.selectPlanType(value)}
                                            >
                                                <option disabled selected value="">Select Plan Type</option>
                                                <option value="TRIAL">Trial</option>
                                                <option value="PREMIUM">Premium</option>
                                            </select>
                                        </div>
*/}
                                        {/*

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-number">Land Id</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="select-land-id"
                                                       placeholder="Enter Land Id" autoComplete="false"
                                                       disabled={true}
                                                       defaultValue="5822301"
                                                />
                                            </div>
                                        </div>

*/}

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <div className="passport-size-photo-div">
                                                    <img src={passportPhoto} className="passport-size-photo"/>
                                                </div>
                                                <label htmlFor="select-number">Name</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="select-land-owner-name"
                                                       placeholder="Enter Owner Name" autoComplete="false"
                                                       disabled={true}
                                                       defaultValue={this.state.currentUser.middle_name ?
                                                           this.state.currentUser.first_name + " " +
                                                           this.state.currentUser.middle_name + " " +
                                                           this.state.currentUser.last_name
                                                           :
                                                           this.state.currentUser.first_name + " " +
                                                           this.state.currentUser.last_name
                                                       }
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-user-email">Email</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="select-land-email"
                                                       placeholder="Email" autoComplete="false"
                                                       disabled={true}
                                                       defaultValue={this.state.currentUser.email}
                                                />
                                            </div>
                                        </div>


                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-user-address">Address</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="select-land-address"
                                                       placeholder="Enter Land Address" autoComplete="false"
                                                       disabled={true}
                                                       defaultValue={this.state.currentUser.address}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-phone-number">Phone Number</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="select-phone-number"
                                                       placeholder="Phone Number"
                                                       autoComplete="false"
                                                       disabled={true}
                                                       defaultValue={this.state.currentUser.mob_no}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-identification-number">Identification
                                                    Number</label>
                                                <input type="text"
                                                       className="form-control mt-3"
                                                       id="select-identification-number"
                                                       placeholder="Enter Owner's Citizenship Number"
                                                       autoComplete="false"
                                                       disabled={true}
                                                       defaultValue={this.state.currentUser.identification_no}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-identification-number">Identification
                                                    Document</label>
                                                <p className="label-identification">Front</p>
                                                <img src={citizenshipFront} className="identification-document"/>
                                                <p className="label-identification">Back</p>
                                                <img src={citizenshipBack} className="identification-document"/>
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-identification-number">Lal Purja</label>
                                                <img src={lalPurja} className="identification-document"/>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </CardBody>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        {this.state.currentUser.current_status === "VERIFIED" ?
                            null
                            :
                            <Button color="success" onClick={() => this.makeVerified()}>
                                Verify
                            </Button>
                        }
                        {' '}
                        {this.state.currentUser.current_status === "VERIFIED" || this.state.currentUser.current_status === "REJECTED" ?
                            null
                            :
                            <Button color="danger" onClick={() => this.makeRejected()}>
                                Reject
                            </Button>
                        }
                        {' '}
                        <Button color="secondary" onClick={this.toggleUserDetailsModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>

                {/*end land details modal*/}


                <Modal isOpen={this.state.editPlanModal} toggle={this.toggleEditPlanModal}>
                    <ModalHeader>Edit Plan</ModalHeader>
                    <ModalBody>
                        <form onSubmit={this.submitEditPlanModal} autoComplete="off">

                            <CardBody>
                                <div>

                                    <div className="form-group">
                                        <div className="col-md-12 col-12 mt-4">
                                            <label htmlFor="edit-select-plan-type">Select Plan Type</label>
                                            <select className="custom-select mt-3" id="edit-select-plan-type"
                                                    onChange={(value) => this.selectPlanType(value)}
                                            >
                                                <option disabled value="">Select Plan Type</option>
                                                <option value="TRIAL"
                                                        selected={this.state.currentEditItem.plan_type === "TRIAL"}
                                                >
                                                    Trial
                                                </option>
                                                <option value="PREMIUM"
                                                        selected={this.state.currentEditItem.plan_type === "PREMIUM"}
                                                >
                                                    Premium
                                                </option>
                                            </select>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <label htmlFor="edit-select-time">Select Time</label>
                                            <select className="custom-select mt-3" id="edit-select-time"
                                                    onChange={(value) => this.selectTime(value)}
                                            >
                                                <option disabled value="">Select Time</option>
                                                <option value="DAYS"
                                                        selected={this.state.currentEditItem.plan_time_enum === "DAYS"}
                                                >
                                                    Days
                                                </option>
                                                <option value="MONTHS"
                                                        selected={this.state.currentEditItem.plan_time_enum === "MONTHS"}
                                                >
                                                    Months
                                                </option>
                                                <option value="YEAR"
                                                        selected={this.state.currentEditItem.plan_time_enum === "YEAR"}
                                                >
                                                    Year
                                                </option>
                                            </select>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="edit-select-number">Enter Number
                                                    {this.state.currentTime}</label>
                                                <input type="number" min="1" step="1"
                                                       className="form-control mt-3" id="edit-select-number"
                                                       placeholder="Enter Number" autoComplete="false"
                                                       onChange={(event) => this.checkIfNumberExists(event)}
                                                       defaultValue={this.state.currentEditItem.plan_access_time}
                                                />
                                                <div className=""
                                                     style={{color: "#6480b7", marginTop: "5px", fontSize: "10px"}}>
                                                    Please enter number according to the selected time above.
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="edit-select-price">Enter Price ($)</label>

                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"
                                                              id="edit-inputGroupPrepend3">$</span>
                                                    </div>
                                                    <input type="number" min="1" step="1"
                                                           className="form-control" id="edit-select-price"
                                                           placeholder="Enter Price" autoComplete="false"
                                                           onChange={(event) => this.checkIfPriceExists(event)}
                                                           defaultValue={this.state.currentEditItem.plan_price}
                                                    />
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <label>Is Active</label>

                                            <div className="custom-control custom-radio mb-2">
                                                <input type="radio" id="edit-customRadio1" name="edit-customRadio"
                                                       className="custom-control-input"
                                                       value="active"
                                                       onChange={(value) => this.selectIsActive(value)}
                                                />
                                                <label className="custom-control-label"
                                                       htmlFor="edit-customRadio1">Active</label>
                                            </div>
                                            <div className="custom-control custom-radio mb-2">
                                                <input type="radio" id="edit-customRadio2" name="edit-customRadio"
                                                       className="custom-control-input" value="inactive"
                                                       onChange={(value) => this.selectIsActive(value)}
                                                />
                                                <label className="custom-control-label"
                                                       htmlFor="edit-customRadio2">Inactive</label>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </CardBody>
                        </form>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitEditPlanModal}
                                disabled={
                                    !(this.state.isPlanTypeSelected
                                        && this.state.isPlanTimeSelected
                                        && this.state.isPlanNumberSelected
                                        && this.state.isPlanPriceSelected
                                        && this.state.isActiveSelected
                                    )
                                }
                        >
                            Submit</Button>{' '}
                        <Button color="secondary" onClick={this.toggleEditPlanModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <SweetAlert show={this.state.showSuccessfulAddition} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulAddition}>
                    Plan has been added successfully
                </SweetAlert>
                <SweetAlert show={this.state.showErrorAddition} error
                            title={<p className="sweet-alert-title">Error</p>}
                            onConfirm={this.onCloseErrorAddition}>
                    {this.state.errorMessage}
                </SweetAlert>
                <SweetAlert show={this.state.showSuccessfulEdit} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulEdit}>
                    Plan has been edited successfully
                </SweetAlert>


                <SweetAlert show={this.state.showSuccessfulActivation} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulActivation}>
                    {this.state.currentUser.first_name + " "}
                    {this.state.currentUser.middle_name ?
                        this.state.currentUser.middle_name + " "
                        :
                        null
                    }
                    {this.state.currentUser.last_name + " "}
                    has been marked as verified
                </SweetAlert>

                <SweetAlert show={this.state.showMakeRejectedAlert}
                            warning
                            showCancel
                            confirmBtnText="Yes"
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                            title={<p className="sweet-alert-title">Are you sure?</p>}
                            onConfirm={this.confirmMakeRejectedUser}
                            onCancel={this.cancelMakeRejectedAlert}
                >
                    {this.state.currentUser.first_name + " "}
                    {this.state.currentUser.middle_name ?
                        this.state.currentUser.middle_name + " "
                        :
                        null
                    }
                    {this.state.currentUser.last_name + " "}
                    Will be marked as Rejected
                </SweetAlert>


                <SweetAlert show={this.state.showSuccessfulActivation} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulActivation}>
                    {this.state.currentUser.first_name + " "}
                    {this.state.currentUser.middle_name ?
                        this.state.currentUser.middle_name + " "
                        :
                        null
                    }
                    {this.state.currentUser.last_name + " "}
                    has been marked as {this.state.verifiedOrRejected}
                </SweetAlert>

                <SweetAlert show={this.state.showMakeVerifiedAlert}
                            warning
                            showCancel
                            confirmBtnText="Yes"
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                            title={<p className="sweet-alert-title">Are you sure?</p>}
                            onConfirm={this.confirmMakeVerifiedUser}
                            onCancel={this.cancelMakeActiveAlert}
                >
                    {this.state.currentUser.first_name + " "}
                    {this.state.currentUser.middle_name ?
                        this.state.currentUser.middle_name + " "
                        :
                        null
                    }
                    {this.state.currentUser.last_name + " "}
                    Will be marked as verified
                </SweetAlert>


                <SweetAlert show={this.state.showSuccessfulLandAddition} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulLandAddition}>
                    Added Land Successfully
                </SweetAlert>

                <SweetAlert show={this.state.showErrorPlanAddition} error
                            title={<p className="sweet-alert-title">Error</p>}
                            onConfirm={this.onCloseErrorPlanAddition}>
                    Error in adding plan. Please Try again
                </SweetAlert>


                <SweetAlert show={this.state.showVerifyWarning}
                            warning
                            showCancel
                            confirmBtnText="Yes"
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                            title={<p className="sweet-alert-title">Are you sure?</p>}
                            onConfirm={this.confirmShowVerify}
                            onCancel={this.cancelShowVerify}
                >
                </SweetAlert>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    if(state.selfReducers){
        if(state.selfReducers.adminToken){
            return ({
                token: state.selfReducers.adminToken
            })
        } else {
            return ({
                token: null
            })
        }
    } else {
        return ({
            token: null
        })
    }
};

const mapDispatchToProps = {
    saveLandUuid: saveLandUuid,
    saveLandLocation: saveLandLocation,
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserDetails));
// export default ExportsHistory;
