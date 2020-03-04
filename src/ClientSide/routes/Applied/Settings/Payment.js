import React from 'react';
import {bindActionCreators} from "redux";
import {connect} from 'react-redux';
import api from 'ClientSide/routes/Applied/app/api/index'


class PaymentComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentId = urlParams.get('paymentId');
        const PayerID = urlParams.get('PayerID');
        let body = {
            payment_id: paymentId,
            payer_id: PayerID,
            user_id: "1",
            plan_id: "1"
        };
        api.handleExecutePaypalPayment(body)
            .then(result => {
                window.close();
            })


    }

    render() {
        return (
            <div>
                <h1>This is a Payment component</h1>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({}, dispatch)
};
const mapStateToProps = (state) => {
    return {};
};

const smartPaymentComponent = connect(mapStateToProps, mapDispatchToProps)(PaymentComponent);
export default smartPaymentComponent;