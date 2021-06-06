import React, { Component } from "react";
import { Card, Button, Table, Modal, message } from "antd";
import { formateDate } from "../../utils/dataUtils";
import { PAGE_SIZE } from "../../utils/constants";
import { reqAddRole, reqRoles, reqUpdateRole } from "../api/index";
import AddForm from "../role/add-form";
import AuthForm from "../role/auth-form";
import storageUtils from "../../utils/storageUtils";
class Role extends Component {
  constructor(props) {
    super(props);
    //
    this.auth = React.createRef();
    console.log(this.auth);
    console.log(storageUtils.getUser());
    this.state = {
      roles: [], // 所有角色的列表
      role: {}, // 选中的role
      isShowAdd: false, // 是否显示添加界面
      isShowAuth: false, // 是否显示设置权限界面
    };
  }
  // 千万记得要初始化*****调用******
  initColumn = () => {
    this.columns = [
      {
        title: "角色名称",
        dataIndex: "name",
      },
      {
        title: "创建时间",
        dataIndex: "create_time",
        render: (create_time) => formateDate(create_time),
      },
      {
        title: "授权时间",
        dataIndex: "auth_time",
        render: (auth_time) => formateDate(auth_time),
      },
      {
        title: "授权人",
        dataIndex: "auth_name",
      },
    ];
  };
  // 获取角色列表
  getRoles = async () => {
    const result = await reqRoles();
    if (result.status === 0) {
      const roles = result.data;
      console.log(roles);
      this.setState({
        roles,
      });
    }
  };

  //
  onRow = (role) => {
    return {
      onClick: (event) => {
        // 点击行
        console.log("row onClick()", role);
        this.setState({
          role,
        });
      },
    };
  };
  // 添加角色
  addRole = () => {
    // 进行表单验证, 只能通过了才向下处理
    this.form.validateFields(async (error, values) => {
      if (!error) {
        // 隐藏确认框
        this.setState({
          isShowAdd: false,
        });
        //收集输入数据
        const { roleName } = values;
        //清空
        this.form.resetFields();
        const result = await reqAddRole(roleName);
        // 根据结果提示/更新列表显示
        if (result.status === 0) {
          message.success("添加角色成功");
          // 返回的有新添的角色信息
          // 但是此时并没有授权信息
          console.log(result);
          const role = result.data;
          //1 更新roles状态
          /*const roles = this.state.roles
          roles.push(role)
          this.setState({
            roles
          })*/

          //2 更新roles状态: 基于原本状态数据更新
          this.setState((state) => ({
            roles: [...state.roles, role],
          }));
        } else {
          message.success("添加角色失败");
        }
      }
    });
  };
  // 更新授权角色权限
  updateRole = async () => {
    // 隐藏确认框
    this.setState({
      isShowAuth: false,
    });
    const role = this.state.role;
    // 从子组件获取最新的menus
    const menus = this.auth.current.getMenus();
    role.menus = menus;
    role.auth_time = Date.now();
    role.auth_name = storageUtils.getUser().username;

    // 发起请求更新
    const result = await reqUpdateRole(role);
    if (result.status === 0) {
      // 如果当前更新的是自己角色的权限, 强制退出
      console.log(role._id);
      if (role._id === storageUtils.getUser()._id) {
        storageUtils.removeUser();
        this.props.history.replace("/login");
        message.success("当前用户角色权限成功");
      } else {
        message.success("设置角色权限成功");
        this.setState({
          roles: [...this.state.roles],
        });
      }
    }
  };
  componentWillMount() {
    this.initColumn();
  }
  // 调用一下
  componentDidMount() {
    this.getRoles();
  }
  render() {
    const { roles, role, isShowAdd, isShowAuth } = this.state;
    // console.log("111", roles);
    const title = (
      <span>
        <Button
          type="primary"
          onClick={() => this.setState({ isShowAdd: true })}
        >
          创建角色
        </Button>
        {/* 加空格 */}
        &nbsp;&nbsp;
        <Button
          type="primary"
          disabled={!role._id}
          onClick={() =>
            this.setState({
              isShowAuth: true,
            })
          }
        >
          设置角色权限
        </Button>
      </span>
    );
    return (
      <Card title={title}>
        <Table
          columns={this.columns}
          bordered
          dataSource={roles}
          rowKey="_id"
          pagination={{ defaultPageSize: PAGE_SIZE }}
          rowSelection={{
            type: "radio",
            // 指定选中项的 key 数组
            selectedRowKeys: [role._id],
            onSelect: (role) => {
              // 选择某个radio时回调
              this.setState({
                role,
              });
            },
          }}
          // 设置行属性
          onRow={this.onRow}
        />
        <Modal
          title="添加角色"
          visible={isShowAdd}
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ isShowAdd: false });
            this.form.resetFields();
          }}
        >
          <AddForm setForm={(form) => (this.form = form)}></AddForm>
        </Modal>
        <Modal
          title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRole}
          onCancel={() => {
            this.setState({ isShowAuth: false });
          }}
        >
          <AuthForm ref={this.auth} role={role}></AuthForm>
        </Modal>
      </Card>
    );
  }
}

export default Role;
