import React from 'react';
import '../../../../styles/self-added/index.css';
import ChartCard from '../../../../components/dashboard/Common/ChartCard';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ContainerHeader from '../../../../components/ContainerHeader';

import {connect} from 'react-redux';
import {Button} from 'reactstrap';
import {
    ABOVE_THE_HEADER,
    BELOW_THE_HEADER,
    COLLAPSED_DRAWER,
    FIXED_DRAWER,
    HORIZONTAL_NAVIGATION
} from 'constants/ActionTypes';
import {isIOS, isMobile} from 'react-device-detect';


import Sidebar from "containers/SideNav/index";
import TopNav from 'components/TopNav';
import Header from "components/Header";
import {withRouter} from "react-router-dom";
import $ from "jquery";

import api from 'ClientSide/routes/Applied/app/api/index'


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


const dataStackedChart = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

// pie chart
const dataPieChart = [{name: 'Free', value: 400}, {name: 'Paid', value: 300}];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
// end pie chart

// line chart
const dataLineChart = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];
// end line chart

// area chart
const dataAreaChart = [
    {time: 'Jan', revenue: 4000},
    {time: 'Feb', revenue: 3000},
    {time: 'Mar', revenue: 2000},
    {time: 'Page D', revenue: 2780},
    {time: 'Page E', revenue: 1890},
    {time: 'Page F', revenue: 2390},
    {time: 'Page G', revenue: 3490},
];
/*
const dataAreaChart = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];
*/

// end area chart


class SamplePage extends React.Component {

    constructor() {
        super();
        this.state = {
            dataUsers: [
                {
                    "free_user": 40,
                    "trial_user": 43,
                    "time": "2005"
                },
                {time: 'Jan', free_user: 0, trial_user: 0},
                {time: 'Jan', free_user: 0, trial_user: 0},
                {time: 'Jan', free_user: 0, trial_user: 0},
                {time: 'Jan', free_user: 0, trial_user: 0},
                {time: 'Jan', free_user: 0, trial_user: 0},
            ],
            dataExports: [
                {time: 'Jan', stat: 10},
                {time: 'Feb', stat: 13},
                {time: 'Mar', stat: 98},
                {time: 'Let D', stat: 39},
                {time: 'Let E', stat: 48},
                {time: 'Let F', stat: 38},
                {time: 'Let G', stat: 0},
            ],
            monthOrYear: "Monthly",
            startYear: "2019",
            endYear: "2021",
            allStats: {
                stat_data_list: [
                    {
                        export: 131,
                        time: "2019",
                        free_user: 2,
                        paid_user: 4,
                        total_users: 6,
                        revenue: 4307,
                    }
                ]
            },
            totalUsers: null,
            totalExports: null,
            totalRevenue: null,
            showFilters: false,
            dataPieChart: [{name: 'Free', value: 0}, {name: 'Paid', value: 0}],
            currentLatestPlan: {
                planName: "",
                planDescription: "",
                trialDays: "",
                trialPrice: "",
                monthlyPrice: "",
            }
        };
    }


    componentDidMount() {
        $(".new-menu a").removeClass("active-menu");
        $("#dashboard-main-button-menu").addClass("active-menu");
        document.title = "Admin - Land";
        this.props.history.push({
            pathname: "/admin-docpress"
        });

        api.fetchAllStats(this.props.adminToken, (new Date()).getFullYear().toString())
            .then(result => {
                for (let i = 0; i < result.stat_data_list.length; i++) {
                    result.stat_data_list[i]['total_users'] = result.stat_data_list[i].free_user
                        + result.stat_data_list[i].paid_user
                        + result.stat_data_list[i].trial_user
                        + result.stat_data_list[i].canceled_user
                    ;
                }
                this.setState({
                    allStats: result,
                    totalUsers: result.total_user,
                    totalRevenue: result.total_revenue,
                    totalExports: result.total_export,
                    dataPieChart: [
                        {name: 'Free', value: result.total_free_user},
                        {name: 'Paid', value: result.total_paid_user},
                        {name: 'Trial', value: result.total_trial_user},
                        {name: 'Canceled', value: result.total_canceled_user},
                    ],
                })
            });

        api.getLatestActivePlan(this.props.adminToken)
            .then(result => {
                this.setState({
                    currentLatestPlan: {
                        planName: result.plan_name,
                        planDescription: result.plan_description,
                        trialDays: result.trial_time,
                        trialPrice: result.trial_price,
                        monthlyPrice: result.monthly_price,
                    }
                })
            });
    }

