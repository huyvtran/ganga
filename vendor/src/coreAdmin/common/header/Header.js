import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';

import './Header.css';
import Rightsidebar from '../rightSidebar/Rightsidebar.js';

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {

    }
  }
  componentDidMount() { }
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
  }
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }
  logout() {
    var token = localStorage.removeItem("user_ID");
    if (token !== null) {
      this.setState({
        loggedIn: false
      })
    }
  }
  render() {
    return (
      <div>
        <header className="headerPage">
          <div className="">
            <div id="sidebarCollapse" className="col-lg-1 col-md-1 col-sm-1 col-xs-1 hover sidebarCollapse ">
              <i className="fa fa-bars headicon"></i>
            </div>
          </div>
          <div className="col-lg-6 col-md-8 col-sm-8 col-xs-8 pull-right">
            <div className="row">
              <div onClick={this.openNav.bind(this)} className="col-lg-1 col-md-1 col-sm-1 col-xs-1 pull-right">
                <i className="fa fa-cogs headicon "></i>
              </div>
              <div className="col-lg-2 col-md-2 col-sm-6 col-xs-6 pull-right">
                <span className="pull-right">
                  <a className="profileTitle btnpadd" href="/login">
                    <button type="button" className="btn  profilebtn" onClick={this.logout.bind(this)}>Logout</button>
                  </a>
                </span>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-1 col-xs-1 pull-right text-right">
                {localStorage.getItem('userName') != 'undefined' ? localStorage.getItem('userName') : ""}
                &nbsp; &nbsp;
                <i className="fa fa-user  headicon "></i>
              </div>
            </div>
          </div>
        </header>
        <div id="mySidenav" className="sidenav">
          <a href="javascript:void(0)" className="closebtn" onClick={this.closeNav.bind(this)} >&times;</a>
          <Rightsidebar />
        </div>
      </div>
    );
  }
}
