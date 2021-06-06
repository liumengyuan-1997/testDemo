import React, { PureComponent } from "react";
import { Form, Input, Tree } from "antd";
import PropTypes from "prop-types";
import menuList from "../../config/menuConfig";
// 添加分类的form组件
const { TreeNode } = Tree;
export default class AuthForm extends PureComponent {
  // 接收父组件传参
  static propTypes = {
    role: PropTypes.object,
  };
  constructor(props) {
    super(props);
    // 根据传入角色的menus生成初始状态
    const { menus } = this.props.role;
    this.state = {
      checkedKeys: menus,
    };
  }

  //***为父组件提交获取最新menus数据的方法
  getMenus = () => this.state.checkedKeys;
  // 获取树结构
  // 递归
  // reduce
  getTreeNodes = (menuList) => {
    console.log(menuList);
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode title={item.title} key={item.key}>
          {item.children ? this.getTreeNodes(item.children) : null}
        </TreeNode>
      );
      return pre;
    }, []);
  };

  // 选中某个node时的回调
  onCheck = (checkedKeys) => {
    console.log("onCheck", checkedKeys);
    // 选中后立即反馈已选中
    this.setState({ checkedKeys });
  };

  // 挂载之前拿数据
  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList);
  }
  // 根据新传入的role来更新checkedKeys状态
  /*
  当组件接收到新的属性时自动调用 每次点开就能获取当前的信息
   */
  componentWillReceiveProps(nextProps) {
    console.log("componentWillReceiveProps()", nextProps);
    const menus = nextProps.role.menus;
    this.setState({
      checkedKeys: menus,
    });
    // this.state.checkedKeys = menus
  }
  render() {
    const { role } = this.props;
    const { checkedKeys } = this.state;
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 }, // 左侧label的宽度
      wrapperCol: { span: 15 }, // 右侧包裹的宽度
    };
    // defaultExpandAll 默认展开所有树节点
    // checkedKeys  （受控）选中复选框的树节点
    return (
      <div>
        <Form {...formItemLayout}>
          <Form.Item label="角色名称">
            <Input value={role.name} disabled />
          </Form.Item>
        </Form>

        <Tree
          checkable
          checkedKeys={checkedKeys}
          defaultExpandAll={true}
          onCheck={this.onCheck}
        >
          <TreeNode title="平台权限" key="all">
            {this.treeNodes}
          </TreeNode>
        </Tree>
      </div>
    );
  }
}
