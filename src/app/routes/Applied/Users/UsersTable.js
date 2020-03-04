import React from "react";
import '../../../../assets/css/self_css.css';
import {render} from "react-dom";
// import {makeData} from "../Utils";
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

import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';


import {Table} from 'reactstrap';
import CardBox from "components/CardBox";
import OrderTable from "components/dashboard/eCommerce/OrderTable";

let id = 0;

function createData(name, calories, fat, carbs, protein) {
    id += 1;
    return {id, name, calories, fat, carbs, protein};
}

const data = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];


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
            usersList: [],
            showNoResultsAlert: false,
            searchItems: [],
            isSearching: false,
            current: 1,
            totalItemsCount: 0,
            currentUser: {
                created_on: "2019-01-21",
                phone: "a@b.com",
                id: 1,
                id_latest_user_plan: null,
                image_url: null,
                name: "Bihsal",
                user_roles: [],
                user_type: "FREE",
            },
        };
    }

    componentDidMount() {

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
            let titles = this.state.usersNameList;
            for (let i = 0; i < titles.length; i++) {
                if (titles[i].toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    finalSearchValues.push(this.state.usersList[i])
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




                {/*end copied from working*/}

                <div className="row">
                    <CardBox styleName="col-12" cardStyle="p-0 overflow-hidden"
                             heading={""}
                             headerOutside>
                        <OrderTable/>
                    </CardBox>
                </div>





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
