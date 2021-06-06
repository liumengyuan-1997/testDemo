import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Input } from "antd";

class UpdateFrom extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    // categoryName是字符串类型，必须
    setForm: PropTypes.func.isRequired, // setForm是函数类型
  };
  componentWillMount() {
    this.props.setForm(this.props.form); // 子组件调用方法把数据传递给父组件
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { categoryName } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item>
          {/*getFieldDecorator("categoryName" 要对应 */}
          {getFieldDecorator("categoryName", {
            initialValue: categoryName, // 初始化数据
            rules: [
              {
                required: true,
                message: "分类名称",
              },
            ],
          })(<Input placeholder="请输入名称" />)}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(UpdateFrom);
