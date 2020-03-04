import React, {Component} from 'react';
import OrderTableCell from './OrderTableCell';
import {Button, ListGroup, ListGroupItem, ListGroupItemText, Modal, ModalBody, ModalHeader} from "reactstrap";


let counter = 0;

function createData(id, docName, image, author, actions) {
    counter += 1;
    return {id, docName, image, author, actions};
}

class OrderTable extends Component {
    state = {
        data: [
            createData('1', 'Sample Document', 'http://via.placeholder.com/150x150', 'Bishal Baaniya', '25 Oct'),
            createData('2', 'Sample Document', 'http://via.placeholder.com/150x150', 'Bishal Baaniya', '25 Oct'),
            createData('3', 'Sample Document', 'http://via.placeholder.com/150x150', 'Bishal Baaniya', '25 Oct'),
            createData('4', 'Sample Document', 'http://via.placeholder.com/150x150', 'Bishal Baaniya', '25 Oct'),
            createData('5', 'Sample Document', 'http://via.placeholder.com/150x150', 'Bishal Baaniya', '25 Oct'),
            createData('6', 'Sample Document', 'http://via.placeholder.com/150x150', 'Bishal Baaniya', '25 Oct'),
        ],
        open: false
    };

    render() {
        const {data} = this.state;
        return (
            <div className="table-responsive-material">
                <table className="default-table table-unbordered table table-sm table-hover">
                    <thead className="th-border-b">
                    <tr>
                        <th>S.N.</th>
                        <th>Document</th>
                        <th>Author</th>
                        {/*<th className="status-cell text-right">Actions</th>*/}
                        <th className="status-cell">Actions</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(result =>
                        <tr
                            tabIndex={-1}
                            key={result.id}
                        >
                            <td>{result.id}</td>
                            <td>
                                <div className="user-profile d-flex flex-row align-items-center">
                                    <img
                                        alt={result.docName}
                                        src={result.image}
                                        className="user-avatar rounded-circle mr-3"
                                    />
                                    <div className="user-detail">
                                        <a href="https://www.google.com" target="_blank">
                                            <h5 className="user-name">{result.docName}</h5>
                                        </a>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div className="user-profile d-flex flex-row align-items-center">
                                    <img
                                        alt={result.docName}
                                        src={result.image}
                                        className="user-avatar rounded-circle mr-3"
                                    />
                                    <div className="user-detail">
                                        <h5 className="user-name">{result.author}</h5>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <Button color="info" className="jr-btn bg-info" onClick={() => this.setState({open: true})}
                                >
                                    Export</Button>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>



                <Modal style={{width: 500, height: 500}} isOpen={this.state.open}
                       toggle={() => this.setState({open: !this.state.open})}
                       className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Set backup account</ModalHeader>
                    <ModalBody style={{minHeight: "250px"}}>
                        This modal will contain details of the account
                    </ModalBody>
                </Modal>

            </div>
        );
    }
}

export default OrderTable;