    selectMonthOrYear = (e) => {
        this.setState({
            monthOrYear: e.target.value,
        })
    };

    submitFilterOptions = (e) => {
        e.preventDefault();
        if (this.state.monthOrYear === "Monthly") {
            api.fetchAllStats(this.props.adminToken, this.state.startYear)
                .then(result => {
                    for (let i = 0; i < result.stat_data_list.length; i++) {
                        result.stat_data_list[i]['total_users'] = result.stat_data_list[i].free_user
                            + result.stat_data_list[i].paid_user
                            + result.stat_data_list[i].trial_user
                            + result.stat_data_list[i].canceled_user
                        ;
                    }
                    this.setState({
                        allStats: result,
                        totalUsers: result.total_user,
                        totalRevenue: result.total_revenue,
                        totalExports: result.total_export,
                        dataPieChart: [
                            {name: 'Free', value: result.total_free_user},
                            {name: 'Paid', value: result.total_paid_user},
                            {name: 'Trial', value: result.total_trial_user},
                            {name: 'Canceled', value: result.total_canceled_user},
                        ],
                    })
                });
        } else {
            api.fetchAllStats(this.props.adminToken, this.state.startYear, this.state.endYear)
                .then(result => {
                    for (let i = 0; i < result.stat_data_list.length; i++) {
                        result.stat_data_list[i]['total_users'] = result.stat_data_list[i].free_user
                            + result.stat_data_list[i].paid_user
                            + result.stat_data_list[i].trial_user
                            + result.stat_data_list[i].canceled_user
                        ;
                    }
                    this.setState({
                        allStats: result,
                        totalUsers: result.total_user,
                        totalRevenue: result.total_revenue,
                        totalExports: result.total_export,
                        dataPieChart: [
                            {name: 'Free', value: result.total_free_user},
                            {name: 'Paid', value: result.total_paid_user},
                            {name: 'Trial', value: result.total_trial_user},
                            {name: 'Canceled', value: result.total_canceled_user},
                        ],
                    })
                });
        }
    };


    toggleFilters = (param) => {
        if (param === "hide") {
            api.fetchAllStats(this.props.adminToken, (new Date()).getFullYear().toString())
                .then(result => {
                    for (let i = 0; i < result.stat_data_list.length; i++) {
                        result.stat_data_list[i]['total_users'] = result.stat_data_list[i].free_user
                            + result.stat_data_list[i].paid_user
                            + result.stat_data_list[i].trial_user
                            + result.stat_data_list[i].canceled_user
                        ;
                    }
                    this.setState({
                        allStats: result,
                        totalUsers: result.total_user,
                        totalRevenue: result.total_revenue,
                        totalExports: result.total_export,
                        dataPieChart: [
                            {name: 'Free', value: result.total_free_user},
                            {name: 'Paid', value: result.total_paid_user},
                            {name: 'Trial', value: result.total_trial_user},
                            {name: 'Canceled', value: result.total_canceled_user},
                        ],
                    })
                })
        }
        this.setState({
            showFilters: !this.state.showFilters,
        });
    };

    redirectToPlans = () => {
        this.props.history.push({
            pathname: "/admin-plans"
        })
    };

