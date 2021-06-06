import React, { Component } from "react";
import {
  Card,
  List,
  Icon,
  Form,
  Input,
  Button,
  Checkbox,
  Cascader,
  message,
} from "antd";
import { reqAddOrUpdateProduct, reqCategorys } from "../api/index";
import qs from "qs";
const { TextArea } = Input;
// Product的添加和更新的子路由组件
class ProductAddUpdate extends Component {
  // 写法不对会报错
  constructor(props) {
    super(props);
    this.state = {
      options: [],
    };
    // 创建用来保存ref标识的标签对象的容器
    this.pw = React.createRef();
    this.editor = React.createRef();
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId);
    if (result.status === 0) {
      const categorys = result.data;
      //如果是一级分类列表
      if (parentId === "0") {
        this.initOptions(categorys);
      } else {
        // 二级列表
        return categorys; // 返回二级列表 ==> 当前async函数返回的promsie就会成功且value为categorys
      }
    }
  };

  //
  initOptions = async (categorys) => {
    const options = categorys.map((c) => ({
      value: c._id,
      label: c.name,
      isLeaf: false, // 不是叶子
    }));
    // 如果是一个二级分类商品的更新
    const { isUpdate, product } = this;
    const { pCategoryId } = product;
    if (isUpdate && pCategoryId !== "0") {
      // 获取对应的二级分类列表
      const subCategorys = await this.getCategorys(pCategoryId);
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(
        (option) => option.value === pCategoryId
      );

      // 关联对应的一级option上
      targetOption.children = childOptions;
    }
    // 更新options状态
    this.setState({
      options,
    });
  };
  /*
  用加载下一级列表的回调函数
   */
  loadData = async (selectedOptions) => {
    // 得到选择的option对象
    const targetOption = selectedOptions[0];
    // 显示loading
    targetOption.loading = true;

    // 根据选中的分类, 请求获取二级分类列表
    const subCategorys = await this.getCategorys(targetOption.value);
    // 隐藏loading
    targetOption.loading = false;
    // 二级分类数组有数据
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map((c) => ({
        value: c._id,
        label: c.name,
        isLeaf: true,
      }));
      // 关联到当前option上
      targetOption.children = childOptions;
    } else {
      // 当前选中的分类没有二级分类
      targetOption.isLeaf = true;
    }

    // 更新options状态
    this.setState({
      options: [...this.state.options],
    });
  };

  componentDidMount() {
    this.getCategorys("0");
  }
  componentWillMount() {
    // console.log(
    //   qs.parse(this.props.location.search, {
    //     ignoreQueryPrefix: true,
    //   })
    // );
    const product = qs.parse(this.props.location.search, {
      // 去除?
      ignoreQueryPrefix: true,
    });
    // 返回对象属性名组成数据 且带排序 从而
    // 使用ES6的Object.keys()方法判断对象是否存在
    if (Object.keys(product).length == 0) {
      // console.log(1);
      this.isUpdate = false;
    } else {
      this.isUpdate = true;
      // console.log(2);
    }

    this.product = product || {};
    console.log(this.isUpdate);
  }
  // 提交
  submit = () => {
    // 进行表单验证, 如果通过了, 才发送请求
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // 1. 收集数据, 并封装成product对象
        const { name, desc, price, categoryIds } = values;
        // 定义一下
        let pCategoryId, categoryId;
        if (categoryIds.length === 1) {
          // 一级
          pCategoryId = "0";
          categoryId = categoryIds[0];
        } else {
          pCategoryId = categoryIds[0];
          categoryId = categoryIds[1];
        }
        const product = { name, desc, price, pCategoryId, categoryId };
        // 如果是更新, 需要添加_id
        if (this.isUpdate) {
          product._id = this.product._id;
        }
        // 2. 调用接口请求函数去添加/更新
        const result = await reqAddOrUpdateProduct(product);
        console.log(result);
        // 3. 根据结果提示
        if (result.status === 0) {
          message.success(this.isUpdate ? "更新商品成功" : "添加商品成功");
          this.props.history.goBack();
        } else {
          message.success(this.isUpdate ? "更新商品失败" : "添加商品失败");
        }
      }
    });
  };
  render() {
    const { isUpdate, product } = this;
    const { pCategoryId, categoryId, imgs, detail } = product;
    console.log(product);
    // 用来接收级联分类ID的数组
    const categoryIds = [];
    if (isUpdate) {
      // 商品是一个一级分类的商品
      if (pCategoryId === "0") {
        categoryIds.push(categoryId);
      } else {
        // 商品是一个二级分类的商品
        categoryIds.push(pCategoryId);
        categoryIds.push(categoryId);
      }
    }
    // 指定Item布局的配置对象
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8 },
    };
    const formTailLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 8, offset: 4 },
    };
    const title = (
      <span>
        <Icon
          type="arrow-left"
          style={{ fontSize: "16px", color: "#08c", width: 50 }}
          // onClick={() => this.props.history.push("/product")}
          // 两种方法都可以
          onClick={() => this.props.history.goBack()}
        />
        <span>{isUpdate ? "修改商品" : "添加商品"}</span>
      </span>
    );
    const { getFieldDecorator } = this.props.form;
    return (
      <Card title={title}>
        {/* 布局 */}
        <Form {...formItemLayout}>
          <Form.Item label="商品名称">
            {/* getFieldDecorator 用于和表单进行双向绑定*/}
            {getFieldDecorator("name", {
              initialValue: product.name,
              rules: [
                {
                  required: true,
                  message: "必须输入商品名称",
                },
              ],
            })(<Input placeholder="请输入商品名称" />)}
          </Form.Item>
          <Form.Item label="商品描述">
            {/* getFieldDecorator 用于和表单进行双向绑定*/}
            {getFieldDecorator("desc", {
              initialValue: product.desc,
              rules: [
                {
                  required: true,
                  message: "必须输入商品描述",
                },
              ],
            })(
              <TextArea
                placeholder="请输入商品描述"
                autosize={{ minRows: 2, maxRows: 6 }}
              />
            )}
          </Form.Item>
          <Form.Item label="商品价格">
            {/* getFieldDecorator 用于和表单进行双向绑定*/}
            {getFieldDecorator("price", {
              initialValue: product.price,
              rules: [
                {
                  required: true,
                  message: "必须输入商品价格",
                },
              ],
            })(
              <Input
                type="number"
                placeholder="请输入商品价格"
                addonAfter="元"
              />
            )}
          </Form.Item>
          <Form.Item label="商品分类">
            {/* getFieldDecorator 用于和表单进行双向绑定*/}
            {getFieldDecorator("categoryIds", {
              // 此处如何通过id获取
              initialValue: categoryIds,
              rules: [
                {
                  required: true,
                  message: "必须指定商品分类",
                },
              ],
            })(
              <Cascader
                options={this.state.options}
                placeholder="请指定商品分类"
                loadData={
                  this.loadData
                } /*当选择某个列表项, 加载下一级列表的监听回调*/
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={this.submit}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  }
}

//高阶组件   经过 Form.create 包装的组件将会自带 this.props.form 属性，this.props.form 提供的 API 如下
export default Form.create()(ProductAddUpdate);
