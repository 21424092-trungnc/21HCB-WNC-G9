import React, { Component } from "react";
// import { Link, NavLink } from 'react-router-dom';
import {
  /* Badge, */ UncontrolledDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav /*, NavItem*/,
} from "reactstrap";
import PropTypes from "prop-types";

import {
  /*AppAsideToggler, AppNavbarBrand, */ AppSidebarToggler,
} from "@coreui/react";
// import logo from '../../assets/img/brand/logo.j'
// import sygnet from '../../assets/img/brand/sygnet.png'

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {
    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    // User's auth
    const { userAuth, customerAuth } = window._$g;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar></Nav>
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <span className="none767 mr-3">
                {userAuth
                  ? `${userAuth.user_name} - ${userAuth._fullname()}`
                  : customerAuth
                  ? `${customerAuth.user_name} - ${customerAuth._fullname()}`
                  : ""}
              </span>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem onClick={(e) => this.props.onChangePassword(e)}>
                <i className="fa fa-key"></i> Thay đổi mật khẩu
              </DropdownItem>
              <DropdownItem onClick={(e) => this.props.onLogout(e)}>
                <i className="fa fa-lock"></i> Đăng xuất
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
