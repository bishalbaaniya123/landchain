import React from 'react';
import {MINI_DRAWER} from "constants/ActionTypes";
import LandChainLogo from '../../assets/images/Landchain/LogoMain.png';

const SidenavLogo = ({drawerType}) => {

    const showMini = drawerType.includes(MINI_DRAWER);

    return (
        <div className="sidebar-header d-flex align-items-center">
            {showMini ?
                <div className="mini-logo">
                    <img className="mini-logo-img" alt='...' src='http://via.placeholder.com/32x32'/>
                    <img className="mini-logo-img-hover" alt='...' src={LandChainLogo}/>
                </div> :
                <img alt='...' src={LandChainLogo} style={{height: "49px", marginLeft: "30px", width: "75%"}}/>
            }
        </div>
    );
};

export default SidenavLogo;
