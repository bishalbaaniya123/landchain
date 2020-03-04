import React from "react";
import 'react-notifications/lib/notifications.css';
import '../../../../../../assets/css/self_css.css';
import {makeData} from "../Utils";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardBody,
    CardHeader,
    InputGroup,
    InputGroupAddon,
    Input,
    UncontrolledAlert,
} from 'reactstrap';

import PropTypes from 'prop-types';


import ReactTable from "react-table";
import "react-table/react-table.css";
import SweetAlert from 'react-bootstrap-sweetalert';

import api from 'ClientSide/routes/Applied/app/api/index';
import $ from 'jquery';

import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

import {NotificationContainer, NotificationManager} from 'react-notifications';

import sampleUserImage from '../../../../../../assets/images/sampleUser.png';
import fileDownload from 'react-file-download';


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


class Documents extends React.Component {
    constructor() {
        super();
        this.state = {
            data: makeData(),
            isFilterable: false,
            modal: false,
            isPlatformSelected: false,
            isUrlSelected: false,
            isTypeOfExportSelected: false,
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
            googleDocsList: [],
            googleDocsListTitle: [],
            searchItems: [],
            popoverOpen: false,
            showNoResultsAlert: false,
            isSearching: false,
            showConfirmExportModal: false,
            showExportedSuccessAlert: false,
            linkedAccounts: [],
            finalBodyForExport: {
                doc_name: "",
                status: "",
                file_id: "",
                user_id: "",
                page_or_post: "",
                wordpress_account_id: ""
            },
            loading: true,
            showTable: false,
            userType: "FREE",
            canExport: true,
        };
    }

    componentDidMount() {
        if (this.props.allUserInfo.user_type) {
            this.setState({
                userType: this.props.allUserInfo.user_type,
            })
        }

        if (this.props.canExport) {
            this.setState({
                canExport: this.props.canExport,
            })
        } else {
            this.setState({
                canExport: this.props.canExport,
            })
        }

        document.title = "Documents";
        this.props.history.push({
            pathname: "/documents"
        });
        let data;
        let dataTitles = [];

        api.getGoogleDocList(this.props.token)
            .then(result => {
                data = result;

                for (let i = 0; i < data.length; i++) {
                    dataTitles.push(data[i].title);
                }
                for (let i = 0; i < data.length; i++) {
                    data[i]['exporting'] = false;
                }

                this.setState({
                    googleDocsList: data,
                    googleDocsListTitle: dataTitles,
                    loading: false,
                    showTable: true
                });
            })
            .catch(err => {
                if(err.status === 401){
                    window.location.href = "https://core.docpress.io/oauth2/authorize/google";
                }
            });

        api.getLinkedAccounts(this.props.token)
            .then(result => {
                this.setState({
                    linkedAccounts: result
                })
            })


    }

    filterTable = (filter, row) => {
        return row[filter.id].toLowerCase().indexOf(filter.value.toLowerCase()) >= 0
    };


    toggleModal = (currentItem) => {
        if (this.state.canExport === true) {
            this.setState({
                modal: !this.state.modal,
                doc: currentItem,
                isPlatformSelected: false,
                isUrlSelected: false,
                isTypeOfExportSelected: false,
            });
        }
    };


