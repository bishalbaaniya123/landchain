import React from "react";
import '../../../../../../assets/css/self_css.css';
import {makeData} from "../Utils";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Modal,
    ModalBody,
    ModalFooter,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane
} from 'reactstrap';

import PropTypes from 'prop-types';
import "react-table/react-table.css";
import CardBox from "clientSide/components/CardBox";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";


import PaypalExpressBtn from 'react-paypal-express-checkout';
import api from 'ClientSide/routes/Applied/app/api/index';
import StripeCheckout from 'react-stripe-checkout';
import SweetAlert from 'react-bootstrap-sweetalert';
import {logout, saveDetailsOfMe} from "actions";
import Moment from 'react-moment';

import errorMessage from '../../../../../../assets/images/errorMessage.png'
import loadingIcon from "assets/images/loading-icon-eclipse.gif";
import payPalLogo from "assets/images/paypal-whole-logo.png";
import SplitFieldsStripe from "clientSide/routes/Applied/StripePayment/Stripe2";


const paypalObjects = window.paypalobjects;


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

Moment.startPooledTimer(1000);


let newwindow;

class CustomFilter extends React.Component {
    constructor() {
        super();
        this.state = {
            data: makeData(),
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
            profile: {
                phone: "",
                emailVerified: false,
                googleToken: "",
                id: "",
                imageUrl: "",
                name: "",
                provider: "",
                providerId: "",
            },
            paymentModal: false,
            currentPlanType: "1",
            showSuccessfulPayment: false,
            showPaymentError: false,
            currentPrice: 0,
            planTypes: [
                {
                    id_plan_type: "",
                    plan_access_time: "",
                    plan_cms_domain: "",
                    plan_price: "",
                    plan_time_enum: ""
                },
                {
                    id_plan_type: "",
                    plan_access_time: "",
                    plan_cms_domain: "",
                    plan_price: "",
                    plan_time_enum: ""
                },
            ],
            currentClickedPlan: {
                id_plan_type: 2,
                plan_access_time: 1,
                plan_cms_domain: "WORDPRESS",
                plan_price: 15,
                plan_time_enum: "MONTHS"
            },
            userType: "FREE",
            expiryTime: "",
            purchasedPlanName: "",
            showDeleteWarning: false,
            showCancelSubscriptionWarning: false,
            paypalButtonLoading: false,
            shouldShowPayment: true,
            currentPlanPrice: null,
        };
    }

    componentDidMount() {
        if (this.props.allUserInfo) {
            this.setState({
                profile: this.props.allUserInfo,
            })
        }
        if (this.props.allUserInfo.user_type) {
            this.setState({
                userType: this.props.allUserInfo.user_type,
            })
        }

        api.getLatestActivePlan(this.props.token)
            .then(result => {
                this.setState({
                    currentPlanPrice: result.monthly_price,
                })
            })

        /*api.listAllPlans(this.props.token)
            .then(result => {
                this.setState({
                    planTypes: result
                })
            });*/

        /*api.getLatestPlan(this.props.token)
            .then(result => {
                if (result.expire_time) {
                    this.setState({
                        expiryTime: result.expire_time
                    })
                }
            });*/
    }

