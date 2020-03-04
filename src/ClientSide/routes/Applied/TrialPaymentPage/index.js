import React from 'react';
import '../../../../assets/css/self_css.css';
import CardBox from '../../../../components/CardBox';
import {connect} from 'react-redux';
import {
    ABOVE_THE_HEADER,
    BELOW_THE_HEADER,
    COLLAPSED_DRAWER,
    FIXED_DRAWER,
    HORIZONTAL_NAVIGATION
} from 'constants/ActionTypes';
import {isIOS, isMobile} from 'react-device-detect';
import TopNav from 'components/TopNav';
import Header from "ClientSide/components/Header/HeaderFreeUser";
import {withRouter} from "react-router-dom";
import {Button} from "reactstrap";

import $ from "jquery";
import api from 'ClientSide/routes/Applied/app/api/index';
import SweetAlert from 'react-bootstrap-sweetalert';
import {saveDetailsOfMe} from "actions";

import SplitFieldsStripe from '../StripePayment/Stripe2';

import payPalLogo from '../../../../assets/images/paypal-whole-logo.png';
import loadingIcon from '../../../../assets/images/loading-icon-eclipse.gif';

// import IntlMessages from '../../../../util/IntlMessages';

import {isFreeTrial} from 'actions/SelfActions';
import {bindActionCreators} from "redux";
import ClipLoader from 'react-spinners/ClipLoader';

class TrialPaymentPage extends React.Component {
    constructor() {
        super();
        this.state = {
            trialPlanType: {
                plan_price: 1
            },
            showSuccessfulPayment: false,
            showPaymentError: false,
            paypalButtonLoading: false,
            userType: "FREE",
            recentList: [
                {
                    image: 'check-circle',
                    title: "",
                    date: "You will be charged $  for the first  day(s).",
                    color: "success",
                    borderColor: 'primary'
                },
                {
                    image: 'check-circle',
                    title: "",
                    date: "After that, you’ll be charged $ every month (unless you cancel).",
                    color: "success",
                    borderColor: 'primary'
                },
                {
                    image: 'check-circle',
                    title: "",
                    date: "You can cancel subscription at any time.",
                    color: "success",
                    borderColor: 'primary'
                },
            ],
            loading: true
        }
    }

    componentDidMount() {
        $(".new-menu a").removeClass("active-menu");
        $("#documents").addClass("active-menu");
        this.props.history.push({
            pathname: "/new-user"
        });

        api.getLatestActivePlan(this.props.token)
            .then(result => {
                let dayOrDays = "days";
                if (result.trial_time === 1) {
                    dayOrDays = "day";
                }
                if (this.props.allUserInfo.user_type !== "NONE") {
                    this.setState({
                        loading: true
                    }, () => {
                        this.props.isFreeTrial(true)
                            .then(() => {
                                this.props.history.push({pathname: "/documents"});
                            });
                    });
                } else {
                    this.setState({
                        loading: false
                    }, ()=>{
                        this.props.isFreeTrial(false);
                    });
                }
                this.setState({
                    recentList: [
                        {
                            image: 'check-circle',
                            title: "",
                            date: "You will be charged $" + result.trial_price + " for the first " + result.trial_time + " " + dayOrDays,
                            color: "success",
                            borderColor: 'primary'
                        },
                        {
                            image: 'check-circle',
                            title: "",
                            date: "After that, you’ll be charged $" + result.monthly_price + " every month (unless you cancel).",
                            color: "success",
                            borderColor: 'primary'
                        },
                        {
                            image: 'check-circle',
                            title: "",
                            date: "You can cancel subscription at any time",
                            color: "success",
                            borderColor: 'primary'
                        },

                    ]
                })
            });

/*

        if (this.props.allUserInfo.user_type) {
            this.setState({
                userType: this.props.allUserInfo.user_type
            }, () => {
                if (this.state.userType !== "NONE") {
                    this.props.history.push({
                        pathname: "/documents"
                    })
                }
            })
        }

*/
        /*api.listAllPlans(this.props.token)
            .then(result => {
                for (let i = 0; i < result.length; i++) {
                    if (result[i].plan_type === "TRIAL") {
                        this.setState({
                            trialPlanType: result[i]
                        });
                        break;
                    }
                }

                this.setState({
                    planTypes: result
                })
            });*/


        /*
        let element = document.getElementById("documents");
        element.classList.add("active-menu");
*/
    }

    onCancel = (data) => {
    };

    onError = (err) => {
    };

