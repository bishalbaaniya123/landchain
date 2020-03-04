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
const dataPieChart = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300}];

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
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

// end area chart


class SamplePage extends React.Component {

    render() {
        return (
            <div className="app-wrapper">
                <div className="animated slideInUpTiny animation-duration-3">
                    <ContainerHeader match={this.props.match} title={
                        "Dashboard"}/>
                    <div className="row">
                        <div className="col-lg-4 col-sm-6 col-12">
                            <ChartCard styleName="bg-secondary text-white border-0">
                                <div className="chart-title">
                                    <h2>300</h2>
                                    <p>TOTAL USERS</p>
                                </div>

                                <ResponsiveContainer width="100%" height={80}>
                                    <BarChart data={data}>
                                        <Bar dataKey="pv" fill="white"/>
                                        <Bar dataKey="uv" fill="white"/>
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>

                        <div className="col-lg-4 col-sm-6 col-12">
                            <ChartCard styleName="bg-primary text-white border-0">
                                <div className="chart-title">
                                    <h2>250</h2>
                                    <p>TRIAL USERS</p>
                                </div>

                                <ResponsiveContainer width="100%" height={80}>
                                    <AreaChart data={data1} margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                        <Area type="monotone" dataKey="pv" stroke="rgba(255,255,255,0.5)"
                                              activeDot={{r: 8}}
                                              fillOpacity={.5}
                                              fill="white"/>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>

                        <div className="col-lg-4 col-sm-6 col-12">
                            <ChartCard styleName="bg-teal lighten-1 text-white border-0">
                                <div className="chart-title">
                                    <h2>50</h2>
                                    <p>PRO USERS</p>
                                </div>


                                <ResponsiveContainer width="100%" height={80}>
                                    <LineChart data={data2}>
                                        <Line type="monotone" dataKey="uv" stroke="#ffffff" activeDot={{r: 8}}/>
                                        <Line type="monotone" dataKey="pv" stroke="#ffffff"/>
                                        <Line type="monotone" dataKey="amt" stroke="#ffffff"/>
                                    </LineChart>
                                </ResponsiveContainer>

                            </ChartCard>
                        </div>

                        <div className="col-lg-4 col-sm-6 col-12">
                            <ChartCard styleName="bg-blue text-white border-0">
                                <div className="chart-title">
                                    <h2>950</h2>
                                    <p>TOTAL EXPORTS</p>
                                </div>

                                <ResponsiveContainer width="100%" height={80}>
                                    <LineChart data={data1}>
                                        <Line dataKey="uv" stroke="#ffffff" activeDot={{r: 8}}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>

                        <div className="col-lg-4 col-sm-6 col-12">
                            <ChartCard styleName="bg-red text-white border-0">
                                <div className="chart-title">
                                    <h2>$300</h2>
                                    <p>TOTAL REVENUE</p>
                                </div>

                                <ResponsiveContainer width="100%" height={80}>
                                    <LineChart data={data1}>
                                        <Line dataKey="uv" stroke="#ffffff" activeDot={{r: 8}}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>

                        <div className="col-lg-4 col-sm-6 col-12">
                            <ChartCard styleName="bg-purple text-white border-0">
                                <div className="chart-title">
                                    <h2>300</h2>
                                    <p>TOTAL URLS</p>
                                </div>

                                <ResponsiveContainer width="100%" height={80}>
                                    <LineChart data={data1}>
                                        <Line dataKey="uv" stroke="#ffffff" activeDot={{r: 8}}/>
                                    </LineChart>
                                </ResponsiveContainer>
                            </ChartCard>
                        </div>
                    </div>


                    {/*<div className="animated slideInUpTiny animation-duration-3">
                        <ContainerHeader title={<IntlMessages id="chart.bar"/>} match={match}/>

                        <div className="row">
                            <CardBox heading="Stacked Bar Chart">
                                <StackedBarChart/>
                            </CardBox>
                        </div>
                    </div>*/}

                    <div className="row">
                        <div className="col-md-6 col-lg-6 col-sm-12 single-chart-wrapper">
                            <div>
                                <h1>Chart Title</h1>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart width={600} height={300} data={data}
                                          margin={{top: 20, right: 30, left: 20, bottom: 5}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Bar dataKey="pv" stackId="a" fill="#8884d8"/>
                                    <Bar dataKey="uv" stackId="a" fill="#82ca9d"/>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="col-md-6 col-lg-6 col-sm-12 single-chart-wrapper">
                            <div>
                                <h1>Chart Title</h1>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
                                    <Pie
                                        data={dataPieChart}
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                    >
                                        {
                                            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
                                        }
                                    </Pie>
                                    <Tooltip/>
                                    <Legend/>
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="col-md-6 col-lg-6 col-sm-12 single-chart-wrapper">
                            <div>
                                <h1>Chart Title</h1>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart width={600} height={300} data={data}
                                           margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <Tooltip/>
                                    <Legend/>
                                    <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="col-md-6 col-lg-6 col-sm-12 single-chart-wrapper">
                            <div>
                                <h1>Chart Title</h1>
                            </div>
                            <ResponsiveContainer width="100%" height={250}>
                                <AreaChart width={600} height={400} data={dataAreaChart}
                                           margin={{top: 10, right: 30, left: 0, bottom: 0}}>
                                    <CartesianGrid strokeDasharray="3 3"/>
                                    <XAxis dataKey="name"/>
                                    <YAxis/>
                                    <Tooltip/>
                                    <Area type='monotone' dataKey='uv' stroke='#8884d8' fill='#8884d8'/>
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="row other-info-dashboard">
                        <div className="col-xl-3 col-lg-6 col-md-3 col-sm-6 col-12">
                            <InfoCard data={cardData} styleName="bg-secondary" iconType="zmdi-comments"/>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-3 col-sm-6 col-12">
                            <InfoCard data={cardData1} styleName="bg-cyan darken-1" iconType="zmdi-notifications-none"/>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-3 col-sm-6 col-12">
                            <InfoCard data={cardData2} styleName="bg-primary" iconType="zmdi-account-o"/>
                        </div>
                        <div className="col-xl-3 col-lg-6 col-md-3 col-sm-6 col-12">
                            <InfoCard data={cardData3} styleName="bg-red darken-1" iconType="zmdi-alert-circle"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SamplePage;