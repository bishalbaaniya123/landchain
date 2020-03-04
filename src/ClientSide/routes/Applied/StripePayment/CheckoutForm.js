import React, {Component} from 'react';
import {
    CardCVCElement,
    CardElement,
    CardExpiryElement,
    CardNumberElement,
    injectStripe,
    PostalCodeElement
} from 'react-stripe-elements';

class CheckoutForm extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    async submit(ev) {
        let {token} = await this.props.stripe.createToken({name: "Name"});
        let response = await fetch("/charge", {
            method: "POST",
            headers: {"Content-Type": "text/plain"},
            body: token.id
        });

        if (response.ok) {}
    }

    handleBlur = () => {
    };
    handleSubmit = (evt) => {
        evt.preventDefault();
        if (this.props.stripe) {
            this.props.stripe.createToken().then(this.props.handleResult);
        } else {
        }
    };
    handleChange = () => {
    };
    handleReady = () => {
    };
    handleFocus = () => {
    };

    render() {
        const createOptions = (fontSize, padding) => {
            return {
                style: {
                    base: {
                        fontSize,
                        color: '#424770',
                        letterSpacing: '0.025em',
                        fontFamily: 'Source Code Pro, monospace',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                        padding,
                    },
                    invalid: {
                        color: '#9e2146',
                    },
                },
            };
        };
        return (
            <form onSubmit={this.handleSubmit}>

                <label htmlFor="example1-email" data-tid="elements_examples.form.email_label">Email</label>
                <input id="example1-email" data-tid="elements_examples.form.email_placeholder" type="email"
                       placeholder="janedoe@gmail.com" required="" autoComplete="email"/>
                <div className="col">
                    <label htmlFor="email">
                        Email Address
                    </label>
                    <input id="email" name="email" type="email" placeholder="jenny.rosen@example.com" required/>
                </div>

                <label>
                    Card number
                    <CardNumberElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...createOptions(this.props.fontSize)}
                    />
                </label>
                <br/>
                <label>
                    Expiration date
                    <CardExpiryElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...createOptions(this.props.fontSize)}
                    />
                </label>
                <br/>
                <label>
                    CVC
                    <CardCVCElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...createOptions(this.props.fontSize)}
                    />
                </label>
                <br/>
                <label>
                    Postal code
                    <PostalCodeElement
                        onBlur={this.handleBlur}
                        onChange={this.handleChange}
                        onFocus={this.handleFocus}
                        onReady={this.handleReady}
                        {...createOptions(this.props.fontSize)}
                    />
                </label>
                <br/>
                <button>Pay</button>
            </form>
    );
    }
    }

    export default injectStripe(CheckoutForm);
