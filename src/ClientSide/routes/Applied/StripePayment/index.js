import React, {Component} from 'react';
import {CardElement, injectStripe} from 'react-stripe-elements';

import {Elements, StripeProvider} from 'react-stripe-elements';
import CheckoutForm from './CheckoutForm';

class App extends Component {
    render() {
        return (
            <StripeProvider apiKey="pk_test_PxnLfJKFo1DizwO8RvIEevRC">
                <div className="example">
                    <h1>React Stripe Elements Example</h1>
                    <Elements>
                        <CheckoutForm handleResult={this.props.handleResult}/>
                    </Elements>
                </div>
            </StripeProvider>
        );
    }
}

export default App;