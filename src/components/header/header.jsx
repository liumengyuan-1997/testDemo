import React, { Component } from "react";
import "./header.css";
import { formateDate } from "../../utils/dataUtils";
import { withRouter } from "react-router-dom";
import menuList from "../../config/menuConfig";
import { Popconfirm, Button, Modal } from "antd";
import storageUtils from "../../utils/storageUtils";
const { confirm } = Modal;
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTime: formateDate(Date.now()),
    };
  }
  // 获取当前时间,用定时器将其时间每隔一秒执行一次，就相当于时间再跑，最后不要忘记让函数调动起来，执行定时器
  componentDidMount() {
    this.getTime();
  }
  getTime = () => {
    setInterval(() => {
      const currentTime = formateDate(Date.now());
      this.setState({
        currentTime: currentTime,
      });
    }, 1000);
  };
  // 获取当前位置
  getTitle = () => {
    const path = this.props.location.pathname;
    let title;
    menuList.forEach((item) => {
      if (item.key === path) {
        title = item.title;
      } else if (item.children) {
        const cItem = item.children.find(
          (cItem) => path.indexOf(cItem.key) == 0
        );
        if (cItem) {
          title = cItem.title;
        }
      }
    });
    return title;
  };
  // 退出登录
  loginout = () => {
    Modal.confirm({
      content: "确定退出吗?",
      onOk: () => {
        console.log("OK", this);
        // 删除保存的user数据
        storageUtils.removeUser();
        // 跳转到login
        this.props.history.replace("/login");
      },
    });
  };
  render() {
    const { currentTime } = this.state;
    //
    const title = this.getTitle();
    return (
      <div className="header">
        <span>当前时间:{currentTime}</span>
        <span>当前位置:{title}</span>
        <Button type="primary" onClick={this.loginout}>
          退出登录
        </Button>
      </div>
    );
  }
}
// 高阶组件不能忘记
export default withRouter(Header);
