import React, { Component } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { Layout } from "antd";
import StoreUtils from "../../utils/storageUtils";

import Header from "../../components/header/header";

import Leftnav from "../../components/leftnav/leftnav";
import Home from "../home/home";
import Product from "../product/product";
import Category from "../category/category";
import Role from "../role/role";
import User from "../user/user";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import Order from "../order/order";

const { Footer, Sider, Content } = Layout;
class Admin extends Component {
  state = {};

  render() {
    const user = StoreUtils.getUser() || "";
    // console.log(user);
    if (!user) {
      // 如果不存在的话，跳到登陆页面
      return <Redirect to="/login" />;
    }
    return (
      <Layout>
        <Sider>
          <Leftnav />
        </Sider>
        <Layout>
          <Header />
          <Content>
            <Switch>
              <Route path="/home" component={Home} />
              <Route path="/product" component={Product} />
              <Route path="/category" component={Category} />
              <Route path="/role" component={Role} />
              <Route path="/user" component={User} />
              <Route path="/charts/bar" component={Bar} />
              <Route path="/charts/line" component={Line} />
              <Route path="/charts/pie" component={Pie} />
              <Route path="/order" component={Order} />
              <Redirect to="/home" from="/" />
            </Switch>
          </Content>
          <Footer>土购网</Footer>
        </Layout>
      </Layout>
    );
  }
}

export default Admin;
