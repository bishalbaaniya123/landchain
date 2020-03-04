import React from "react";
import '../../../../assets/css/self_css.css';
// import {makeData} from "../Utils";
import {
    Card, CardBody, CardHeader, ModalBody, Nav, NavItem, NavLink, TabContent, TabPane,
    ListGroup, ListGroupItem, ListGroupItemText, Button, CardSubtitle, CardText, CardImg
} from 'reactstrap';

import Moment from 'react-moment';


import PropTypes from 'prop-types';


import ReactTable from "react-table";
import "react-table/react-table.css";
import api from 'LandChain/api/index';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ClipLoader from 'react-spinners/ClipLoader';
import $ from "jquery";

import SweetAlert from 'react-bootstrap-sweetalert';

import user1 from '../../../../assets/images/Landchain/users/user1.jpg';
import user2 from '../../../../assets/images/Landchain/users/user2.png';
import user3 from '../../../../assets/images/Landchain/users/user3.jpg';
import samplePdf from '../../../../assets/images/Landchain/sample-pdfs/pdf-test.pdf';
import {
    saveCurrentLandHalted,
    saveCurrentLandTransactionId,
    saveDetailsOfMe,
    saveServerToken
} from "actions/SelfActions";
import KillaDoc from "assets/images/Landchain/4KillaDoc.jpg";



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

const users = [
    {id: 1, image: user1, phone: 'Raman Khadka'},
    {id: 2, image: user2, phone: 'Indira Poudel'},
    {id: 3, image: user3, phone: 'Soman Tamang'}
];

const currentPhase = [
    {id: 1, phase: 'Field Verification', done: true},
    {id: 2, phase: 'Government Verification', done: true},
    {id: 3, phase: 'Bank Verification', done: false}
];


class LandDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: '1',
            checked: [1],
            currentOwner: {
                email: "",
                first_name: "",
                middle_name: "",
                last_name: "",
                address: "",
                mob_no: "",
                identification_no: ""
            },
            previousOwners: [
                {
                    email: "",
                    first_name: "",
                    middle_name: "",
                    last_name: "",
                    mob_no: "",
                    identification_no: "",
                    address: "",
                }
            ],
            isOngoingTransaction: false,
            buyerDetails: {
                email: "",
                first_name: "",
                middle_name: "",
                last_name: "",
                address: "",
                mob_no: "",
                identification_no: "",
            },
            verificationSteps: [],
            pdfLinkToBeSent: samplePdf + "#view=FitBV,left",
            landTransactionId: "",
            showSuccessfullySentPapers: false,
            currentVerificationItem: "",
            showConfirmVerification: false,
            showVerifiedSuccessAlert: false,

            showTransferAlert: false,
            showSuccessfulLandTransfer: false,
            buyerPdfVerified: false,
            sellerPdfVerified: false,
            landCost: ''
        }
    }

    componentDidMount() {
        api.getCurrentOwnerDetails(this.props.landUuid, this.props.token)
            .then(result => {
                this.setState({
                    currentOwner: result
                }, () => {
                    let name = "";
                    if (result.middle_name) {
                        name = result.first_name
                            + " " +
                            result.middle_name
                            + " " +
                            result.last_name;
                    } else {
                        name = result.first_name
                            + " " +
                            result.last_name;
                    }
                    document.getElementById("select-land-owner-name").value = name;
                });

            });


        api.getPreviousOwners(this.props.landUuid, this.props.token)
            .then(result => {

                this.setState({
                    previousOwners: result
                })
            });

        api.getTransactionDataList(this.props.landUuid, this.props.token)
            .then(result => {
                this.setState({
                    landTransactionId: result.land_transaction_id,
                    landCost: result.land_cost
                }, () => {
                    this.props.saveCurrentLandTransactionId(result.land_transaction_id);
                });

                if (Object.keys(result).length === 0 && result.constructor === result) {
                    this.setState({
                        isOngoingTransaction: false
                    })
                } else {
                    for (let i = 0; i < result.tracking_process_list.length; i++) {
                        this.state.verificationSteps.push(result.tracking_process_list[i].verification_step)
                    }

                    if (result.tracking_process_list.length >= 3) {
                        let pdfLink = api.getPdfLink(this.state.landTransactionId);
                        this.setState({
                            pdfLinkToBeSent: pdfLink + "#view=FitBV,left",
                            sellerPdfVerified: result.seller_pdf_verify,
                            buyerPdfVerified: result.buyer_pdf_verify,
                        });
                    }
                    this.setState({
                        isOngoingTransaction: true,
                        buyerDetails: result.buyer
                    });
                }
            });


    };

    handleChange = (event, value) => {
        this.setState({value});
    };

    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };


    handleToggle = (event, value) => {
        const {checked} = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    markAsVerified = (e) => {
        e.preventDefault();
    };

    sendPapers = () => {
        api.sendPapersToBoth(this.state.landTransactionId, this.props.token)
            .then(result => {
                if (result.success === true) {
                    this.setState({
                        showSuccessfullySentPapers: true
                    });
                }
            })
    };


    onCloseSuccessfulSentPapers = () => {
        this.setState({
            showSuccessfullySentPapers: false
        })
    };

    showVerifiedAlert = (item) => {
        this.setState({
            currentVerificationItem: item,
            showConfirmVerification: true,
        });
    };

    verifyItem = (item) => {
        api.updateVerificationList(item, this.state.landTransactionId, this.props.token)
            .then(result => {
                api.getTransactionDataList(this.props.landUuid, this.props.token)
                    .then(result => {
                        let finalTrackingArray = [];
                        for (let i = 0; i < result.tracking_process_list.length; i++) {
                            finalTrackingArray.push(result.tracking_process_list[i].verification_step);
                        }
                        this.setState({
                            verificationSteps: finalTrackingArray,
                            showConfirmVerification: false,
                            showVerifiedSuccessAlert: true
                        }, () => {
                            if (this.state.verificationSteps.length >= 5) {
                                api.makePdf(this.state.landTransactionId, this.props.token)
                                    .then(() => {
                                        let pdfLink = api.getPdfLink(this.state.landTransactionId);
                                        this.setState({
                                            pdfLinkToBeSent: pdfLink + "#view=FitBV,left",
                                            sellerPdfVerified: result.seller_pdf_verify,
                                            buyerPdfVerified: result.buyer_pdf_verify,
                                        })

                                    });
                            }
                        });
                    });

            });
    };

    onConfirmVerificationConfirm = () => {
        this.verifyItem(this.state.currentVerificationItem)
    };

    onCancelVerificationConfirm = () => {
        this.setState({
            showConfirmVerification: false,
        })
    };


    onConfirmTransferLand = () => {
        api.transferLand(this.state.landTransactionId, this.props.token)
            .then(result => {
                if (result.success) {
                    this.setState({
                        showSuccessfulLandTransfer: true,
                        showTransferAlert: false,
                    })
                }
            });
    };

    onCancelTransferLand = () => {
        this.setState({
            showTransferAlert: false,
        })
    };


    onCloseSuccessfulVerification = () => {
        this.setState({
            showVerifiedSuccessAlert: false,
        })
    };


    onCloseSuccessfulLandTransfer = () => {
        this.setState({
            showSuccessfulLandTransfer: false,
        }, () => {
            this.props.history.push({
                pathname: "/land"
            })
        })
    };

    showTransferLandAlert = () => {
        this.setState({
            showTransferAlert: true
        })
    };


    render() {
        let name = this.state.currentOwner.first_name + "" + this.state.currentOwner.last_name;

        let landLocation = "";
        let landLocationObj = this.props.landLocation;
        if (landLocationObj) {
            landLocation = "Province " + landLocationObj.state + ", "
                + landLocationObj.district + ", " + landLocationObj.municipality + " - "
                + landLocationObj.ward_no + ", " + landLocationObj.kitta_no;
        }
        let buyerName = this.props.landOwnerDetails.first_name + " " + this.props.landOwnerDetails.last_name;
        if (this.props.landOwnerDetails.middle_name) {
            buyerName = this.props.landOwnerDetails.first_name + " "
                + this.props.landOwnerDetails.middle_name + " "
                + this.props.landOwnerDetails.last_name;
        }

        let itemString = this.state.currentVerificationItem.substr(0, this.state.currentVerificationItem.indexOf('_'));
        itemString = itemString.charAt(0).toUpperCase() + itemString.slice(1).toLowerCase() + " Verification";
        return (
            <div className="details-page-main">

                <Card className="land-details-main">
                    <CardHeader className="bg-primary">
                        <Nav className="nav-fill card-header-tabs" tabs>
                            <NavItem>
                                <NavLink
                                    className={this.state.activeTab === '1' ? 'active' : ''}
                                    onClick={() => {
                                        this.toggle('1');
                                    }}>
                                    <i className="zmdi zmdi-account-circle mr-2"/>
                                    Owner Details
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={this.state.activeTab === '2' ? 'active' : ''}
                                    onClick={() => {
                                        this.toggle('2');
                                    }}>
                                    <i className="zmdi zmdi-map mr-2"/>
                                    Land Details
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={this.state.activeTab === '3' ? 'active' : ''}
                                    onClick={() => {
                                        this.toggle('3');
                                    }}>
                                    <i className="zmdi zmdi-money-box mr-2"/>
                                    Transactions
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink
                                    className={this.state.activeTab === '4' ? 'active' : ''}
                                    onClick={() => {
                                        this.toggle('4');
                                    }}>
                                    <i className="zmdi zmdi-assignment-o mr-2"/>
                                    Papers
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </CardHeader>


                    <TabContent activeTab={this.state.activeTab}>

                        <TabPane tabId="1">
                            <CardBody>

                                <form autoComplete="off">

                                    <CardBody>
                                        <div>

                                            <div className="form-group">

                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        <label htmlFor="select-land-owner-name">Owner Name</label>
                                                        <input type="text"
                                                               className="form-control mt-3"
                                                               id="select-land-owner-name"
                                                               placeholder="Owner Name" autoComplete="false"
                                                               disabled={true}
                                                            // defaultValue={name}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        <label htmlFor="select-number">Identification Number</label>
                                                        <input type="text"
                                                               className="form-control mt-3"
                                                               id="select-citizenship-number"
                                                               placeholder="Identification Number"
                                                               autoComplete="false"
                                                               disabled={true}
                                                               defaultValue={this.state.currentOwner.identification_no}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        <label htmlFor="select-number">Address</label>
                                                        <input type="text"
                                                               className="form-control mt-3"
                                                               id="select-land-address"
                                                               placeholder="Enter Land Address" autoComplete="false"
                                                               disabled={true}
                                                               defaultValue={this.state.currentOwner.address}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        <label htmlFor="select-number">Phone</label>
                                                        <input type="text"
                                                               className="form-control mt-3"
                                                               id="select-land-address"
                                                               placeholder="Enter Land Address" autoComplete="false"
                                                               disabled={true}
                                                               defaultValue={this.state.currentOwner.mob_no}
                                                        />
                                                    </div>
                                                </div>


                                            </div>
                                        </div>
                                    </CardBody>
                                </form>


                            </CardBody>
                        </TabPane>

                        <TabPane tabId="2">
                            <CardBody>

                                <form autoComplete="off">
                                    <CardBody>
                                        <div>

                                            <div className="form-group">

                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        <label htmlFor="select-land-location">Land Location</label>
                                                        <input type="text"
                                                               className="form-control mt-3"
                                                               id="select-land-location"
                                                               placeholder="Land Address" autoComplete="false"
                                                               disabled={true}
                                                               defaultValue={landLocation}
                                                               style={{maxWidth: "55%"}}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        <label htmlFor="select-number">Previous Owners</label>
                                                        <ListGroup className="overflow-hidden">
                                                            {this.state.previousOwners.length !== 0 ?
                                                                this.state.previousOwners.map((user, i) =>
                                                                    <ListGroupItem key={i + user.identification_no}
                                                                                   className="d-flex align-items-center"
                                                                                   action>
                                                                        <ListGroupItemText className="br-break mb-0">
                                                                            <p>Name:
                                                                                {
                                                                                    "  " +
                                                                                    user.first_name
                                                                                    + " " +
                                                                                    user.middle_name + " " +
                                                                                    user.last_name
                                                                                }
                                                                            </p>
                                                                            <p>Address:
                                                                                {
                                                                                    "  " +
                                                                                    user.address
                                                                                }
                                                                            </p>
                                                                            <p>Email:
                                                                                {
                                                                                    "  " +
                                                                                    user.email
                                                                                }
                                                                            </p>
                                                                            <p>Phone Number:
                                                                                {
                                                                                    "  " +
                                                                                    user.mob_no
                                                                                }
                                                                            </p>
                                                                            <p>Identification Number:
                                                                                {
                                                                                    "  " +
                                                                                    user.identification_no
                                                                                }
                                                                            </p>
                                                                        </ListGroupItemText>
                                                                    </ListGroupItem>
                                                                ) :
                                                                <p style={{fontSize: "10px"}}>No previous owners
                                                                    found</p>
                                                            }
                                                            {}
                                                        </ListGroup>
                                                    </div>
                                                </div>
                                                {/*

                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        <label htmlFor="select-number">Is Land Verified?</label>
                                                        {"      "}
                                                        <Button disabled color="success">Yes</Button>
                                                        <Button disabled>No</Button>
                                                        <Button color="success" onClick={this.markAsVerified}>Mark as
                                                            verified</Button>
                                                    </div>
                                                </div>

*/}
                                            </div>
                                        </div>
                                    </CardBody>
                                </form>

                            </CardBody>
                        </TabPane>

                        <TabPane tabId="3">
                            <CardBody>
                                <form autoComplete="off">
                                    <CardBody>
                                        <div>

                                            <div className="form-group">

                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        {this.state.landCost ?
                                                            <div>
                                                                <label htmlFor="select-number"><h3>Agreed Amount: <strong>Rs. {this.state.landCost}</strong></h3></label>
                                                                <br/>
                                                                <br/>
                                                                <br/>
                                                            </div>
                                                            :
                                                            null
                                                        }

                                                        <label htmlFor="select-number">Current Phase:</label>
                                                        {this.props.isOngoingTransaction ?
                                                            <ListGroup className="overflow-hidden">
                                                                <ListGroupItem key={1}
                                                                               className="d-flex align-items-center"
                                                                               action>
                                                                    <ListGroupItemText className="br-break mb-0">
                                                                        <span className="verification-title">Government Verification</span> {"   "}
                                                                        {this.state.verificationSteps.includes("GOVERNMENT_VERIFIED") ?
                                                                            <div className="employee-details">
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <i
                                                                                        className="zmdi zmdi-close-circle"
                                                                                        style={{color: "indianred"}}
                                                                                    />
                                                                                    :
                                                                                    <i
                                                                                        className="zmdi zmdi-check-circle"
                                                                                        style={{color: "green"}}
                                                                                    />
                                                                                }
                                                                                <br/>
                                                                                <p>Verified by: Ram Kc</p>
                                                                                <p>Employee Id: 442</p>
                                                                                <p>Date: 2076/02/22</p>
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <p className="fake-transaction">
                                                                                        This verification was marked as
                                                                                        <span style={{fontWeight: "bolder"}}> FRAUD </span>
                                                                                        by the system
                                                                                    </p>
                                                                                    :
                                                                                    null
                                                                                }

                                                                            </div>
                                                                            :
                                                                            <Button
                                                                                color="success"
                                                                                className="verify-button"
                                                                                size="sm"
                                                                                onClick={() => this.showVerifiedAlert("GOVERNMENT_VERIFIED")}
                                                                                disabled={this.props.isHalted}
                                                                            >
                                                                                Verify Now
                                                                            </Button>
                                                                        }
                                                                    </ListGroupItemText>
                                                                </ListGroupItem>
                                                                <ListGroupItem key={2}
                                                                               className="d-flex align-items-center"
                                                                               action>
                                                                    <ListGroupItemText className="br-break mb-0">
                                                                        <span className="verification-title">Field Verification</span> {"   "}
                                                                        {this.state.verificationSteps.includes("FIELD_VERIFIED") ?
                                                                            <div className="employee-details">
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <i
                                                                                        className="zmdi zmdi-close-circle"
                                                                                        style={{color: "indianred"}}
                                                                                    />
                                                                                    :
                                                                                    <i
                                                                                        className="zmdi zmdi-check-circle"
                                                                                        style={{color: "green"}}
                                                                                    />
                                                                                }
                                                                                <br/>
                                                                                <p>Verified by: Ram Kc</p>
                                                                                <p>Employee Id: 442</p>
                                                                                <p>Date: 2076/02/22</p>
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <p className="fake-transaction">
                                                                                        This verification was marked as
                                                                                        <span style={{fontWeight: "bolder"}}> FRAUD </span>
                                                                                        by the system
                                                                                    </p>
                                                                                    :
                                                                                    null
                                                                                }

                                                                                    </div>
                                                                            :
                                                                            <Button
                                                                                color="success"
                                                                                className="verify-button"
                                                                                size="sm"
                                                                                onClick={() => this.showVerifiedAlert("FIELD_VERIFIED")}
                                                                                disabled={this.props.isHalted}
                                                                            >
                                                                                Verify Now
                                                                            </Button>
                                                                        }
                                                                    </ListGroupItemText>
                                                                </ListGroupItem>
                                                                <ListGroupItem key={3}
                                                                               className="d-flex align-items-center"
                                                                               action>
                                                                    <ListGroupItemText className="br-break mb-0">
                                                                        <span className="verification-title">Ward Verification</span> {"   "}
                                                                        {this.state.verificationSteps.includes("WARD_VERIFIED") ?
                                                                            <div className="employee-details">
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <i
                                                                                        className="zmdi zmdi-close-circle"
                                                                                        style={{color: "indianred"}}
                                                                                    />
                                                                                    :
                                                                                    <i
                                                                                        className="zmdi zmdi-check-circle"
                                                                                        style={{color: "green"}}
                                                                                    />
                                                                                }
                                                                                <br/>
                                                                                <p>Verified by: Ram Kc</p>
                                                                                <p>Employee Id: 442</p>
                                                                                <p>Date: 2076/02/22</p>
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <p className="fake-transaction">
                                                                                        This verification was marked as
                                                                                        <span style={{fontWeight: "bolder"}}> FRAUD </span>
                                                                                        by the system
                                                                                    </p>
                                                                                    :
                                                                                    null
                                                                                }

                                                                            </div>
                                                                            :
                                                                            <Button
                                                                                color="success"
                                                                                className="verify-button"
                                                                                size="sm"
                                                                                onClick={() => this.showVerifiedAlert("WARD_VERIFIED")}
                                                                                disabled={this.props.isHalted}
                                                                            >
                                                                                Verify Now
                                                                            </Button>
                                                                        }
                                                                    </ListGroupItemText>
                                                                </ListGroupItem>
                                                                <ListGroupItem key={4}
                                                                               className="d-flex align-items-center"
                                                                               action>
                                                                    <ListGroupItemText className="br-break mb-0">
                                                                        <span className="verification-title">Bank Verification</span> {"   "}
                                                                        {this.state.verificationSteps.includes("BANK_VERIFIED") ?
                                                                            <div className="employee-details">
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <i
                                                                                        className="zmdi zmdi-close-circle"
                                                                                        style={{color: "indianred"}}
                                                                                    />
                                                                                    :
                                                                                    <i
                                                                                        className="zmdi zmdi-check-circle"
                                                                                        style={{color: "green"}}
                                                                                    />
                                                                                }
                                                                                <br/>
                                                                                <p>Verified by: Ram Kc</p>
                                                                                <p>Employee Id: 442</p>
                                                                                <p>Date: 2076/02/22</p>
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <p className="fake-transaction">
                                                                                        This verification was marked as
                                                                                        <span style={{fontWeight: "bolder"}}> FRAUD </span>
                                                                                        by the system
                                                                                    </p>
                                                                                    :
                                                                                    null
                                                                                }

                                                                            </div>
                                                                            :
                                                                            <Button
                                                                                color="success"
                                                                                className="verify-button"
                                                                                size="sm"
                                                                                onClick={() => this.showVerifiedAlert("BANK_VERIFIED")}
                                                                                disabled={this.props.isHalted}
                                                                            >
                                                                                Verify Now
                                                                            </Button>
                                                                        }
                                                                    </ListGroupItemText>
                                                                </ListGroupItem>
                                                                <ListGroupItem key={5}
                                                                               className="d-flex align-items-center"
                                                                               action>
                                                                    <ListGroupItemText className="br-break mb-0">
                                                                        <span className="verification-title">Malpot Verification</span> {"   "}
                                                                        {this.state.verificationSteps.includes("MALPOT_VERIFIED") ?
                                                                            <div className="employee-details">
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <i
                                                                                        className="zmdi zmdi-close-circle"
                                                                                        style={{color: "indianred"}}
                                                                                    />
                                                                                    :
                                                                                    <i
                                                                                        className="zmdi zmdi-check-circle"
                                                                                        style={{color: "green"}}
                                                                                    />
                                                                                }
                                                                                <br/>
                                                                                <p>Verified by: Ram Kc</p>
                                                                                <p>Employee Id: 442</p>
                                                                                <p>Date: 2076/02/22</p>
                                                                                {this.state.buyerDetails.first_name.toLocaleLowerCase() === "fake" ?
                                                                                    <p className="fake-transaction">
                                                                                        This verification was marked as
                                                                                        <span style={{fontWeight: "bolder"}}> FRAUD </span>
                                                                                        by the system
                                                                                    </p>
                                                                                    :
                                                                                    null
                                                                                }

                                                                            </div>
                                                                            :
                                                                            <Button
                                                                                color="success"
                                                                                className="verify-button"
                                                                                size="sm"
                                                                                onClick={() => this.showVerifiedAlert("MALPOT_VERIFIED")}
                                                                                disabled={this.props.isHalted}
                                                                            >
                                                                                Verify Now
                                                                            </Button>
                                                                        }
                                                                    </ListGroupItemText>
                                                                </ListGroupItem>
                                                                {/*<ListGroupItem key={4}
                                                                               className="d-flex align-items-center"
                                                                               action>
                                                                    <ListGroupItemText className="br-break mb-0">
                                                                        Agreement Verification {"   "}
                                                                        {this.state.verificationSteps.includes("AGREEMENT_VERIFIED") ?
                                                                            <i
                                                                                className="zmdi zmdi-check-circle"
                                                                                style={{color: "green"}}
                                                                            />
                                                                            :
                                                                            <Button
                                                                                color="success"
                                                                                className="verify-button"
                                                                                size="sm"
                                                                                onClick={() => this.showVerifiedAlert("AGREEMENT_VERIFIED")}
                                                                            >
                                                                                Verify Now
                                                                            </Button>
                                                                        }
                                                                    </ListGroupItemText>
                                                                </ListGroupItem>*/}
                                                                {/*
                                                                <ListGroupItem key={5}
                                                                               className="d-flex align-items-center"
                                                                               action>
                                                                    <ListGroupItemText className="br-break mb-0">
                                                                        Land Transferred {"   "}
                                                                        {this.state.verificationSteps.includes("LAND_TRANSFERED") ?
                                                                            <i
                                                                                className="zmdi zmdi-check-circle"
                                                                                style={{color: "green"}}
                                                                            />
                                                                            :
                                                                            null
                                                                        }
                                                                    </ListGroupItemText>
                                                                </ListGroupItem>
*/}
                                                            </ListGroup>
                                                            :
                                                            <Card className="overflow-hidden buyer-details-card">
                                                                <CardBody>
                                                                    <CardSubtitle style={{marginTop: "0"}}>No Current
                                                                        Transactions</CardSubtitle>
                                                                </CardBody>
                                                            </Card>
                                                        }
                                                    </div>
                                                </div>

                                                <div className="col-md-12 col-12 mt-4">
                                                    <div className="form-group">
                                                        <label htmlFor="select-number">Buyer Request:</label>
                                                        <br/>
                                                        {/*<Button disabled>No Buyer Request</Button>*/}

                                                        <Card className="overflow-hidden buyer-details-card">
                                                            {this.props.isOngoingTransaction ?
                                                                <CardBody>
                                                                    <CardSubtitle
                                                                        style={{marginTop: "0"}}>Name: {this.state.buyerDetails.first_name
                                                                    + " " + this.state.buyerDetails.middle_name + " "
                                                                    + this.state.buyerDetails.last_name
                                                                    }</CardSubtitle>
                                                                    <CardSubtitle>Address: {this.state.buyerDetails.address}
                                                                    </CardSubtitle>
                                                                    <CardSubtitle>Phone
                                                                        No.: {this.state.buyerDetails.mob_no}</CardSubtitle>
                                                                    <CardSubtitle>Citizenship
                                                                        Number: {this.state.buyerDetails.identification_no}</CardSubtitle>
                                                                </CardBody>
                                                                :
                                                                <CardBody>
                                                                    <CardSubtitle style={{marginTop: "0"}}>No Current
                                                                        Transactions</CardSubtitle>
                                                                </CardBody>
                                                            }
                                                        </Card>
                                                    </div>
                                                </div>


                                                <div className="col-md-12 col-12 mt-4">
                                                    <label style={{marginBottom: 20}}>4 Killa Document</label>
                                                    <img src={KillaDoc} className="identification-document"/>
                                                </div>


                                            </div>
                                        </div>
                                    </CardBody>
                                </form>
                            </CardBody>
                        </TabPane>

                        <TabPane tabId="4" className="papers-main-tab">
                            <CardBody>
                                {/*
                                <h1 className="no-buyer-request">
                                   No Buyer Request
                                </h1>
*/}
                                {this.props.isOngoingTransaction ?
                                    this.state.verificationSteps.includes("GOVERNMENT_VERIFIED")
                                    &&
                                    this.state.verificationSteps.includes("FIELD_VERIFIED")
                                    &&
                                    this.state.verificationSteps.includes("BANK_VERIFIED")

                                        ?
                                        <div>

                                            <h1 style={{textAlign: "center"}}>
                                                Send Papers
                                            </h1>
                                            <div className="row">

                                                <div className="col-6">
                                                    <Card className="overflow-hidden">
                                                        <embed
                                                            src={this.state.pdfLinkToBeSent}
                                                            width="100%" height="650"
                                                            type="application/pdf"
                                                        />
                                                        <CardBody>
                                                            <h3 className="card-title">Buyer Paper</h3>
                                                            <CardSubtitle>Name: {this.state.buyerDetails.first_name
                                                            + " " + this.state.buyerDetails.middle_name + " "
                                                            + this.state.buyerDetails.last_name
                                                            }</CardSubtitle>
                                                            <CardSubtitle>Address: {this.state.buyerDetails.address}</CardSubtitle>
                                                            <CardSubtitle>Phone
                                                                No.: {this.state.buyerDetails.mob_no}</CardSubtitle>
                                                            <CardSubtitle>Citizenship
                                                                Number: {this.state.buyerDetails.identification_no}</CardSubtitle>
                                                        </CardBody>
                                                    </Card>

                                                </div>


                                                <div className="col-6">
                                                    <Card className="overflow-hidden">
                                                        <embed
                                                            src={this.state.pdfLinkToBeSent}
                                                            width="100%"
                                                            height="650"
                                                            type="application/pdf"
                                                        />
                                                        <CardBody>
                                                            <h3 className="card-title">Seller Paper</h3>
                                                            <CardSubtitle>Name: {buyerName}</CardSubtitle>
                                                            <CardSubtitle>Address: {this.props.landOwnerDetails.address}</CardSubtitle>
                                                            <CardSubtitle>Phone
                                                                No.: {this.props.landOwnerDetails.mob_no}</CardSubtitle>
                                                            <CardSubtitle>Identification
                                                                Number: {this.props.landOwnerDetails.identification_no}</CardSubtitle>
                                                        </CardBody>
                                                    </Card>


                                                </div>

                                            </div>

                                            <div style={{textAlign: "center"}}>
                                                <Button color="success" onClick={this.sendPapers}>Send Papers</Button>
                                            </div>


                                            <h1 style={{textAlign: "center"}}>
                                                Received Papers
                                            </h1>

                                            <div className="row">

                                                <div className="col-6">
                                                    <Card className="overflow-hidden">
                                                        <embed
                                                            src={this.state.pdfLinkToBeSent}
                                                            width="100%"
                                                            height="650"
                                                            type="application/pdf"
                                                        />
                                                        <CardBody>
                                                            <h3 className="card-title">Buyer Paper</h3>
                                                            <CardSubtitle>Name: {this.state.buyerDetails.first_name
                                                            + " " + this.state.buyerDetails.middle_name + " "
                                                            + this.state.buyerDetails.last_name
                                                            }</CardSubtitle>
                                                            <CardSubtitle>Address: {this.state.buyerDetails.address}</CardSubtitle>
                                                            <CardSubtitle>Phone
                                                                No.: {this.state.buyerDetails.mob_no}</CardSubtitle>
                                                            <CardSubtitle>Citizenship
                                                                Number: {this.state.buyerDetails.identification_no}</CardSubtitle>
                                                        </CardBody>
                                                    </Card>

                                                </div>


                                                <div className="col-6">
                                                    <Card className="overflow-hidden">
                                                        <embed
                                                            src={this.state.pdfLinkToBeSent}
                                                            width="100%"
                                                            height="650"
                                                            type="application/pdf"
                                                        />
                                                        <CardBody>
                                                            <h3 className="card-title">Seller Paper</h3>
                                                            <CardSubtitle>Name: {buyerName}</CardSubtitle>
                                                            <CardSubtitle>Address: {this.props.landOwnerDetails.address}</CardSubtitle>
                                                            <CardSubtitle>Phone
                                                                No.: {this.props.landOwnerDetails.mob_no}</CardSubtitle>
                                                            <CardSubtitle>Identification
                                                                Number: {this.props.landOwnerDetails.identification_no}</CardSubtitle>
                                                        </CardBody>
                                                    </Card>

                                                </div>

                                            </div>

                                            {this.state.buyerPdfVerified && this.state.sellerPdfVerified ?
                                                null
                                                :
                                                <p style={{color: "indianred"}}>Both users have not verified PDF</p>
                                            }

                                            <div style={{textAlign: "center"}}>
                                                <Button
                                                    color="success"
                                                    onClick={this.showTransferLandAlert}
                                                    disabled={!(this.state.buyerPdfVerified && this.state.sellerPdfVerified)}
                                                >
                                                    Transfer Land
                                                </Button>
                                            </div>
                                        </div>
                                        :
                                        <h1 style={{
                                            textAlign: "center",
                                            minHeight: "185px",
                                            marginTop: "116px",
                                            fontSize: "15px"
                                        }}>
                                            Please verify all fields first
                                        </h1>
                                    :
                                    <h1 style={{
                                        textAlign: "center",
                                        minHeight: "185px",
                                        marginTop: "116px",
                                        fontSize: "15px"
                                    }}>
                                        No Buyer Request
                                    </h1>
                                }
                            </CardBody>
                        </TabPane>

                    </TabContent>

                </Card>

                <SweetAlert show={this.state.showSuccessfullySentPapers} success
                            title={<p className="sweet-alert-title">Success</p>}
                            onConfirm={this.onCloseSuccessfulSentPapers}>
                    Papers sent to both users successfully
                </SweetAlert>

                <SweetAlert show={this.state.showConfirmVerification}
                            custom
                            showCancel
                            confirmBtnText="Yes"
                            cancelBtnText="No"
                            confirmBtnBsStyle="primary"
                            cancelBtnBsStyle="default"
                            warning
                            title={<p className="sweet-alert-title">
                                {itemString}
                            </p>}

                            onConfirm={this.onConfirmVerificationConfirm}
                            onCancel={this.onCancelVerificationConfirm}
                >
                    Are you sure you want to verify this transaction?
                </SweetAlert>

                <SweetAlert show={this.state.showVerifiedSuccessAlert} success
                            title={<p className="sweet-alert-title">success</p>}
                            onConfirm={this.onCloseSuccessfulVerification}>
                    Transaction has been successfully verified
                </SweetAlert>


                <SweetAlert show={this.state.showSuccessfulLandTransfer} success
                            title={<p className="sweet-alert-title">success</p>}
                            onConfirm={this.onCloseSuccessfulLandTransfer}>
                    Land Has Been transferred successfully
                </SweetAlert>


                <SweetAlert show={this.state.showTransferAlert}
                            custom
                            showCancel
                            confirmBtnText="Yes"
                            cancelBtnText="No"
                            confirmBtnBsStyle="primary"
                            cancelBtnBsStyle="default"
                            warning
                            title={<p className="sweet-alert-title">
                                Are you sure you want to transfer this land?
                            </p>}

                            onConfirm={this.onConfirmTransferLand}
                            onCancel={this.onCancelTransferLand}
                >
                    This transaction will be marked as complete.
                </SweetAlert>


            </div>
        );
    }
}

const mapDispatchToProps = {
    saveCurrentLandTransactionId: saveCurrentLandTransactionId,
};

const mapStateToProps = (state) => {
    return ({
        landUuid: state.selfReducers.landUuid,
        isOngoingTransaction: state.selfReducers.isOngoingTransaction,
        landLocation: state.selfReducers.landLocation,
        landOwnerDetails: state.selfReducers.landOwnerDetails,
        token: state.selfReducers.adminToken,
        isHalted: state.selfReducers.isHalted,
    })
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LandDetails));
// export default ExportsHistory;
