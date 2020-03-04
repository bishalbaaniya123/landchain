import React from "react";
import '../../../../assets/css/self_css.css';
// import {makeData} from "../Utils";
import {Button, CardBody, Modal, ModalBody, ModalFooter, ModalHeader, UncontrolledAlert} from 'reactstrap';
import Moment from 'react-moment';


import PropTypes from 'prop-types';


import ReactTable from "react-table";
import "react-table/react-table.css";
import api from 'ClientSide/routes/Applied/app/api/index';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ClipLoader from 'react-spinners/ClipLoader';
import $ from "jquery";

import SweetAlert from 'react-bootstrap-sweetalert';


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


class ExportsHistory extends React.Component {
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
            allPlans: [],
            isOpen: false,
            activationCurrentId: null,
            activationCurrentName: null,
            showMakeActiveAlert: false,
            showSuccessfulActivation: false,
            showSuccessfulLandAddition: false,
            showErrorPlanAddition: false,
            isPlanLoading: false,
        };
    }

    componentDidMount() {
        /*
                api.listAllPlans("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZXMiOiJVU0VSIiwiaWF0IjoxNTQ4MTY1OTYwLCJleHAiOjE1NDkwMjk5NjB9.EbSBfLSRlx_uCtu32bpG0k8oQEzKb74G48GBoZlv9EQX9sTuLjZkLbDLEvljjK1bsD2svNHvmb19xX7jzr6Zag")
                    .then(result => {
                        this.setState({
                            dataPlans: result,
                            loading: false,
                            showTable: true
                        })
                    })
        */

        api.listAllPlans(this.props.adminToken)
            .then(result => {
                this.setState({
                    allPlans: result.body,
                    loading: false,
                    showTable: true,
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

    /*submitAddPlanModal = (e) => {
        e.preventDefault();
        let planType = document.getElementById("select-plan-type").value;
        let time = document.getElementById("select-time").value;
        let number = document.getElementById("select-number").value;
        let price = document.getElementById("select-price").value;
        let isActive = $('input[name=customRadio]:checked').val();
        if (isActive === "active") {
            isActive = true;
        } else {
            isActive = false;
        }

        let finalBody = {
            plan_access_time: number,
            plan_price: price,
            plan_type: planType,
            // plan_number: number,
            // active: isActive,
        };

        api.addPlan(finalBody)
            .then(result => {
                if (result.status === 200) {
                    api.listAllPlans("eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwicm9sZXMiOiJVU0VSIiwiaWF0IjoxNTQ4MTY1OTYwLCJleHAiOjE1NDkwMjk5NjB9.EbSBfLSRlx_uCtu32bpG0k8oQEzKb74G48GBoZlv9EQX9sTuLjZkLbDLEvljjK1bsD2svNHvmb19xX7jzr6Zag")
                        .then(result => {
                            this.setState({
                                dataPlans: result,
                                showSuccessfulAddition: !this.state.showSuccessfulAddition,
                                addPlanModal: !this.state.addPlanModal,
                            })
                        })
                } else {
                    this.setState({
                        showErrorAddition: !this.state.showErrorAddition
                    })
                }
            });

    };*/


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
        let planName = document.getElementById("select-plan-name").value;
        let trialDays = document.getElementById("select-trial-days").value;
        let trialPrice = document.getElementById("select-trial-price").value;
        let monthlyPrice = document.getElementById("select-monthly-price").value;
        let planDescription = document.getElementById("plan-description").value;
        let isActive = document.getElementById("is-active-plan").checked;

        if (planName === "") {
            this.setState({
                isPlanNameFilled: false
            })
        }

        if (trialDays === "") {
            this.setState({
                isTrialTimeFilled: false
            })
        }

        if (trialPrice === "") {
            this.setState({
                isTrialPriceFilled: false
            })
        }

        if (monthlyPrice === "") {
            this.setState({
                isMonthlyPriceFilled: false
            })
        }

        if (planDescription === "") {
            this.setState({
                isDescriptionFilled: false
            })
        }

        let finalBody = {
            plan_name: planName,
            trial_time: trialDays,
            trial_price: trialPrice,
            monthly_price: monthlyPrice,
            plan_description: planDescription,
            active: isActive,
        };

        if (planName !== "" && trialDays !== "" && trialPrice !== "" && monthlyPrice !== "" && planDescription !== ""
            && this.state.isPlanNameFilled
            && this.state.isTrialTimeFilled
            && this.state.isTrialPriceFilled
            && this.state.isMonthlyPriceFilled
            && this.state.isDescriptionFilled
        ) {
            this.setState({
                isPlanLoading: true,
            });
            api.addPlan(finalBody, this.props.adminToken)
                .then(response => {
                    if (response.status === 200) {
                        api.listAllPlans(this.props.adminToken)
                            .then(result => {
                                this.setState({
                                    allPlans: result.body,
                                    showSuccessfulLandAddition: true,
                                    addPlanModal: false,
                                    isPlanLoading: false,
                                })
                            });
                    } else {
                        this.setState({
                            showErrorPlanAddition: true,
                        })
                    }
                });
        } else {
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

    confirmMakeActive = () => {
        api.makePlanActive(this.props.adminToken, this.state.activationCurrentId)
            .then(response => {
                api.listAllPlans(this.props.adminToken)
                    .then(result => {
                        this.setState({
                            allPlans: result.body,
                        })
                    });
            });
        this.setState({
            showSuccessfulActivation: !this.state.showSuccessfulActivation,
            showMakeVerifiedAlert: !this.state.showMakeVerifiedAlert,
        })
    };


    cancelMakeActiveAlert = () => {
        this.setState({
            showMakeVerifiedAlert: !this.state.showMakeVerifiedAlert
        });
    };


    onCloseSuccessfulActivation = () => {
        this.setState({
            showSuccessfulActivation: !this.state.showSuccessfulActivation
        });
    };


    onCloseSuccessfulPlanAddition = () => {
        this.setState({
            showSuccessfulLandAddition: !this.state.showSuccessfulLandAddition
        });
    };


    onCloseErrorPlanAddition = () => {
        this.setState({
            showErrorPlanAddition: !this.state.showErrorPlanAddition
        });
    };


    render() {
        return (
            <div>

                <Button color="primary" className="toggle-filter" onClick={this.toggleAddPlanModal}>
                    <i className="zmdi zmdi-plus-circle-o"/> Add Plan
                </Button>


                <UncontrolledAlert
                    className="bg-dark border-dark text-white no-docs-alert"
                    toggle={this.onToggleAlert}
                    isOpen={this.state.showNoResultsAlert}
                >
                    No Exports History found
                </UncontrolledAlert>

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
                    data={this.state.allPlans}
                    filterable={this.state.isFilterable}
                    filterAll={false}
                    sortable={false}
                    resizable={false}
                    style={{display: this.state.showTable ? "block" : "none"}}
                    defaultFilterMethod={(filter, row) =>
                        this.filterTable(filter, row)}
                    columns={[
                        {
                            Header: "Name",
                            accessor: "plan_name",
                        },
                        {
                            Header: "Trial Time/Price",
                            accessor: "trial_time",
                            Cell: props => {
                                return (
                                    <p>
                                        {props.original.trial_time + " day / $" + props.original.trial_price}
                                    </p>
                                )
                            }
                        },
                        /*{
                            Header: "Trial Price",
                            accessor: "trial_price",
                            Cell: props => {
                                return (
                                    <p>
                                        {"$ " + props.original.trial_price}
                                    </p>
                                )
                            }
                        },*/
                        {
                            Header: "Monthly Price",
                            accessor: "monthly_price",
                            Cell: props => {
                                return (
                                    <p>
                                        {"$ " + props.original.monthly_price}
                                    </p>
                                )
                            }
                        },
                        {
                            Header: "Status",
                            Cell: props => {
                                return (
                                    props.original.active ?
                                        <div style={{color: "yellow"}}>
                                            Active
                                        </div>
                                        :
                                        <div>
                                            Inactive&nbsp;&nbsp;
                                            <Button
                                                onClick={() => this.makeActive(props.original.id, props.original.plan_name)}
                                                style={{fontSize: "10px", padding: "5px"}}
                                            >
                                                Make active
                                            </Button>
                                        </div>
                                )
                            }
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight plans-table"
                />

                <Modal isOpen={this.state.addPlanModal} toggle={this.toggleAddPlanModal}>
                    <ModalHeader>Add Plan</ModalHeader>
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

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-number">Plan Name</label>
                                                <input type="text"
                                                       className={this.state.isPlanNameFilled ?
                                                           "form-control mt-3"
                                                           :
                                                           "form-control mt-3 is-invalid"
                                                       }
                                                       id="select-plan-name"
                                                       placeholder="Enter Plan Name" autoComplete="false"
                                                       onChange={(event) => {
                                                           if (event.target.value === "") {
                                                               this.setState({
                                                                   isPlanNameFilled: false
                                                               })
                                                           } else {
                                                               this.setState({
                                                                   isPlanNameFilled: true
                                                               })
                                                           }
                                                       }}
                                                />
                                                {this.state.isPlanNameFilled ?
                                                    null
                                                    :
                                                    <div className="invalid-feedback" style={{display: "block"}}>
                                                        Please enter plan name.
                                                    </div>
                                                }

                                            </div>
                                        </div>

                                        {/*

                                        <div className="col-md-12 col-12 mt-4">
                                            <label htmlFor="select-time">Select Time</label>
                                            <select className="custom-select mt-3" id="select-time"
                                                    onChange={(value) => this.selectTime(value)}
                                            >
                                                <option disabled selected value="">Select Time</option>
                                                <option value="DAYS">Days</option>
                                                <option value="MONTHS">Months</option>
                                                <option value="YEAR">Year</option>
                                            </select>
                                        </div>

*/}
                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-trial-days">Enter Trial Days
                                                    {this.state.currentTime}</label>
                                                <input type="number" min="1" step="1"
                                                       className={this.state.isTrialTimeFilled ?
                                                           "form-control mt-3"
                                                           :
                                                           "form-control mt-3 is-invalid"
                                                       }
                                                       id="select-trial-days"
                                                       placeholder="Enter Number of Trial Days" autoComplete="false"
                                                       onChange={(event) => {
                                                           if (event.target.value === "" || event.target.value < 0) {
                                                               this.setState({
                                                                   isTrialTimeFilled: false
                                                               })
                                                           } else {
                                                               this.setState({
                                                                   isTrialTimeFilled: true
                                                               })
                                                           }
                                                       }}
                                                       defaultValue={1}
                                                />
                                                {this.state.isTrialTimeFilled ?
                                                    null
                                                    :
                                                    <div className="invalid-feedback" style={{display: "block"}}>
                                                        Please enter valid trial days.
                                                    </div>
                                                }
                                                {/*<div className=""
                                                     style={{color: "#6480b7", marginTop: "5px", fontSize: "10px"}}>
                                                    Please enter number according to the selected time above.
                                                </div>*/}
                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-trial-price">Enter Trial Price ($)
                                                    <span className="enter-zero-dollar">
                                                        (Enter 0 if you want free trial)
                                                    </span>

                                                </label>

                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"
                                                              id="inputGroupPrepend3">$</span>
                                                    </div>
                                                    <input type="number" min="0" step="0.01"
                                                           pattern="^\d*(\.\d{0,2})?$"
                                                           className={this.state.isTrialPriceFilled ?
                                                               "form-control"
                                                               :
                                                               "form-control is-invalid"
                                                           }
                                                           id="select-trial-price"
                                                           placeholder="Enter Price" autoComplete="false"
                                                           onChange={(event) => {
                                                               if (event.target.value === "" || event.target.value < 0) {
                                                                   this.setState({
                                                                       isTrialPriceFilled: false
                                                                   })
                                                               } else {
                                                                   this.setState({
                                                                       isTrialPriceFilled: true
                                                                   })
                                                               }
                                                           }}
                                                           defaultValue={1}

                                                    />

                                                    {this.state.isTrialPriceFilled ?
                                                        null
                                                        :
                                                        <div className="invalid-feedback" style={{display: "block"}}>
                                                            Please enter valid trial price.
                                                        </div>
                                                    }
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="select-monthly-price">Enter Monthly Price ($)</label>

                                                <div className="input-group">
                                                    <div className="input-group-prepend">
                                                        <span className="input-group-text"
                                                              id="inputGroupPrepend3">$</span>
                                                    </div>
                                                    <input type="number" min="1" step="0.01"
                                                           pattern="^\d*(\.\d{0,2})?$"
                                                           className={this.state.isMonthlyPriceFilled ?
                                                               "form-control"
                                                               :
                                                               "form-control is-invalid"
                                                           }
                                                           id="select-monthly-price"
                                                           placeholder="Enter Price" autoComplete="false"
                                                           onChange={(event) => {
                                                               if (event.target.value === "" || event.target.value < 0) {
                                                                   this.setState({
                                                                       isMonthlyPriceFilled: false
                                                                   })
                                                               } else {
                                                                   this.setState({
                                                                       isMonthlyPriceFilled: true
                                                                   })
                                                               }
                                                           }}
                                                           defaultValue={20}
                                                    />
                                                    {this.state.isMonthlyPriceFilled ?
                                                        null
                                                        :
                                                        <div className="invalid-feedback" style={{display: "block"}}>
                                                            Please enter valid monthly price.
                                                        </div>
                                                    }
                                                </div>

                                            </div>
                                        </div>

                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group">
                                                <label htmlFor="plan-description">Description</label>
                                                <textarea
                                                    className={this.state.isDescriptionFilled ?
                                                        "form-control"
                                                        :
                                                        "form-control is-invalid"
                                                    }
                                                    id="plan-description"
                                                    rows="2"
                                                    placeholder="Enter Description (Shown in PayPal)"
                                                    onChange={(event) => {
                                                        if (event.target.value === "") {
                                                            this.setState({
                                                                isDescriptionFilled: false
                                                            })
                                                        } else {
                                                            this.setState({
                                                                isDescriptionFilled: true
                                                            })
                                                        }
                                                    }}
                                                />
                                                {this.state.isDescriptionFilled ?
                                                    null
                                                    :
                                                    <div className="invalid-feedback" style={{display: "block"}}>
                                                        Please enter a description.
                                                    </div>
                                                }
                                            </div>
                                        </div>


                                        <div className="col-md-12 col-12 mt-4">
                                            <div className="form-group is-active-plan-admin">
                                                <label htmlFor="select-price">
                                                    <span>
                                                    Make this active plan?
                                                    </span>
                                                    <span>
                                                    <input type="checkbox"
                                                           id="is-active-plan"
                                                    />
                                                    </span>
                                                </label>

                                            </div>
                                        </div>

                                        {/*<div className="col-md-12 col-12 mt-4">
                                            <label>Is Active</label>

                                            <div className="custom-control custom-radio mb-2">
                                                <input type="radio" id="customRadio1" name="customRadio"
                                                       className="custom-control-input"
                                                       value="active"
                                                       onChange={(value) => this.selectIsActive(value)}
                                                />
                                                <label className="custom-control-label"
                                                       htmlFor="customRadio1">Active</label>
                                            </div>
                                            <div className="custom-control custom-radio mb-2">
                                                <input type="radio" id="customRadio2" name="customRadio"
                                                       className="custom-control-input" value="inactive"
                                                       onChange={(value) => this.selectIsActive(value)}
                                                />
                                                <label className="custom-control-label"
                                                       htmlFor="customRadio2">Inactive</label>
                                            </div>
                                        </div>*/}


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
                    There was some error. Please try again
                </SweetAlert>
                <SweetAlert show={this.state.showSuccessfulEdit} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulEdit}>
                    Plan has been edited successfully
                </SweetAlert>


                <SweetAlert show={this.state.showSuccessfulActivation} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulActivation}>
                    "{this.state.activationCurrentName}" has been set as current plan
                </SweetAlert>

                <SweetAlert show={this.state.showSuccessfulLandAddition} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulPlanAddition}>
                    Added Plan Successfully
                </SweetAlert>

                <SweetAlert show={this.state.showErrorPlanAddition} error
                            title={<p className="sweet-alert-title">Error</p>}
                            onConfirm={this.onCloseErrorPlanAddition}>
                    Error in adding plan. Please Try again
                </SweetAlert>

                <SweetAlert show={this.state.showMakeVerifiedAlert}
                            warning
                            showCancel
                            confirmBtnText="Yes"
                            confirmBtnBsStyle="danger"
                            cancelBtnBsStyle="default"
                            title={<p className="sweet-alert-title">Are you sure?</p>}
                            onConfirm={this.confirmMakeActive}
                            onCancel={this.cancelMakeActiveAlert}
                >
                    "{this.state.activationCurrentName}" will be set as active
                </SweetAlert>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        allUserInfo: state.selfReducers.profile,
        adminToken: state.selfReducers.adminToken,
    })
};


export default withRouter(connect(mapStateToProps)(ExportsHistory));
// export default ExportsHistory;
