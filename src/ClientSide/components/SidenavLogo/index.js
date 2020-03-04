import React from 'react';
import {MINI_DRAWER} from "constants/ActionTypes";
import docPressLogoWhite from '../../../assets/images/docpress_white.png';
import docPressLogoBlue from '../../../assets/images/docpress_blue.png';

const SidenavLogo = ({drawerType}) => {

    const showMini = drawerType.includes(MINI_DRAWER);

    return (
        <div className="sidebar-header d-flex align-items-center">
            {showMini ?
                <div className="mini-logo">
                    <img className="mini-logo-img" alt='...' src='http://via.placeholder.com/32x32'/>
                    <img className="mini-logo-img-hover" alt='...' src={docPressLogoWhite}/>
                    {/*<img className="mini-logo-img-hover" alt='...' src='http://via.placeholder.com/105x36'/>*/}
                </div> : <img alt='...' src={docPressLogoWhite} style={{height: "45px", marginLeft: "35px"}}/>
                // </div> : <img alt='...' src='http://via.placeholder.com/105x36'/>
            }
        </div>
    );
};

export default SidenavLogo;
