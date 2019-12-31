import React, { Component } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";

import CustomScrollbars from "util/CustomScrollbars";
import SidebarLogo from "./SidebarLogo";

import Auxiliary from "util/Auxiliary";
import UserProfile from "./UserProfile";
// import AppsNavigation from "./AppsNavigation";
import {
  NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  THEME_TYPE_LITE
} from "../../constants/ThemeSetting";
import IntlMessages from "../../util/IntlMessages";
import { connect } from "react-redux";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;


class SidebarContent extends Component {

  getNoHeaderClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR || navStyle === NAV_STYLE_NO_HEADER_EXPANDED_SIDEBAR) {
      return "gx-no-header-notifications";
    }
    return "";
  };
  getNavStyleSubMenuClass = (navStyle) => {
    if (navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR) {
      return "gx-no-header-submenu-popup";
    }
    return "";
  };

  render() {
    const { themeType, navStyle, pathname } = this.props;
    const selectedKeys = pathname.substr(1);
    const defaultOpenKeys = selectedKeys.split('/')[1];
    return (
      <Auxiliary>
        <SidebarLogo />
        <div className="gx-sidebar-content">
          <div className={`gx-sidebar-notifications ${this.getNoHeaderClass(navStyle)}`}>
            <UserProfile />
            {/* <AppsNavigation /> */}
          </div>
          <CustomScrollbars className="gx-layout-sider-scrollbar">
            <Menu
              defaultOpenKeys={[defaultOpenKeys]}
              selectedKeys={[selectedKeys]}
              theme={themeType === THEME_TYPE_LITE ? 'lite' : 'dark'}
              mode="inline">

              <MenuItemGroup key="main" className="gx-menu-group" title={<IntlMessages id="sidebar.main" />}>
                <SubMenu key="dashboard" className={this.getNavStyleSubMenuClass(navStyle)}
                  title={<span> <i className="icon icon-dasbhoard" />
                    <IntlMessages id="sidebar.dashboard" /></span>}>
                  <Menu.Item key="principal/dashboard/general">
                    <Link to="/principal/dashboard/general">
                      {/* <i className="icon icon-table-general" /> */}
                      <IntlMessages id="sidebar.dashboard.general" />
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="principal/dashboard/carteras">
                    <Link to="/principal/dashboard/carteras">
                      {/* <i className="icon icon-crm" /> */}
                      <IntlMessages id="sidebar.dashboard.carteras" />
                    </Link>
                  </Menu.Item>
                </SubMenu>
              </MenuItemGroup>

            </Menu>
          </CustomScrollbars>
        </div>
      </Auxiliary>
    );
  }
}

SidebarContent.propTypes = {};
const mapStateToProps = ({ settings }) => {
  const { navStyle, themeType, locale, pathname } = settings;
  return { navStyle, themeType, locale, pathname }
};
export default connect(mapStateToProps)(SidebarContent);

