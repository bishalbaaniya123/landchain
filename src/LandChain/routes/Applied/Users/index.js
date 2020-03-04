import React from 'react';
import '../../../../styles/self-added/index.css';
import {cardData, cardData1, cardData2, cardData3, data1, expanseData1} from '../../dashboard/routes/data'
import {data, data2, radarChartData} from '../../dashboard/routes/ECommerce/data'
import {chartData, lineChartData, pieChartData} from '../../dashboard/routes/News/data';
import ReportBox from '../../../../components/ReportBox';
import ChartCard from '../../../../components/dashboard/Common/ChartCard';
import CardHeader from '../../../../components/dashboard/default/CardHeader';
import InfoCard from '../../../../components/InfoCard';
import {
    YAxis,
    Area,
    AreaChart,
    Bar,
    Legend,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    PolarGrid,
    PolarRadiusAxis,
    Radar,
    RadarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
} from 'recharts';
import ContainerHeader from '../../../../components/ContainerHeader';
import IntlMessages from '../../../../util/IntlMessages';
import MonthlyRevenue from "app/routes/dashboard/routes/Intranet";
import CardBox from "components/CardBox";
import StackedBarChart from "app/routes/charts/routes/bar/Components/StackedBarChart";
import {dataExports, dataUsers} from "app/routes/dashboard/routes/ECommerce/data";

import {connect} from 'react-redux';
import {
    ABOVE_THE_HEADER,
    BELOW_THE_HEADER,
    COLLAPSED_DRAWER,
    FIXED_DRAWER,
    HORIZONTAL_NAVIGATION
} from 'constants/ActionTypes';
import {isIOS, isMobile} from 'react-device-detect';


import Sidebar from "LandChain/containers/SideNav/index";
import TopNav from 'components/TopNav';
import Footer from 'components/Footer';
import Header from "components/Header";
import {withRouter} from "react-router-dom";
import $ from "jquery";

import api from 'ClientSide/routes/Applied/app/api/index'
import Moment from "app/routes/Applied/Users/UsersTable";
import ReactTable from "react-table";
import UserDetails from './UserDetails';


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
        };
    }


    componentDidMount() {
        $(".new-menu a").removeClass("active-menu");
        $("#users-tab").addClass("active-menu");
        document.title = "Admin - Users";

        this.props.history.push({
            pathname: "/users"
        });

        /* api.data()
             .then(result => {
                 this.setState({
                     dataUsers: result
                 })
             });

         api.exportsStatsData()
             .then(result => {
                 this.setState({
                     dataExports: result
                 })

             })*/
    }

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
                                    <CardBox styleName="col-12" cardStyle="p-0 overflow-hidden"
                                             heading={"Users"}
                                             headerOutside>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="jr-card">
                                                    <div className="jr-card-header d-flex align-items-center">
                                                        {/*<h3 className="mb-0">Users</h3>*/}
                                                        {/*<div className="ml-3">
                                                                <span className="text-white badge badge-success">
                                                                    Data Table
                                                                </span>
                                                            </div>*/}
                                                    </div>
                                                    <UserDetails/>
                                                </div>
                                            </div>
                                        </div>
                                    </CardBox>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>


        );
    }
}


const mapStateToProps = ({settings}) => {

    const {drawerType, navigationStyle, horizontalNavPosition} = settings;
    return {drawerType, navigationStyle, horizontalNavPosition}
};
export default withRouter(connect(mapStateToProps)(SamplePage));
// export default Documents;