    onSuccess = (payment) => {
        let body = {
            payment_id: payment.paymentID,
            user_id: this.props.allUserInfo.id,
            plan_id: this.state.trialPlanType.id_plan_type
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

    onToken = (token) => {
        let body = {
            token: token.id,
            user_id: this.props.allUserInfo.id,
            plan_id: this.state.trialPlanType.id_plan_type
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
                        showPaymentError: !this.state.showPaymentError
                    });
                }
            })

    };

    onCloseSuccessfulPayment = () => {
        this.setState({
            showSuccessfulPayment: false
        });
        if (this.props.allUserInfo.user_type === "TRIAL") {
            this.props.history.push({
                pathname: "/documents"
            })
        }
    };

    cancelErrorPayment = () => {
        this.setState({
            showPaymentError: !this.state.showPaymentError
        })
    };

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


    render() {
        const client = {
            sandbox: 'AaQmf3B0lvzhMZg739RMZ1aja7HiAf-XFRVbrGdcYflkgu20yuG1qUPShAd-mDqFZp73XKUBFHHnkiAM',
        };

        const {match, drawerType, navigationStyle, horizontalNavPosition} = this.props;
        const drawerStyle = drawerType.includes(FIXED_DRAWER) ? 'fixed-drawer' : drawerType.includes(COLLAPSED_DRAWER) ? 'collapsible-drawer' : 'mini-drawer';

        //set default height and overflow for iOS mobile Safari 10+ support.
        if (isIOS && isMobile) {
            document.body.classList.add('ios-mobile-view-height')
        } else if (document.body.classList.contains('ios-mobile-view-height')) {
            document.body.classList.remove('ios-mobile-view-height')
        }


        if (this.state.loading) {
            return <div className="row redirect-page-main-div">

                <div className="loading-icon" style={{textAlign: "center"}}>
                    <ClipLoader
                        sizeUnit={"px"}
                        size={50}
                        color={'#7095e0'}
                        loading={true}
                    />
                </div>

            </div>
        } else {
            return (
                <div className={`app-container ${drawerStyle}`}>

                    <div className="app-main-container">
                        <div className="app-header">
                            {(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === ABOVE_THE_HEADER) &&
                            <TopNav styleName="app-top-header"/>}
                            <Header/>
                            {(navigationStyle === HORIZONTAL_NAVIGATION && horizontalNavPosition === BELOW_THE_HEADER) &&
                            <TopNav/>}

                        </div>

                        <main className="app-main-content-wrapper">
                            <div className="app-main-content">
                                <div className="app-wrapper">
                                    <div className="animated slideInUpTiny animation-duration-3">
                                        <div className="row">
                                            <CardBox styleName="col-12" cardStyle="p-0 overflow-hidden"
                                                     heading={""}
                                                     headerOutside>
                                                <div className="row">
                                                    <div className="col-12">
                                                        <div className="jr-card" style={{marginBottom: "0"}}>
                                                            <div className="jr-card-header d-flex align-items-center">
                                                                <div className="ml-3">
                                                                </div>
                                                            </div>
                                                            {/*main content*/}
                                                            <div className="row">
                                                                <div
                                                                    className="col-lg-5 col-sm-12 col-md-6 trial-payment-main"
                                                                >
                                                                    <div className="jr-card">

                                                                        {this.state.recentList.map((recentList, index) =>

                                                                            <div className="media social-list-line"
                                                                                 key={index}>

                                                                                <div
                                                                                    className={`border-${recentList.borderColor}
                                                                                bg-white
                                                                                icon-btn
                                                                                user-avatar size-40 z-index-20 align-item-self mr-3`}>
                                                                                    <i className={`zmdi zmdi-${recentList.image} text-${recentList.color} zmdi-hc-fw`}/>
                                                                                </div>
                                                                                <div className="media-body">
                                                                                    <h4 className="mb-1">{recentList.title}</h4>
                                                                                    <p className="meta-date">{recentList.date}</p>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div
                                                                        className="payment-button-trial paypal-button-trial"
                                                                    >
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
                                                                    {/*<div
                                                                    className="payment-button-trial paypal-button-trial">
                                                                    <PaypalExpressBtn client={client}
                                                                                      onError={this.onError}
                                                                                      onSuccess={this.onSuccess}
                                                                                      onCancel={this.onCancel}
                                                                                      currency={'USD'}
                                                                                      total={this.state.trialPlanType.plan_price}
                                                                                      style={{
                                                                                          color: "blue",
                                                                                          tagline: false,
                                                                                          shape: "rect",
                                                                                          // size: "responsive"
                                                                                      }}
                                                                    />
                                                                </div>*/}
                                                                    <div className="or-pay-with-card">
                                                                        OR Pay with card
                                                                    </div>


                                                                    <div
                                                                        className="payment-button-trial stripe-button-trial">
                                                                        <SplitFieldsStripe/>
                                                                        {/*<StripeCheckout
                                                                        token={this.onToken}
                                                                        stripeKey="pk_test_PxnLfJKFo1DizwO8RvIEevRC"
                                                                        amount={this.state.trialPlanType.plan_price * 100}
                                                                        currency="USD"
                                                                    />*/}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            {/*end main content*/}
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardBox>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>


                    <SweetAlert show={this.state.showSuccessfulPayment} success
                                title={<p className="sweet-alert-title">Trial Package</p>}
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


                </div>
            )
        }
    }
}

// };

/*

const mapDispatchToProps = {
    saveDetailsOfMe: saveDetailsOfMe,
    isFreeTrial: isFreeTrial,
};
*/

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        saveDetailsOfMe: saveDetailsOfMe,
        isFreeTrial: isFreeTrial,
    }, dispatch)
};


const mapStateToProps = (state) => {
    const {drawerType, navigationStyle, horizontalNavPosition} = state.settings;

    return ({
        allUserInfo: state.selfReducers.profile,
        token: state.selfReducers.serverToken,
        drawerType, navigationStyle, horizontalNavPosition
    });
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TrialPaymentPage));


// export default BasicTables;