    render() {

        const {match, drawerType, navigationStyle, horizontalNavPosition} = this.props;
        const drawerStyle = drawerType.includes(FIXED_DRAWER) ? 'fixed-drawer' : drawerType.includes(COLLAPSED_DRAWER) ? 'collapsible-drawer' : 'mini-drawer';

        //set default height and overflow for iOS mobile Safari 10+ support.
        if (isIOS && isMobile) {
            document.body.classList.add('ios-mobile-view-height')
        } else if (document.body.classList.contains('ios-mobile-view-height')) {
            document.body.classList.remove('ios-mobile-view-height')
        }


        return (

            <div className={`app-container ${drawerStyle}`}>
                <Sidebar/>

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
                                    <ContainerHeader match={this.props.match} title={
                                        "Dashboard"}/>
                                    {this.state.showFilters ?
                                        <Button onClick={() => this.toggleFilters("hide")} color="danger">
                                            <i className="zmdi zmdi-filter-list"/>&nbsp;
                                            Hide Filters
                                        </Button>
                                        :
                                        <Button onClick={() => this.toggleFilters("show")} color="primary"
                                                className="show-filters-button"
                                        >
                                            <i className="zmdi zmdi-filter-list"/>&nbsp;
                                            Show Filters
                                        </Button>
                                    }
                                    {this.state.showFilters ?
                                        <div className="form-group">
                                            <form onSubmit={this.submitFilterOptions}>
                                                <div className="row" style={{marginBottom: "20px"}}>
                                                    <div className="col-md-4 col-4 mt-4">
                                                        <label htmlFor="select-plan-type">Time Basis</label>
                                                        <select className="custom-select mt-3" id="select-platform"
                                                                onChange={(value) => this.selectMonthOrYear(value)}
                                                                defaultValue={this.state.monthOrYear}
                                                        >
                                                            <option value="Monthly">Monthly</option>
                                                            <option value="Yearly">Yearly</option>
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4 col-4 mt-4">
                                                        <label htmlFor="select-plan-type">
                                                            {this.state.monthOrYear === "Monthly" ?
                                                                "Year"
                                                                :
                                                                "Start year"
                                                            }
                                                        </label>
                                                        <select className="custom-select mt-3" id="select-platform"
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        startYear: e.target.value
                                                                    })
                                                                }}
                                                                defaultValue={this.state.startYear}
                                                        >
                                                            <option value="2019">2019</option>
                                                            <option value="2020">2020</option>
                                                            <option value="2021">2021</option>
                                                        </select>
                                                    </div>
                                                    {this.state.monthOrYear === "Yearly" ?
                                                        <div className="col-md-4 col-4 mt-4">
                                                            <label htmlFor="select-plan-type">End Year</label>
                                                            <select className="custom-select mt-3" id="select-plan-type"
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            endYear: e.target.value
                                                                        })
                                                                    }}
                                                                    defaultValue={this.state.endYear}
                                                            >
                                                                <option value="2019">2019</option>
                                                                <option value="2020">2020</option>
                                                                <option value="2021">2021</option>
                                                            </select>
                                                        </div>
                                                        :
                                                        null
                                                    }
                                                </div>
                                                <Button color="primary">Submit</Button>
                                            </form>
                                        </div>
                                        :
                                        null
                                    }

                                    <div className="row">

                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <ChartCard styleName="bg-secondary text-white border-0">
                                                <div className="chart-title">
                                                    <h2>{this.state.totalUsers}</h2>
                                                    <p>TOTAL USERS</p>
                                                </div>

                                                <ResponsiveContainer width="100%" height={80}>
                                                    <BarChart data={this.state.allStats.stat_data_list}>
                                                        <Bar dataKey="total_users" fill="white"/>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </ChartCard>
                                        </div>

                                        <div className="col-lg-4 col-sm-6 col-12">
                                            <ChartCard styleName="bg-blue text-white border-0">
                                                <div className="chart-title">
                                                    <h2>{this.state.totalExports}</h2>
                                                    <p>TOTAL EXPORTS</p>
                                                </div>

                                                <ResponsiveContainer width="100%" height={80}>
                                                    <LineChart data={this.state.allStats.stat_data_list}>
                                                        <Line dataKey="export" stroke="#ffffff"
                                                              activeDot={{r: 8}}/>
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </ChartCard>
                                        </div>

                                        <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                                            <div className="card" style={{
                                                height: "164px",
                                                background: "blueviolet",
                                                border: "blueviolet"
                                            }}>
                                                <div className="chart-header">
                                                    <div className="chart-title">
                                                        <h2>
                                                            Current Plan
                                                            <a href="javascript:;" className="change-plan-a"
                                                               onClick={this.redirectToPlans}
                                                            >
                                                                (Change)
                                                            </a>
                                                        </h2>
                                                        <p className="no-overflow-paragraph plan-name">
                                                            {this.state.currentLatestPlan.planName}
                                                        </p>
                                                        <div className="row">
                                                            <div className="col-4">
                                                                Trial Days: {this.state.currentLatestPlan.trialDays}
                                                            </div>
                                                            <div className="col-4">
                                                                Trial Price: ${this.state.currentLatestPlan.trialPrice}
                                                            </div>
                                                            <div className="col-4">
                                                                Monthly Price:
                                                                ${this.state.currentLatestPlan.monthlyPrice}
                                                            </div>
                                                            <div className="col-12">
                                                                <p className="no-overflow-paragraph plan-description    ">
                                                                    {this.state.currentLatestPlan.planDescription}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/*
                                        <div className="col-lg-4 col-md-12 col-sm-12 col-12">
                                            <ChartCard styleName="bg-red text-white border-0">
                                                <div className="chart-title">
                                                    <h2>${this.state.totalRevenue}</h2>
                                                    <p>TOTAL REVENUE</p>
                                                </div>

                                                <ResponsiveContainer width="100%" height={80}>
                                                    <LineChart data={this.state.allStats.stat_data_list}>
                                                        <Line dataKey="revenue" stroke="#ffffff" activeDot={{r: 8}}/>
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </ChartCard>
                                        </div>
*/}
                                    </div>

                                    <div className="row" style={{marginBottom: "55px", padding: "10px"}}>
                                        <div className="col-md-6 col-lg-6 col-sm-12 single-chart-wrapper">
                                            <div>
                                                <h1>Users</h1>
                                            </div>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <BarChart width={600} height={300}
                                                          data={this.state.allStats.stat_data_list}
                                                          margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                                    <CartesianGrid strokeDasharray="3 3"/>
                                                    <XAxis dataKey="time"/>
                                                    <YAxis/>
                                                    <Tooltip/>
                                                    <Legend/>
                                                    <Bar dataKey="free_user" stackId="a" fill="#0c86fa"/>
                                                    <Bar dataKey="paid_user" stackId="a" fill="#48c59f"/>
                                                    <Bar dataKey="trial_user" stackId="a" fill="#ffbc3c"/>
                                                    <Bar dataKey="canceled_user" stackId="a" fill="#fb7f41"/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="col-md-6 col-lg-6 col-sm-12 single-chart-wrapper">
                                            <div>
                                                <h1>Users Pie Chart</h1>
                                            </div>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                                                    <Pie
                                                        data={this.state.dataPieChart}
                                                        labelLine={false}
                                                        label={renderCustomizedLabel}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        nameKey="name"
                                                        dataKey="value"
                                                    >
                                                        {
                                                            this.state.dataPieChart.map((entry, index) => <Cell
                                                                key={index}
                                                                fill={COLORS[index % COLORS.length]}/>)
                                                        }
                                                    </Pie>
                                                    <Tooltip/>
                                                    <Legend/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="col-md-12 col-lg-12 col-sm-12 single-chart-wrapper">
                                            <div>
                                                <h1>Exports</h1>
                                            </div>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <LineChart width={600} height={300}
                                                           data={this.state.allStats.stat_data_list}
                                                           margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                                    <XAxis dataKey="time"/>
                                                    <YAxis/>
                                                    <CartesianGrid strokeDasharray="3 3"/>
                                                    <Tooltip/>
                                                    <Legend/>
                                                    <Line type="monotone" dataKey="export" stroke="#8884d8"
                                                          activeDot={{r: 8}}/>
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                        {/*<div className="col-md-6 col-lg-6 col-sm-12 single-chart-wrapper">
                                            <div>
                                                <h1>Revenue</h1>
                                            </div>
                                            <ResponsiveContainer width="100%" height={250}>
                                                <AreaChart width={600} height={400}
                                                           data={this.state.allStats.stat_data_list}
                                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                                    <CartesianGrid strokeDasharray="3 3"/>
                                                    <XAxis dataKey="time"/>
                                                    <YAxis/>
                                                    <Tooltip/>
                                                    <Area type='monotone' dataKey='revenue' stroke='#8884d8'
                                                          fill='#8884d8'/>
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>


        );
    }
}


const mapStateToProps = (state) => {
    const {drawerType, navigationStyle, horizontalNavPosition} = state.settings;
    if (state.selfReducers) {
        if (state.selfReducers.adminToken) {
            return {
                adminToken: state.selfReducers.adminToken,
                drawerType, navigationStyle, horizontalNavPosition
            }
        } else {
            return {drawerType, navigationStyle, horizontalNavPosition}
        }
    } else {
        return {drawerType, navigationStyle, horizontalNavPosition}
    }
};
export default withRouter(connect(mapStateToProps)(SamplePage));
// export default Documents;