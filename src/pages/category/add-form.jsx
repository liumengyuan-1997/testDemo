import { Form, Select, Input, Icon } from "antd";
import PropTypes from "prop-types";
import React, { Component } from "react";
const Item = Form.Item;
const Option = Select.Option;
class AddForm extends Component {
  static propTypes = {
    setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
    categorys: PropTypes.array.isRequired, // 一级分类的数组 加上isRequired表示必须传递的项
    parentId: PropTypes.string.isRequired, // 父分类的ID
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  componentWillMount() {
    this.props.setForm(this.props.form);
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { categorys, parentId, categoryName } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator("parentId", {
            initialValue: parentId, // 如果这个parentId和下面循环遍历中的parentId一致，就会被选中
            rules: [{ required: true, message: "Please select your gender!" }],
          })(
            <Select>
              <Option value="0">一级分类</Option>
              {categorys.map((c) => {
                return <Option value={c._id}>{c.name}</Option>;
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("categoryName", {
            rules: [{ required: true, message: "Please input your username!" }],
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="分类名称"
            />
          )}
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(AddForm);