    toggle = (tab) => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };

    handleChangeSearch = (value) => {
    };

    submitSearch = (e) => {
        e.preventDefault();
        let searchValue = document.getElementById("search-value").value;
        if (searchValue !== "") {
            this.setState({
                isSearching: true,
            });
            let finalSearchValues = [];
            let titles = this.state.googleDocsListTitle;
            for (let i = 0; i < titles.length; i++) {
                if (titles[i].toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                    finalSearchValues.push(this.state.googleDocsList[i])
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

    togglePopover = () => {
        this.setState({
            popoverOpen: !this.state.popoverOpen
        });
    };

    onToggleAlert = () => {
        this.setState({
            showNoResultsAlert: !this.state.showNoResultsAlert
        })
    };


    clearSearch = () => {
        document.getElementById('search-value').value = '';
        $(".rt-td .export-button-main ").html("Export");
        $(".rt-td .export-button-main ").css({
            "margin-right": "15px",
            "background-color": "#3f51b5",
            "border-color": "#3f51b5",
            "color": "white",
        });
        $(".rt-td .export-button-main ").attr("disabled", false);
        this.setState({
            isSearching: false,
            showNoResultsAlert: false,
            searchItems: []
        });
    };


    onCancelExportsConfirmModal = () => {
        this.setState({
            showConfirmExportModal: !this.state.showConfirmExportModal
        })
    };

    onCloseSuccessfulExport = () => {
        this.setState({
            showExportedSuccessAlert: false,
            modal: false,
        })
    };

    exportDocument = () => {
        this.setState({
            showConfirmExportModal: !this.state.showConfirmExportModal
        })
    };

    createNotification = (type, title) => {
        // return () => {
        switch (type) {
            case 'info':
                NotificationManager.info('Info message');
                break;
            case 'success':
                NotificationManager.success(title + ' has been exported sucessfully', 'Success');
                break;
            case 'warning':
                NotificationManager.warning('Warning message', 'Close after 3000ms', 3000);
                break;
            case 'error':
                NotificationManager.error('There was an error while exporting', title, 5000, () => {
                    alert('callback');
                });
                break;
        }
        // };
    };

    onConfirmExportsConfirmModal = () => {
        this.setState({
            showConfirmExportModal: !this.state.showConfirmExportModal,
            modal: !this.state.modal,
        });
        let data = this.state.googleDocsList;
        for (let i = 0; i < data.length; i++) {
            if (data[i].id === this.state.doc.id) {
                data[i]['exporting'] = true;
                break;
            }
        }
        this.setState({
            googleDocsList: data
        });

        api.exportDocument(this.state.finalBodyForExport, this.props.token)
            .then(result => {
                this.setState({
                    showConfirmExportModal: false,
                });
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === result.file_id) {
                        data[i]['exporting'] = false;
                        break;
                    }
                }
                this.setState({
                    googleDocsList: data
                });

                this.createNotification('success', result.doc_name)
            })
            .catch(e => {
                this.createNotification('error', "Error");
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id === this.state.doc.id) {
                        data[i]['exporting'] = false;
                        break;
                    }
                }
                this.setState({
                    googleDocsList: data
                });

            });
    };

    selectPlatform = (e) => {
        this.setState({
            isPlatformSelected: true
        })
    };


    selectUrl = (e) => {
        this.setState({
            isUrlSelected: true
        })
    };

    selectTypeofExport = (e) => {
        this.setState({
            isTypeOfExportSelected: true
        })

    };


    submitExportsModal = (e) => {
        e.preventDefault();

        let currentDoc = this.state.doc;

        let post_or_page = $('input[name=customRadio]:checked').val();


        let wordpress_account_id = $('#select-url').val();

        this.setState({
            finalBodyForExport: {
                doc_name: currentDoc.title,
                status: "draft",
                file_id: currentDoc.id,
                page_or_post: post_or_page,
                wordpress_account_id: wordpress_account_id
            }
        }, () => {
            this.setState({
                modal: !this.state.modal,
            });
            let data = this.state.googleDocsList;
            for (let i = 0; i < data.length; i++) {
                if (data[i].id === this.state.doc.id) {
                    data[i]['exporting'] = true;
                    break;
                }
            }
            this.setState({
                googleDocsList: data
            });
            api.exportDocument(this.state.finalBodyForExport, this.props.token)
                .then(result => {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === result.file_id) {
                            data[i]['exporting'] = false;
                            break;
                        }
                    }
                    this.setState({
                        googleDocsList: data
                    });

                    this.createNotification('success', result.doc_name)
                })
                .catch(e => {
                    this.createNotification('error', "Error");
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id === this.state.doc.id) {
                            data[i]['exporting'] = false;
                            break;
                        }
                    }
                    this.setState({
                        googleDocsList: data
                    });

                });
        });
    };

    markdownDownload = (data) => {
        let finalBody = {
            id: data.id,
            fileName: data.title,
        };
        api.markdownDownload(finalBody, this.props.token)
            .then(res => {
                fileDownload(res, data.title + ".zip");
            })
    };


    render() {
        let {data} = this.state;
        return (
            <div>
                <div className={"jr-card"}>
                    <div className={`search-bar right-side-icon bg-transparent`}>
                        <form onSubmit={this.submitSearch}>
                            <InputGroup>
                                <Input onChange={(value) => this.handleChangeSearch(value)} name="searchValue"
                                       id="search-value" className="search-main-page"
                                       placeholder="Search Google docs..."
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
                    No docs found
                </UncontrolledAlert>

                <div className="loading-icon" style={{textAlign: "center"}}>
                    <ClipLoader
                        sizeUnit={"px"}
                        size={50}
                        color={'#7095e0'}
                        loading={this.state.loading}
                    />
                </div>


                <ReactTable
                    noDataText='No Docs Found'
                    data={this.state.searchItems.length !== 0 ? this.state.searchItems : this.state.googleDocsList}
                    filterable={this.state.isFilterable}
                    filterAll={false}
                    defaultFilterMethod={(filter, row) =>
                        this.filterTable(filter, row)}
                    sortable={false}
                    resizable={false}
                    style={{display: this.state.showTable ? "block" : "none"}}
                    columns={[
                        {
                            Header: "Docs",
                            accessor: "title",
                            Cell: props => {
                                return (
                                    <a href={props.original.alternate_link} target="_blank">
                                        {props.original.title}
                                        <i className="zmdi zmdi-open-in-new" style={{marginLeft: "10px"}}/>
                                    </a>
                                )
                            }
                        },
                        {
                            Header: "Author",
                            accessor: "owner_name",
                            Cell: props => {
                                return (
                                    <p>
                                        {props.original.owner_picture ?
                                            <img src={props.original.owner_picture} className="thumbnail-image"/>
                                            :
                                            <img src={sampleUserImage} className="thumbnail-image"/>
                                        }
                                        {props.original.owner_name}
                                    </p>
                                )
                            }
                        },
                        {
                            Header: "Actions",
                            Cell: props => {
                                return (
                                    <div>
                                        {props.original.exporting ?
                                            <Button
                                                onClick={() => this.toggleModal(props.original)}
                                                className="action-buttons export-button-main loading-export"
                                                color="primary"
                                                id={props.original.id}
                                                disabled={true}
                                                style={{
                                                    marginRight: "-1px",
                                                    backgroundColor: "#f5f5f5",
                                                    borderColor: "#f5f5f5",
                                                    color: "black",
                                                    padding: "0.375rem 0.75rem"
                                                }}
                                            >
                                                Exporting
                                                {/*<ClipLoader
                                                    sizeUnit={"px"}
                                                    size={15}
                                                    color={'#7095e0'}
                                                    loading={true}
                                                />*/}
                                            </Button>
                                            :
                                            <Button
                                                onClick={() => this.toggleModal(props.original)}
                                                className="action-buttons export-button-main" color="primary"
                                                id={props.original.id}
                                                // disabled={this.state.userType === "FREE" || this.state.userType === "EXPIRED"}
                                                disabled={!this.state.canExport}
                                                style={{
                                                    width: "65px",
                                                }}
                                            >
                                                Export
                                            </Button>
                                        }
                                        {/*<Button
                                            className="action-buttons markdown-button"
                                            color="info"
                                            disabled={this.state.userType === "FREE" || this.state.userType === "EXPIRED"}
                                            onClick={() => this.markdownDownload(props.original)}
                                        >
                                            <i className="zmdi zmdi-download"/>
                                            Markdown
                                        </Button>*/}
                                    </div>
                                )
                            }
                        }
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />


                <Modal isOpen={this.state.modal} toggle={this.toggleModal} className={this.props.className}>
                    <ModalHeader toggle={this.toggleModal}>Export</ModalHeader>
                    <ModalBody className="export-modal-main">
                        <Card style={{marginBottom: "0"}}>
                            <CardHeader>
                                {this.state.doc.title}
                            </CardHeader>


                            <CardBody>
                                <div>
                                    <form onSubmit={this.submitExportsModal}>
                                        <div className="form-group">
                                            {/*<div className="col-md-12 col-12 mt-4">
                                                <label htmlFor="select-platform">Select Platform</label>
                                                <select className="custom-select mt-3" id="select-platform"
                                                        onChange={(value) => this.selectPlatform(value)}
                                                        defaultValue=""
                                                >
                                                    <option disabled value="">Select Platform</option>
                                                    <option value="WordPress">WordPress</option>
                                                    <option value="Joomla">Joomla</option>
                                                    <option value="Drupal">Drupal</option>
                                                </select>
                                            </div>*/}


                                            <div className="col-md-12 col-12 mt-4">
                                                <label htmlFor="select-url">Select Url</label>
                                                <select className="custom-select mt-3" id="select-url"
                                                        //disabled={!this.state.isPlatformSelected}
                                                        onChange={(value) => this.selectUrl(value)}
                                                        defaultValue=""
                                                >
                                                    <option disabled value="">Select Url</option>
                                                    {this.state.linkedAccounts.map((t, i) =>
                                                        <option value={t.id_word_press_account} key={i}>
                                                            {t.word_press_url}
                                                        </option>
                                                    )}
                                                </select>

                                                {this.state.linkedAccounts.length === 0?
                                                    <div className=""
                                                         style={{color: "#6480b7", marginTop: "5px", fontSize: "10px"}}>
                                                        You can add URLs from "Websites" tab
                                                    </div>
                                                    :
                                                    ""
                                                }


                                            </div>


                                            <div className="col-md-12 col-12 mt-4">
                                                <label>Export as</label>

                                                <div className="custom-control custom-radio mb-2">
                                                    <input type="radio" id="customRadio1" name="customRadio"
                                                           className="custom-control-input"
                                                           value="post"
                                                           disabled={!this.state.isUrlSelected}
                                                           onChange={(value) => this.selectTypeofExport(value)}
                                                    />
                                                    <label className="custom-control-label"
                                                           htmlFor="customRadio1">Export as post</label>
                                                </div>
                                                <div className="custom-control custom-radio mb-2">
                                                    <input type="radio" id="customRadio2" name="customRadio"
                                                           className="custom-control-input" value="page"
                                                           disabled={!this.state.isUrlSelected}
                                                           onChange={(value) => this.selectTypeofExport(value)}
                                                    />
                                                    <label className="custom-control-label"
                                                           htmlFor="customRadio2">Export as page</label>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </CardBody>

                        </Card>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.submitExportsModal}
                                disabled={!this.state.isTypeOfExportSelected}
                        >
                            Export
                        </Button>
                        <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                    </ModalFooter>
                </Modal>


                <SweetAlert show={this.state.showConfirmExportModal}
                            custom
                            showCancel
                            confirmBtnText="Yes"
                            cancelBtnText="No"
                            confirmBtnBsStyle="primary"
                            cancelBtnBsStyle="default"
                            warning
                            title={<p className="sweet-alert-title">Are you sure you want to export</p>}
                            onConfirm={this.onConfirmExportsConfirmModal}
                            onCancel={this.onCancelExportsConfirmModal}
                >
                    {this.state.doc.title}
                </SweetAlert>


                <SweetAlert show={this.state.showExportedSuccessAlert} success
                            title={<p className="sweet-alert-title">{this.state.doc.title}</p>}
                            onConfirm={this.onCloseSuccessfulExport}>
                    Has Been Successfully Exported
                </SweetAlert>

                <NotificationContainer/>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    return ({
        allUserInfo: state.selfReducers.profile,
        token: state.selfReducers.serverToken,
        canExport: state.selfReducers.profile.can_export
    })
};


export default withRouter(connect(mapStateToProps)(Documents));
// export default Documents;
