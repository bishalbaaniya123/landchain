import React from 'react';
import CardBox from '../../../../components/CardBox';
import OrderTable from '../../../../components/dashboard/eCommerce/OrderTable';
import IntlMessages from '../../../../util/IntlMessages';

const BasicTables = () => {
    return (
        <div className="app-wrapper">
            <div className="animated slideInUpTiny animation-duration-3">
                <div className="row">
                    <CardBox styleName="col-12" cardStyle="p-0 overflow-hidden"
                             heading={"Users"}
                             headerOutside>
                        <div className="row">
                            <div className="col-12">
                                <div className="jr-card">
                                    <div className="jr-card-header d-flex align-items-center">
                                        <h3 className="mb-0"><IntlMessages id="table.recentOrders"/></h3>
                                        <div className="ml-3">
                                <span className="text-white badge badge-success">
                                    <IntlMessages id="table.dataTable"/></span>
                                        </div>
                                    </div>
                                    <OrderTable/>
                                </div>
                            </div>
                        </div>
                    </CardBox>
                </div>
            </div>
        </div>
    );
};

export default BasicTables;

