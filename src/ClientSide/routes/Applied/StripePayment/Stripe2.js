import React, {Component} from 'react';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCVCElement,
    injectStripe,
    StripeProvider,
    Elements, CardElement,
} from 'react-stripe-elements';
import '../../../../assets/css/stripe/stripe2.css';
// import '../../../../assets/css/stripe/stripe_base2.css';
import '../../../../assets/css/stripe/stripe.css';
// import '../../../../assets/css/stripe/styles.css';
import api from 'ClientSide/routes/Applied/app/api/index'
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {saveDetailsOfMe, saveServerToken} from "actions";
import loadingIcon from '../../../../assets/images/loading-icon-eclipse.gif';
import {Button} from "reactstrap";


const createOptions = () => {
    return {
        style: {
            base: {
                fontSize: '16px',
                color: '#424770',
                letterSpacing: '0.025em',
                '::placeholder': {
                    color: '#aab7c4',
                },
            },
            invalid: {
                color: '#c23d4b',
            },
        },
    };
};

class _SplitFieldsForm extends Component {
    state = {
        errorMessage: '',
        loading: false,
    };

    handleChange = ({error}) => {
        if (error) {
            this.setState({errorMessage: error.message});
        }
    };

    handleResult = (res) => {
        if (!res.error) {
            let body = {
                token: res.token.id,
                phone: this.props.phone,
                plan_id: "1"
            };


            api.newPaymentStripe(body, this.props.serverToken)
                .then(result => {
                    if (result.status === 200) {
                        api.getUserInfoAfterLogin(this.props.serverToken)
                            .then(result => {
                                this.props.saveDetailsOfMe(result);
                                //todo: check user type here
                                if (result.user_type) {
                                    this.props.history.push({
                                        pathname: "/documents"
                                    });
                                } else {
                                    this.props.history.push({
                                        pathname: "/documents"
                                    });
                                }
                            })
                            .catch(err => {
                                this.setState({
                                    loading: false
                                });
                            });
                    } else {
                        alert("Internal Server Error\nPlease try again");
                        this.setState({
                            loading: false
                        });
                    }
                })
                .catch(err => {
                    this.setState({
                        loading: false
                    });
                });
        } else {
            this.setState({
                loading: false
            });
        }
    };

    handleSubmit = (evt) => {
        evt.preventDefault();
        this.setState({
            loading: true
        });
        if (this.props.stripe) {
            this.props.stripe.createToken().then(this.handleResult);
            // this.props.stripe.createToken().then(this.props.handleResult);
        } else {
        }
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit.bind(this)} className="main-stripe-class" autoComplete="off">
                    <fieldset>
                        {/*<div className="row single-row-input">
                            <label htmlFor="example1-email"
                                   data-tid="elements_examples.form.email_label">Email: </label>
                            <input id="example1-email" data-tid="elements_examples.form.email_placeholder"
                                   type="email" placeholder="janedoe@gmail.com" required={true} autoComplete="email"/>
                        </div>*/}
                        <div className="row stripe-payment-row">
                            <CardElement
                                onChange={this.handleChange}
                                {...createOptions()}
                            />
                            <div className="error" role="alert">
                                {this.state.errorMessage}
                            </div>
                        </div>
                    </fieldset>
                    {this.state.loading ?
                        <Button type="submit" className="stripe-loading-button"
                                data-tid="elements_examples.form.pay_button"
                                disabled
                        >
                            <img src={loadingIcon}/>
                        </Button>
                        :
                        <Button type="submit" className="pay-button-stripe"
                                data-tid="elements_examples.form.pay_button"
                        >
                            Subscribe
                        </Button>
                    }
                </form>
            </div>
        );
    }
}

const SplitFieldsForm = injectStripe(_SplitFieldsForm);


export class SplitFieldsDemo extends Component {
    render() {
        return (
            <StripeProvider apiKey="pk_test_PxnLfJKFo1DizwO8RvIEevRC">
                <Elements>
                    <SplitFieldsForm handleResult={this.props.handleResult} serverToken={this.props.token}
                                     saveDetailsOfMe={this.props.saveDetailsOfMe} history={this.props.history}
                                     email={this.props.allUserInfo.phone}
                    />
                </Elements>
            </StripeProvider>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        allUserInfo: state.selfReducers.profile,
        token: state.selfReducers.serverToken
    })
};

const mapDispatchToProps = {
    saveDetailsOfMe: saveDetailsOfMe,
    saveServerToken: saveServerToken,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SplitFieldsDemo));
