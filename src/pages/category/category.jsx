import React, { Component } from "react";
import { Table, Card, Button, Icon, Modal } from "antd";
import { reqAddCategory, reqCategorys, reqUpdateCategory } from "../api";
import UpdateFrom from "./update-form";
import AddForm from "./add-form";
class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categorys: [], //一级分类数组
      subCategorys: [], // 二级分类数组
      parentId: "0", //分类id   0表示一级分类
      parentName: "", // 分类名称
      visible: 0, //false true 默认是false 弹框显示隐藏的状态  0表示关闭  1表示添加弹窗弹出  2修改弹窗弹出
    };
  }
  componentWillMount() {
    this.initColumn();
  }
  initColumn() {
    this.columns = [
      {
        title: "分类名称",
        dataIndex: "name",
        key: "name",
      },

      {
        title: "操作",
        key: "tags",
        render: (category) => {
          return (
            <span>
              <span onClick={() => this.showUpdate(category)}>修改分类</span>
              &nbsp;&nbsp;&nbsp;
              {this.state.parentId === "0" ? (
                <span
                  onClick={() => {
                    // console.log(category);
                    // category当前信息
                    this.showSubCategorys(category);
                  }}
                >
                  查看子分类
                </span>
              ) : null}
            </span>
          );
        },
      },
    ];
  }
  // 获取分类列表  传参，传0的话表示一级分类，传_id表示对应的分类
  getCategorys = async (parentId) => {
    // 先做判断
    parentId = parentId || this.state.parentId;

    // console.log(parentId);
    const result = await reqCategorys(parentId);
    // console.log(result);
    if (result.status === 0) {
      const categorys = result.data;
      if (parentId === "0") {
        console.log(1);
        this.setState({
          categorys,
        });
      } else {
        // console.log(22);
        this.setState({
          subCategorys: categorys,
        });
      }
    }
  };
  // 获取二级分类列表  传_id表示对应的分类
  showSubCategorys = (categorys) => {
    // console.log(categorys);
    this.setState(
      {
        parentId: categorys._id,
        parentName: categorys.name,
      },
      () => {
        // console.log(11);
        this.getCategorys();
      }
    );
  };
  //点击一级分类栏 修改状态
  showCategorys = () => {
    this.setState({
      parentId: "0",
      parentName: "",
      subCategorys: [],
    });
  };
  componentDidMount() {
    // 这个生命周期用于调用接口
    this.getCategorys();
  }

  // 关闭弹窗
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: 0,
    });
  };
  // 弹出添加弹框
  showAdd = () => {
    this.setState({
      visible: 1,
    });
  };
  // 添加
  addCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        console.log(values); // 收集表单数据

        const { parentId } = values;
        const { categoryName } = values;
        this.form.resetFields(); //清空表单数据
        // 调用接口更新分类信息;
        console.log(parentId, categoryName);
        const result = await reqAddCategory({ parentId, categoryName });
        console.log(result);
        if (result.status === 0) {
          // 添加的分类就是当前分类列表下的分类
          if (parentId === this.state.parentId) {
            // 重新获取当前分类列表显示
            this.getCategorys();
          } else if (parentId === "0") {
            // 在二级分类列表下添加一级分类, 重新获取一级分类列表, 但不需要显示一级列表
            this.getCategorys("0");
            console.log(2);
          }
          // 关闭弹窗
          this.setState({
            visible: 0,
          });
        }
      }
    });
  };
  // 弹出修改弹框
  showUpdate = (category) => {
    this.category = category; // 获取本条信息
    // console.log(1);
    this.setState({
      visible: 2,
    });
  };
  //修改
  updateCategory = () => {
    this.form.validateFields(async (err, values) => {
      if (!err) {
        console.log(values); // 收集表单数据
        const categoryId = this.category._id;
        const { categoryName } = values;
        this.form.resetFields(); //清空表单数据
        // 调用接口更新分类信息
        const result = await reqUpdateCategory({ categoryId, categoryName });
        console.log(result);
        if (result.status === 0) {
          this.setState({
            visible: 0,
          });
          this.getCategorys();
        }
      }
    });
  };
  render() {
    const {
      categorys,
      parentId,
      subCategorys,
      parentName,
      visible,
    } = this.state;
    const title =
      parentId === "0" ? (
        "一级分类"
      ) : (
        <span>
          <span onClick={this.showCategorys}>一级分类</span> ----{" "}
          <span>{parentName}</span>
        </span>
      );
    const extra = (
      <span>
        <Button type="primary" onClick={this.showAdd}>
          <Icon type="plus" />
          添加
        </Button>
      </span>
    );
    const category = this.category || {};
    return (
      <Card title={title} extra={extra}>
        <Table
          columns={this.columns}
          // 此处做判断进行显示一级还是二级
          dataSource={parentId === "0" ? categorys : subCategorys}
          rowKey="_id"
        />
        <Modal
          title="添加信息"
          visible={visible == 1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm
            parentId={parentId}
            categorys={categorys}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>
        <Modal
          title="修改信息"
          visible={visible == 2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateFrom
            categoryName={category.name}
            setForm={(form) => {
              this.form = form;
            }}
          />
        </Modal>
      </Card>
    );
  }
}

export default Category;
