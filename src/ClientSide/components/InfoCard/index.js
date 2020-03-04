import React from 'react';


const InfoCard = ({data, styleName, iconType}) => {
    return (
        <div className={`jr-card net-chart`}>
            <div className={`jr-card-thumb  ${styleName}`}>
                <i className={`zmdi ${iconType}`}/>
            </div>
            <div className="jr-card-body br-break">
                <h4 className="mb-0"><strong>{data.title}</strong></h4>
                <p className="mb-0">{data.subTitle} </p>
            </div>

        </div>
    );
};

export default InfoCard;
InfoCard.defaultProps = {
    styleName: ''
};