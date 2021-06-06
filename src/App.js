import React, { Component } from "react";
import "antd/dist/antd.css";
import { Route } from "react-router-dom";
import Admin from "./pages/admin/admin";
import Login from "./pages/login/login";
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <>
        <Route path="/login" component={Login} />
        <Route path="/" component={Admin} />
      </>
      // exact精准定位，此处不能加
      // 但是如果每次书写路由的话都需要严格控制书写路由顺序的话那代码真的很不优雅，那有没有好的解决办法呢？那肯定必须是有的，官方给我们提供了exact，就是精准匹配。
    );
  }
}

export default App;
