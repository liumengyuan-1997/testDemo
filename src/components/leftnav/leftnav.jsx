import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from "antd";
import menuList from "../../config/menuConfig";
import storageUtils from "../../utils/storageUtils";
const { SubMenu } = Menu;
// 左侧导航的组件
class Leftnav extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {};
  // }

  // 判断当前登陆用户对item是否有权限
  hasAuth = (item) => {
    const { key, isPublic } = item;
    const menus = storageUtils.getUser().role.menus;
    const username = storageUtils.getUser().username;
    /*
    1. 如果当前用户是admin
    2. 如果当前item是公开的
    3. 当前用户有此item的权限: key有没有menus中
     */
    if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      // 4. 如果当前用户有此item的某个子item的权限
      return !!item.children.find((child) => menus.indexOf(child.key) !== -1);
    }
    return false;
  };

  getMenunodes = (menuList) => {
    // class类中this
    // console.log(this.props);
    const path = this.props.location.pathname;
    //获取当前的路径
    return menuList.map((item) => {
      if (this.hasAuth(item)) {
        // 如果没有就返回一级
        if (!item.children) {
          return (
            <Menu.Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon} />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          );
        } else {
          // 如果有下拉菜单（二级路由
          // 获取当前的路径，然后循环遍历item.children，如果找到有，获取当前item.children的父元素的key值
          // console.log(path);
          const cItem = item.children.find((item) => item.key == path);
          //循环item.children，需要找一下有没有当前路径对应的项，如果找到
          // 说明需要展开这个子菜单的父菜单
          console.log(cItem);
          if (cItem) {
            this.openKey = item.key;
          }
          // 有下拉菜单（二级路由
          return (
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon} />
                  <span>{item.title}</span>
                </span>
              }
            >
              {this.getMenunodes(item.children)}
            </SubMenu>
          );
        }
      }
    });
  };
  componentDidMount() {
    // console.log(this.getMenunodes(menuList));
  }
  componentWillMount() {
    // 在页面渲染之前就已经拿到数据了，这时候的openKey是可以使用的
    this.getNodes = this.getMenunodes(menuList);
  }
  render() {
    //   获取到当前路由的路径名字

    let path = this.props.location.pathname;
    //
    if (path.indexOf("/product") === 0) {
      path = "/product";
    }
    const openKey = this.openKey;
    // 拿不到openkey  用componentWillMount
    console.log(openKey);
    return (
      <div style={{ width: "100%" }}>
        <Menu
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          {/* {this.getMenunodes(menuList)} */}
          {this.getNodes}
        </Menu>
      </div>
    );
  }
}

export default withRouter(Leftnav);
