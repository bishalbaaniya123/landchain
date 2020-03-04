import React from 'react';
import {Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';


class OrderTableCell extends React.Component {

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            large: false,
            medium: false,
            small: false,
        };
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        const {id, docName, image, author, actions} = this.props.data;
        const statusStyle = status.includes("Completed") ? "text-white bg-success" : status.includes("On Hold") ? "bg-amber" : status.includes("Delayed") ? "text-white bg-danger" : "text-white bg-grey";
        return (
            <tr
                tabIndex={-1}
                key={id}
            >
                <td>{id}</td>
                <td>
                    <div className="user-profile d-flex flex-row align-items-center">
                        <img
                            alt={docName}
                            src={image}
                            className="user-avatar rounded-circle mr-3"
                        />
                        <div className="user-detail">
                            <a href="https://www.google.com" target="_blank">
                                <h5 className="user-name">{docName}</h5>
                            </a>
                        </div>
                    </div>
                </td>
                <td>
                    <div className="user-profile d-flex flex-row align-items-center">
                        <img
                            alt={docName}
                            src={image}
                            className="user-avatar rounded-circle mr-3"
                        />
                        <div className="user-detail">
                            <h5 className="user-name">{author}</h5>
                        </div>
                    </div>
                </td>
                {/*<td className="status-cell text-right">*/}
                <td>
                    {/*<span className="icon-btn size-30">*/}
                    <Button color="info" className="jr-btn bg-info">Export</Button>
                        {/*<Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                            <DropdownToggle
                                tag="span"
                                onClick={this.toggle}
                                data-toggle="dropdown"
                                aria-expanded={this.state.dropdownOpen}
                            >
                               <i className="zmdi zmdi-more-vert zmdi-hc-lg"/>
                            </DropdownToggle>
                            <DropdownMenu>
                                  <DropdownItem header>Header</DropdownItem>
                                  <DropdownItem>Another Action</DropdownItem>
                                  <DropdownItem divider/>
                                  <DropdownItem>Another Action</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>*/}
                    {/*</span>*/}
                </td>
            </tr>

        );
    }
}

export default OrderTableCell;