    filterTable = (filter, row) => {
        return row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) >= 0
    };

    toggleFilter = () => {
        this.setState({
            isFilterable: !this.state.isFilterable
        })
    };

    toggleModal = () => {
        this.setState({
            paymentModal: !this.state.paymentModal,
            activeTab: "1"
        });
    };


    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };


    onSuccess = (payment) => {
        let body = {
            payment_id: payment.paymentID,
            user_id: this.props.allUserInfo.id,
            plan_id: this.state.currentClickedPlan.id_plan_type
        };
        api.handleFrontEndPaypalPayment(body, this.props.token)
            .then(result => {
                if (result.status === 200) {
                    api.getUserInfoAfterLogin(this.props.token)
                        .then(response => {
                            this.props.saveDetailsOfMe(response);
                            this.setState({
                                paymentModal: false,
                                showSuccessfulPayment: !this.state.showSuccessfulPayment,
                            });
                        });
                } else {
                    this.setState({
                        showPaymentError: true,
                    })
                }
            })
    };

    onCancel = (data) => {
    };

    onError = (err) => {
    };

    popupPaymentPaypal = (url, windowName) => {
        newwindow = window.open(url, windowName, 'height=200,width=150');
        if (window.focus) {
            newwindow.focus()
        }
        return false;
    };

    handlePayment = (planId) => {
        api.handlePayment(planId, this.state.profile.id)
            .then(result => {
                // this.popupPaymentPaypal(result.redirect_url, "paypal")

                window.open(result.redirect_url, "result.redirect_url", 'height=200,width=150');
                // window.location.href = result.redirect_url
            })
    };

    onToken = (token) => {
        let body = {
            token: token.id,
            user_id: this.props.allUserInfo.id,
            plan_id: this.state.currentClickedPlan.id_plan_type
        };
        api.handleExecuteStripePayment(body, this.props.token)
            .then(result => {
                if (result.status === 200) {
                    api.getUserInfoAfterLogin(this.props.token)
                        .then(response => {
                            this.props.saveDetailsOfMe(response);
                            this.setState({
                                paymentModal: false,
                                showSuccessfulPayment: !this.state.showSuccessfulPayment,
                            });
                        });
                } else {
                    this.setState({
                        showPaymentError: true,
                    })
                }
            })

    };
    showPaymentModal = (planType) => {
        this.setState({
            // currentPlanType: planType,
            paymentModal: !this.state.paymentModal,
            currentClickedPlan: planType,
            purchasedPlanName: planType.plan_type.charAt(0).toUpperCase() + planType.plan_type.slice(1).toLowerCase()

        })
    };

    onCloseSuccessfulPayment = () => {
        this.setState({
            showSuccessfulPayment: !this.state.showSuccessfulPayment,
        });
        location.reload();
    };

    cancelErrorPayment = () => {
        this.setState({
            showPaymentError: !this.state.showPaymentError,
        })
    };

    deleteAccount = () => {
        this.setState({
            showDeleteWarning: !this.state.showDeleteWarning
        })
    };


    cancelSubscription = () => {
        this.setState({
            showCancelSubscriptionWarning: !this.state.showCancelSubscriptionWarning
        })
    };

    cancelDeleteWarning = () => {
        this.setState({
            showDeleteWarning: !this.state.showDeleteWarning
        })
    };


    onCancelSubscriptionWarning = () => {
        this.setState({
            showCancelSubscriptionWarning: !this.state.showCancelSubscriptionWarning
        })
    };


    cancelCancelSubscriptionWarning = () => {
        this.setState({
            showCancelSubscriptionWarning: !this.state.showCancelSubscriptionWarning
        })
    };

    confirmDeleteWarning = () => {
        api.deleteAccount(this.props.token)
            .then(result => {
                this.props.logout();
                window.location.href = "https://docpress.io";

                this.setState({
                    showDeleteWarning: !this.state.showDeleteWarning
                })
            });
    };

    confirmCancelSubscriptionWarning = () => {
        api.cancelSubscription(this.props.token)
            .then(response => {
                api.getUserInfoAfterLogin(this.props.token)
                    .then(response => {
                        this.props.saveDetailsOfMe(response);
                        this.setState({
                            showCancelSubscriptionWarning: !this.state.showCancelSubscriptionWarning
                        });
                        window.location.href = "/settings";
                    });
            });
        /*api.deleteAccount(this.props.token)
            .then(result=>{
                this.props.logout();
                window.location.href = "https://docpress.io";

                this.setState({
                    showDeleteWarning: !this.state.showDeleteWarning
                })
            });*/

    };

    onReceiveInputUnsubscribe = (val) => {
        if (val === "CONFIRM") {
            api.cancelSubscription(this.props.token)
                .then(response => {
                    api.getUserInfoAfterLogin(this.props.token)
                        .then(response => {
                            this.props.saveDetailsOfMe(response);
                            this.setState({
                                showCancelSubscriptionWarning: !this.state.showCancelSubscriptionWarning
                            });
                            window.location.href = "/settings";
                        });
                });
        } else {
            this.setState({
                showCancelSubscriptionWarning: !this.state.showCancelSubscriptionWarning
            });
        }
    };

    onReceiveInputDeleteAccount = (val) => {
        if (val === "CONFIRM") {
            api.deleteAccount(this.props.token)
                .then(result => {
                    this.props.logout();
                    window.location.href = "https://docpress.io";

                    this.setState({
                        showDeleteWarning: !this.state.showDeleteWarning
                    })
                });
        } else {
            this.setState({
                showDeleteWarning: !this.state.showDeleteWarning
            });
        }
    };


    //new payment if trial price is zero
    handlePaypalButton = () => {
        this.setState({
            paypalButtonLoading: true
        });
        api.newPaymentPaypal(this.props.token)
            .then(result => {
                window.location.href = result.redirect_url;
            })
            .catch(err => {
                this.setState({
                    paypalButtonLoading: false
                });
            })
    };

    //end new payment if trial price is zero


    render() {
        const client = {
            sandbox: 'AaQmf3B0lvzhMZg739RMZ1aja7HiAf-XFRVbrGdcYflkgu20yuG1qUPShAd-mDqFZp73XKUBFHHnkiAM',
        };
        const {value} = this.state;

        let PremiumPayment = (props) => {
            switch (this.state.userType) {
                case "FREE":
                    return (
                        <a className="btn btn-default bg-primary lighten-1 text-white already-purchased-anchor"
                           style={{
                               backgroundColor: "#909090",
                               cursor: "not-allowed",
                           }}
                        >
                            Try one day trial
                        </a>
                    );
                case "EXPIRED":
                    return (
                        <a className="btn btn-default bg-primary text-white"
                           onClick={() => this.showPaymentModal(props.details)}
                           href="javascript:void(0)">
                            Buy Now
                        </a>
                    );
                case "TRIAL":
                    return (
                        <a className="btn btn-default bg-primary text-white"
                           onClick={() => this.showPaymentModal(props.details)}
                           href="javascript:void(0)">
                            Buy Now
                        </a>
                    );
                case "PREMIUM":
                    return (
                        <a className="btn btn-default bg-primary lighten-1 text-white already-purchased-anchor"
                           style={{
                               backgroundColor: "#909090",
                               cursor: "not-allowed",
                           }}
                        >
                            Already Purchased
                        </a>
                    );
                default:
                    return (
                        <div>DEFAULT</div>
                    );
            }
        };

        let TypeOfUser = () => {
            switch (this.state.userType) {
                case "FREE":
                    return (
                        <span style={{color: "#909090"}}>Free</span>
                    );
                case "EXPIRED":
                    return (
                        <span style={{color: "chocolate"}}>Expired</span>
                    );
                case "TRIAL":
                    return (
                        <span style={{color: "indianred"}}>Trial</span>
                    );
                case "PREMIUM":
                    return (
                        <span style={{color: "gold"}}>Premium</span>
                    );
                case "PAID":
                    return (
                        <span style={{color: "gold"}}>Paid</span>
                    );
                case "CANCELED":
                    return (
                        <span style={{color: "gold"}}>Canceled&nbsp;
                            {/*<span className="span-cancelled-subscription">
                                (Canceled Subscription)
                            </span>*/}
                        </span>
                    );
                default:
                    return (
                        <span/>
                    );

            }
        };

        let ShowTimeRemaining = () => {
            let dt = this.state.expiryTime;
            if (dt !== "") {
                dt = new Date(dt);
                if (this.state.userType === "TRIAL") {
                    return (
                        <p>
                            Trial Expires <Moment fromNow style={{color: "indianred"}}>{this.state.expiryTime}</Moment>
                        </p>
                    )
                } else if (this.state.userType === "PREMIUM") {
                    return (
                        <p>
                            Expires in: {dt.getUTCFullYear() + "/" + (dt.getUTCMonth() + 1) + "/" + dt.getUTCDate()}
                        </p>
                    )
                } else {
                    return ("")
                }
            } else {
                return ("");
            }
        };

        let DynamicPlan = (props) => {
            let currentPlanType = props.type;
            let data = this.state.planTypes;
            let finalHtml = <div/>;
            for (let i = 0; i < data.length; i++) {
                if (data[i].plan_type === "PREMIUM") {
                    finalHtml =
                        <div className="col-md-4 px-lg-4">
                            <div className="card package bg-primary border-0 lighten-1 highlight">

                                <div className="package-header bg-primary text-white">
                                        <span className="price"><i
                                            className="zmdi zmdi-money"/>{data[i].plan_price}</span>
                                    <h4 className="letter-spacing-base text-uppercase mb-0">
                                        {data[i].plan_access_time} &nbsp;
                                        {data[i].plan_time_enum}

                                    </h4>
                                </div>

                                <ul className={`package-items package-items text-white`}>
                                    <li>
                                        <i className="zmdi zmdi-translate zmdi-hc-fw"/>
                                        <span>{data[i].plan_cms_domain}</span>
                                    </li>
                                    <li>
                                        <i className="zmdi zmdi-font zmdi-hc-fw"/>
                                        <span>Unlimited export for &nbsp;
                                            {data[i].plan_access_time}&nbsp;
                                            {data[i].plan_time_enum}
                                            </span>
                                    </li>
                                    <li>
                                        <i className="zmdi zmdi-hotel zmdi-hc-fw"/>
                                        <span>Feature 3</span>
                                    </li>
                                    <li>
                                        <i className="zmdi zmdi-mail-send zmdi-hc-fw"/>
                                        <span>Feature 4</span>
                                    </li>
                                    <li>
                                        <i className="zmdi zmdi-pin zmdi-hc-fw"/>
                                        <span>Feature 5</span>
                                    </li>
                                </ul>

                                <div className="package-footer">
                                    <PremiumPayment details={data[i]}/>
                                    {/*{this.state.userType === "TRIAL" ?
                                            <a className="btn btn-default bg-primary text-white"
                                               onClick={() => this.showPaymentModal(this.state.planTypes[0])}
                                               href="javascript:void(0)">
                                                Buy Now
                                            </a>
                                            :
                                            <a className="btn btn-default bg-primary lighten-1 text-white already-purchased-anchor"
                                               style={{
                                                   backgroundColor: "#909090",
                                                   cursor: "not-allowed",
                                               }}
                                               onClick={() => this.showPaymentModal(this.state.planTypes[0])}
                                               href="javascript:void(0)">
                                                Already Purchased
                                            </a>
                                        }*/}


                                    {/*<a className="btn btn-default bg-primary text-white"
                                           onClick={() => this.showPaymentModal(this.state.planTypes[0])}
                                           href="javascript:void(0)">
                                            Buy Now</a>*/}
                                    {/*<StripeCheckout
                                            token={this.onToken}
                                            stripeKey="pk_test_PxnLfJKFo1DizwO8RvIEevRC"
                                            amount={1000}
                                            currency="USD"
                                        />*/}

                                </div>
                            </div>
                        </div>
                }
            }
            return (finalHtml)
        };

        return (
            <div className="settings-main">
                <div className="settings-info">
                    <h1>
                        <i className="zmdi zmdi-account"/> Account
                    </h1>
                    <p>
                        Email: {this.state.profile.phone}
                    </p>
                    <p style={{textTransform: "capitalize"}}>
                        Type: <TypeOfUser/>
                        {/*
                        <Button color="primary" style={{marginLeft: "15px"}}>
                            <i className="zmdi zmdi-check-circle" style={{marginRight: "10px"}}/>
                            Upgrade to pro
                        </Button>
*/}

                        {/*<PaypalExpressBtn client={client}
                                          onError={this.onError}
                                          onSuccess={this.onSuccess}
                                          onCancel={this.onCancel}
                                          currency={'USD'}
                                          total={1.00}
                        />*/}

                    </p>
                    {/*working code unsubscribe and delete*/}
                    {/*
                    <p>
                        {this.state.userType === "CANCELED" ?
                            null
                            :
                            <Button color="secondary" onClick={this.cancelSubscription}>Cancel Subscription</Button>
                        }
                    </p>
                    <p>
                        <Button color="danger" onClick={this.deleteAccount}>Delete Account</Button>
                    </p>
                    */}
                    {/*end working code unsubscribe and delete*/}
                    {/*
                    {this.state.userType !== "FREE" || this.state.userType !== "EXPIRED" ?
                        <ShowTimeRemaining/>
                        :
                        null
                    }*/}
                </div>

                <div className="row">
                    <CardBox styleName="col-lg-12" cardStyle="p-0 border-0 bg-transparent"
                             heading={""}>
                        <div className="price-tables row pt-default d-flex justify-content-around">


                            {this.state.userType === "FREE" ?
                                <div className="if-trial-price-zero col-sm-12 col-md-10 col-lg-8">
                                    <div
                                        className="payment-button-trial paypal-button-trial"
                                    >
                                        <p className="settings-page-payment-prompt">
                                            <i className="zmdi zmdi-caret-right-circle"></i>
                                            You will be charged <span>${this.state.currentPlanPrice}</span> per month (unless you cancel)
                                        </p>
                                        {this.state.paypalButtonLoading ?
                                            <Button color="secondary"
                                                    className="loading-icon-button"
                                                    disabled
                                            >
                                                <img src={loadingIcon}
                                                     className="loading-icon-paypal"
                                                />
                                            </Button>
                                            :
                                            <Button onClick={this.handlePaypalButton}
                                                    color="secondary"
                                            >
                                                <img src={payPalLogo}/>
                                            </Button>
                                        }

                                    </div>

                                    <div className="or-pay-with-card">
                                        OR Pay with card
                                    </div>


                                    <div
                                        className="payment-button-trial stripe-button-trial stripe-button-settings">
                                        <SplitFieldsStripe/>
                                    </div>


                                </div>
                                :
                                null
                            }



                            {/*<DynamicPlan type="PREMIUM"/>*/}
                            {/* trial plan 1*/}
                            {/*<div className="col-md-4 px-lg-4">
                                <div className="card package bg-white">
                                    <div className="package-header bg-primary lighten-1 text-white">
                                        <span className="price"><i
                                            className="zmdi zmdi-money"/>{this.state.planTypes[1].plan_price}</span>
                                        <h4 className="letter-spacing-base text-uppercase mb-0">
                                            {this.state.planTypes[1].plan_access_time} &nbsp;
                                            {this.state.planTypes[1].plan_time_enum}
                                        </h4>
                                    </div>

                                    <ul className="package-items text-grey text-darken-3">
                                        <li>
                                            <i className="zmdi zmdi-translate zmdi-hc-fw"/>
                                            <span>
                                                {this.state.planTypes[1].plan_cms_domain}
                                            </span>
                                        </li>
                                        <li>
                                            <i className="zmdi zmdi-font zmdi-hc-fw"/>
                                            <span>Unlimited export for &nbsp;
                                                {this.state.planTypes[1].plan_access_time}&nbsp;
                                                {this.state.planTypes[1].plan_time_enum}
                                            </span>
                                        </li>
                                        <li>
                                            <i className="zmdi zmdi-hotel zmdi-hc-fw"/>
                                            <span>Feature 1</span>
                                        </li>
                                        <li>
                                            <i className="zmdi zmdi-mail-send zmdi-hc-fw"/>
                                            <span>Feature 2</span>
                                        </li>
                                        <li>
                                            <i className="zmdi zmdi-pin zmdi-hc-fw"/>
                                            <span>Feature 3</span>
                                        </li>
                                    </ul>

                                    <div className="package-footer">
                                        {this.state.userType === "FREE" ?
                                            <a className="btn btn-default bg-primary lighten-1 text-white"
                                               href="javascript:void(0)"
                                               onClick={() => this.showPaymentModal(this.state.planTypes[1])}
                                            >Buy now</a>
                                            :
                                            <a className="btn btn-default bg-primary lighten-1 text-white already-purchased-anchor"
                                               style={{
                                                   backgroundColor: "#909090",
                                                   cursor: "not-allowed",
                                               }}
                                            >
                                                Already Purchased
                                            </a>
                                        }

                                    </div>
                                </div>
                            </div>*/}
                            {/*end trial plan 1*/}

                            {/*premium plan*/}
                            {/*<div className="col-md-4 px-lg-4">
                                <div className="card package bg-primary border-0 lighten-1 highlight">

                                    <div className="package-header bg-primary text-white">
                                        <span className="price"><i
                                            className="zmdi zmdi-money"/>{this.state.planTypes[0].plan_price}</span>
                                        <h4 className="letter-spacing-base text-uppercase mb-0">
                                            {this.state.planTypes[0].plan_access_time} &nbsp;
                                            {this.state.planTypes[0].plan_time_enum}

                                        </h4>
                                    </div>

                                    <ul className={`package-items package-items text-white`}>
                                        <li>
                                            <i className="zmdi zmdi-translate zmdi-hc-fw"/>
                                            <span>{this.state.planTypes[0].plan_cms_domain}</span>
                                        </li>
                                        <li>
                                            <i className="zmdi zmdi-font zmdi-hc-fw"/>
                                            <span>Unlimited export for &nbsp;
                                                {this.state.planTypes[0].plan_access_time}&nbsp;
                                                {this.state.planTypes[0].plan_time_enum}
                                            </span>
                                        </li>
                                        <li>
                                            <i className="zmdi zmdi-hotel zmdi-hc-fw"/>
                                            <span>Feature 3</span>
                                        </li>
                                        <li>
                                            <i className="zmdi zmdi-mail-send zmdi-hc-fw"/>
                                            <span>Feature 4</span>
                                        </li>
                                        <li>
                                            <i className="zmdi zmdi-pin zmdi-hc-fw"/>
                                            <span>Feature 5</span>
                                        </li>
                                    </ul>

                                    <div className="package-footer">
                                        <PremiumPayment/>
                                        {this.state.userType === "TRIAL" ?
                                            <a className="btn btn-default bg-primary text-white"
                                               onClick={() => this.showPaymentModal(this.state.planTypes[0])}
                                               href="javascript:void(0)">
                                                Buy Now
                                            </a>
                                            :
                                            <a className="btn btn-default bg-primary lighten-1 text-white already-purchased-anchor"
                                               style={{
                                                   backgroundColor: "#909090",
                                                   cursor: "not-allowed",
                                               }}
                                               onClick={() => this.showPaymentModal(this.state.planTypes[0])}
                                               href="javascript:void(0)">
                                                Already Purchased
                                            </a>
                                        }


                                        <a className="btn btn-default bg-primary text-white"
                                           onClick={() => this.showPaymentModal(this.state.planTypes[0])}
                                           href="javascript:void(0)">
                                            Buy Now</a>
                                        <StripeCheckout
                                            token={this.onToken}
                                            stripeKey="pk_test_PxnLfJKFo1DizwO8RvIEevRC"
                                            amount={1000}
                                            currency="USD"
                                        />

                                    </div>
                                </div>
                            </div>*/}
                            {/*end premium plan*/}


                        </div>

                    </CardBox>
                </div>

                <Modal isOpen={this.state.paymentModal} toggle={this.toggleModal} className={this.props.className}
                       style={{width: 330, height: 100, top: "15%"}}
                >
                    {/*<ModalHeader toggle={this.toggleModal}>Payment</ModalHeader>*/}
                    <ModalBody>
                        <Card style={{marginBottom: "0"}}>
                            <CardHeader className="bg-primary">
                                <Nav className="nav-fill card-header-tabs" tabs>
                                    <NavItem>
                                        <NavLink
                                            className={this.state.activeTab === '1' ? 'active' : ''}
                                            onClick={() => {
                                                this.toggle('1');
                                            }}>
                                            Paypal
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={this.state.activeTab === '2' ? 'active' : ''}
                                            onClick={() => {
                                                this.toggle('2');
                                            }}>
                                            Stripe
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardHeader>


                            <TabContent activeTab={this.state.activeTab}>

                                <TabPane tabId="1">
                                    <CardBody style={{textAlign: "center"}}>
                                        <p>
                                            By confirming checkout
                                            you agree to our Membership Terms of Service.
                                            Your payment method will be charged a one time
                                            ${this.state.currentClickedPlan.plan_price}&nbsp;
                                            fee.
                                            No refunds for memberships canceled between billing cycles.
                                        </p>
                                        <PaypalExpressBtn client={client}
                                                          onError={this.onError}
                                                          onSuccess={this.onSuccess}
                                                          onCancel={this.onCancel}
                                                          currency={'USD'}
                                                          total={this.state.currentClickedPlan.plan_price}
                                                          style={{
                                                              color: "blue",
                                                              tagline: false,
                                                              shape: "rect",
                                                              // size: "responsive"
                                                          }}
                                        />
                                        {/*<Button onClick={() => this.handlePayment('1')}>Paypal Payment</Button>*/}
                                    </CardBody>
                                </TabPane>

                                <TabPane tabId="2">
                                    <CardBody style={{textAlign: "center"}}>
                                        <p>
                                            By confirming checkout
                                            you agree to our Membership Terms of Service.
                                            Your payment method will be charged a one time
                                            ${this.state.currentClickedPlan.plan_price}&nbsp;
                                            fee.
                                            No refunds for memberships canceled between billing cycles.
                                        </p>
                                        <StripeCheckout
                                            token={this.onToken}
                                            stripeKey="pk_test_PxnLfJKFo1DizwO8RvIEevRC"
                                            amount={this.state.currentClickedPlan.plan_price * 100}
                                            currency="USD"
                                        />
                                    </CardBody>
                                </TabPane>
                            </TabContent>

                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <SweetAlert show={this.state.showSuccessfulPayment} success
                            title={<p className="sweet-alert-title">{this.state.purchasedPlanName} Package</p>}
                            onConfirm={this.onCloseSuccessfulPayment}>
                    Has Been Successfully Purchased
                </SweetAlert>

                <SweetAlert show={this.state.showPaymentError}
                            error
                            title={<p className="sweet-alert-title">Sorry, there was an error in payment</p>}
                            onConfirm={this.cancelErrorPayment}
                >
                    Please Try Again
                </SweetAlert>

                {/*                <SweetAlert show={this.state.showDeleteWarning}
                            showCancel
                            error
                            cancelBtnText="Ok"
                            confirmBtnText="Cancel"
                            title={<p className="sweet-alert-title">Are you sure?</p>}
                            onCancel={this.confirmDeleteWarning}
                            onConfirm={this.cancelDeleteWarning}
                >
                    Your account will be deleted
                </SweetAlert>*/}

                {/*<SweetAlert show={this.state.showCancelSubscriptionWarning}
                            showCancel
                            error
                            cancelBtnText="Ok"
                            confirmBtnText="Cancel"
                            title={<p className="sweet-alert-title">Are you sure?</p>}
                            onCancel={this.confirmCancelSubscriptionWarning}
                            onConfirm={this.cancelCancelSubscriptionWarning}
                >
                    Your subscription will be canceled
                </SweetAlert>*/}

                <SweetAlert
                    customClass="show-confirm-alert"
                    show={this.state.showCancelSubscriptionWarning}
                    input
                    showCancel
                    cancelBtnBsStyle="default"
                    title=""
                    placeHolder="Type CONFIRM to unsubscribe"
                    onConfirm={this.onReceiveInputUnsubscribe}
                    onCancel={this.onCancelSubscriptionWarning}
                    required={false}
                >
                    <div>
                        <img src={errorMessage} style={{maxWidth: "20%", marginBottom: "20px"}}/>
                        <br/>
                        <p>
                            Type <span className="confirm-text">"CONFIRM"</span> to unsubscribe your account
                        </p>
                    </div>
                </SweetAlert>


                <SweetAlert
                    customClass="show-confirm-alert"
                    show={this.state.showDeleteWarning}
                    input
                    showCancel
                    cancelBtnBsStyle="default"
                    title=""
                    placeHolder="Type CONFIRM to delete"
                    onConfirm={this.onReceiveInputDeleteAccount}
                    onCancel={this.cancelDeleteWarning}
                    required={false}
                >
                    <div>
                        <img src={errorMessage} style={{maxWidth: "20%", marginBottom: "20px"}}/>
                        <br/>
                        <p>
                            Type <span className="confirm-text">"CONFIRM"</span> to delete your account
                        </p>
                    </div>
                </SweetAlert>

            </div>
        );
    }
}


const mapDispatchToProps = {
    saveDetailsOfMe: saveDetailsOfMe,
    logout: logout,
};


const mapStateToProps = (state) => {
    return ({
        allUserInfo: state.selfReducers.profile,
        token: state.selfReducers.serverToken
    })
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CustomFilter));

// export default DocumentsTable;
