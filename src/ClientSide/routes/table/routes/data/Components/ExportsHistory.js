import React from "react";
import '../../../../../../assets/css/self_css.css';
import {render} from "react-dom";
import {makeData} from "../Utils";
import matchSorter from 'match-sorter';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardBody,
    CardHeader,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    InputGroup,
    Input,
    InputGroupAddon,
    UncontrolledAlert
} from 'reactstrap';
import Moment from 'react-moment';


import PropTypes from 'prop-types';


import ReactTable from "react-table";
import "react-table/react-table.css";
import api from 'ClientSide/routes/Applied/app/api/index';
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import ClipLoader from 'react-spinners/ClipLoader';

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
            exportsHistoryList: [],
            exportsHistoryListTitle: [],
            showNoResultsAlert: false,
            searchItems: [],
            isSearching: false,
            loading: true,
            showTable: false,
        };
    }

    componentDidMount() {
        let data;
        let dataTitles = [];

        api.exportsHistoryList(this.props.token)
            .then(result => {
                data = result;
                for (let i = 0; i < data.length; i++) {
                    dataTitles.push(data[i].doc_name);
                }

                this.setState({
                    exportsHistoryList: data,
                    exportsHistoryListTitle: dataTitles,
                    loading: false,
                    showTable: true,
                });
            });
    }


    filterTable = (filter, row) => {
        return row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) >= 0
    };

    toggleFilter = () => {
        this.setState({
            isFilterable: !this.state.isFilterable
        })
    };

    toggleModal = (currentItem) => {
        this.setState({
            modal: !this.state.modal,
            doc: currentItem
        });
    };


    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };


    onToggleAlert = () => {
        this.setState({
            showNoResultsAlert: !this.state.showNoResultsAlert
        })
    };


    submitSearch = (e) => {
        e.preventDefault();
        let searchValue = document.getElementById("search-value").value;
        if (searchValue !== "") {
            this.setState({
                isSearching: true,
            });
            let finalSearchValues = [];
            let titles = this.state.exportsHistoryListTitle;
            for (let i = 0; i < titles.length; i++) {
                if (titles[i].toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    finalSearchValues.push(this.state.exportsHistoryList[i])
                }
            }
            if (finalSearchValues.length === 0) {
                this.setState({
                    searchItems: finalSearchValues,
                    showNoResultsAlert: true
                });
            } else {
                this.setState({
                    searchItems: finalSearchValues,
                    showNoResultsAlert: false
                });
            }
        }
    };

    clearSearch = () => {
        document.getElementById('search-value').value = '';
        this.setState({
            isSearching: false,
            showNoResultsAlert: false,
            searchItems: []
        })
    };


    render() {
        return (
            <div>
                {/*
                <Button color={this.state.isFilterable ? "danger" : "info"} onClick={this.toggleFilter}
                        className="toggle-filter">
                    {this.state.isFilterable ? "Hide Filters" : "Show Filters"}
                </Button>
*/}

                {/*copied from working*/}

                <div className={"jr-card"}>
                    <div className={`search-bar right-side-icon bg-transparent`}>
                        <form onSubmit={this.submitSearch}>
                            <InputGroup>
                                <Input onChange={(value) => this.handleChangeSearch(value)} name="searchValue"
                                       id="search-value" className="search-main-page"
                                       placeholder="Search Export History..."
                                       autoComplete="off"
                                />
                                <InputGroupAddon addonType="append">
                                    <Button color="info" id="search-button-main">
                                        <i className="zmdi zmdi-search zmdi-hc-lg"/>&nbsp;
                                        Search
                                    </Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </form>
                        <div style={{display: this.state.isSearching ? "block" : "none"}}>
                            <Button
                                style={{float: "right", marginTop: "10px"}}
                                onClick={this.clearSearch}
                            >
                                Clear
                            </Button>
                        </div>

                    </div>
                </div>


                <p style={{opacity: 0, height: 0}}>
                    a
                </p>
                <br/>



                <UncontrolledAlert
                    className="bg-dark border-dark text-white no-docs-alert"
                    toggle={this.onToggleAlert}
                    isOpen={this.state.showNoResultsAlert}
                >
                    No Exports History found
                </UncontrolledAlert>

                {/*end copied from working*/}

                <div className="loading-icon" style={{textAlign: "center"}}>
                    <ClipLoader
                        sizeUnit={"px"}
                        size={50}
                        color={'#7095e0'}
                        loading={this.state.loading}
                    />
                </div>


                <ReactTable
                    noDataText='No Exports Found'
                    resizable={false}
                    data={this.state.searchItems.length !== 0 ? this.state.searchItems : this.state.exportsHistoryList}
                    filterable={this.state.isFilterable}
                    filterAll={false}
                    sortable={false}
                    style={{display: this.state.showTable ? "block" : "none"}}
                    defaultFilterMethod={(filter, row) =>
                        this.filterTable(filter, row)}
                    indexKey="id_exported_doc"
                    columns={[
                        {
                            Header: "Docs",
                            accessor: "doc_name",
                            Cell: props => {
                                return (
                                    <a href={"https://docs.google.com/document/d/" + props.original.file_id}
                                       target="_blank">
                                        {props.original.doc_name}
                                        <i className="zmdi zmdi-open-in-new" style={{marginLeft: "10px"}}/>
                                    </a>
                                )
                            }
                        },
                        {
                            Header: "URL",
                            accessor: "post_link",
                            Cell: props => {
                                return (
                                    <a href={props.original.post_link} target="_blank">
                                        {props.original.post_link}
                                        <i className="zmdi zmdi-open-in-new" style={{marginLeft: "10px"}}/>
                                    </a>
                                )
                            }
                        },
                        /*{
                            Header: "Status",
                            accessor: "status",
                            Cell: props => {
                                return (
                                    <p style={{textTransform: "capitalize"}}>
                                        {props.original.status}
                                    </p>
                                )
                            }
                        },*/
                        {
                            Header: "Exported",
                            accessor: "owner_name",
                            Cell: props => {
                                return (
                                    <p>
                                        <Moment fromNow>{props.original.exported_time}</Moment>
                                    </p>
                                )
                            }
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />


                <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModal}>{this.state.doc.title}</ModalHeader>
                    <ModalBody>
                        <Card>
                            <CardHeader className="bg-primary">
                                <Nav className="nav-fill card-header-tabs" tabs>
                                    <NavItem>
                                        <NavLink
                                            className={this.state.activeTab === '1' ? 'active' : ''}
                                            onClick={() => {
                                                this.toggle('1');
                                            }}>
                                            WordPress
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={this.state.activeTab === '2' ? 'active' : ''}
                                            onClick={() => {
                                                this.toggle('2');
                                            }}>
                                            Others
                                        </NavLink>
                                    </NavItem>
                                </Nav>
                            </CardHeader>


                            <TabContent activeTab={this.state.activeTab}>

                                <TabPane tabId="1">
                                    <CardBody style={{paddingRight: "0"}}>
                                        <div>
                                            <h3 className="card-title">Select your WordPress URL</h3>
                                            <div className="custom-control custom-radio mb-2">
                                                <input type="radio" id="customRadio1" name="customRadio"
                                                       className="custom-control-input"/>
                                                <label className="custom-control-label"
                                                       htmlFor="customRadio1">https://a.wordpress.com</label>
                                            </div>
                                            <div className="custom-control custom-radio mb-2">
                                                <input type="radio" id="customRadio2" name="customRadio"
                                                       className="custom-control-input"/>
                                                <label className="custom-control-label"
                                                       htmlFor="customRadio2">https://b.wordpress.com</label>
                                            </div>
                                            <div className="custom-control custom-radio mb-2">
                                                <input type="radio" id="customRadio3" name="customRadio"
                                                       className="custom-control-input"/>
                                                <label className="custom-control-label"
                                                       htmlFor="customRadio3">https://c.wordpress.com</label>
                                            </div>
                                        </div>
                                        <div className="export-buttons-main">
                                            <Button color="primary" className="exports-button">Export as Page</Button>
                                            <Button color="primary" className="exports-button">Export as Post</Button>
                                        </div>
                                    </CardBody>
                                </TabPane>

                                <TabPane tabId="2">
                                    <CardBody>
                                        <h3 className="card-title">TODO</h3>
                                    </CardBody>
                                </TabPane>
                            </TabContent>

                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        allUserInfo: state.selfReducers.profile,
        token: state.selfReducers.serverToken
    })
};


export default withRouter(connect(mapStateToProps)(ExportsHistory));
// export default ExportsHistory;