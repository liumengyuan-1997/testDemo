import React, { Component } from "react";
import { Card, Button, Icon, Select, Table, Input, message } from "antd";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from "../api";
import { PAGE_SIZE } from "../../utils/constants";
import LinkButton from "../../components/link-button";
import qs from "qs";
const Option = Select.Option;
class ProductHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchName: "", //搜索的关键字
      searchType: "productName", // 根据哪个字段搜索
      loading: false, // 是否正在加载中
      total: 0, // 商品的总数量
      products: [], // 商品的数组
    };
  }
  /*
  初始化table的列的数组
   */
  initColumns = () => {
    this.columns = [
      {
        title: "商品名称",
        dataIndex: "name",
      },
      {
        title: "商品描述",
        dataIndex: "desc",
      },
      {
        title: "价格",
        dataIndex: "price",
        render: (price) => "¥" + price, // 当前指定了对应的属性, 传入的是对应的属性值
      },
      {
        width: 100,
        title: "状态",
        render: (product) => {
          // console.log(product);
          const { status, _id } = product;
          const newStatus = status === 1 ? 2 : 1;
          return (
            <span>
              <Button
                type="primary"
                onClick={() => this.updateStatus(_id, newStatus)}
              >
                {status === 1 ? "下架" : "上架"}
              </Button>
              <span>{status === 1 ? "在售" : "已下架"}</span>
            </span>
          );
        },
      },
      {
        width: 100,
        title: "操作",
        render: (product) => {
          return (
            <span>
              {/*将product对象使用state传递给目标路由组件*/}
              <LinkButton
                onClick={() =>
                  this.props.history.push({
                    pathname: "/product/detail",
                    search: qs.stringify(product),
                  })
                }
              >
                详情
              </LinkButton>
              <LinkButton
                onClick={() =>
                  this.props.history.push({
                    pathname: "/product/addupdate",
                    search: qs.stringify(product),
                  })
                }
              >
                修改
              </LinkButton>
            </span>
          );
        },
      },
    ];
  };
  // 获取指定页码的列表数据显示
  getProducts = async (pageNum) => {
    this.pageNum = pageNum; // 保存pageNum, 让其它方法可以看到
    this.setState({ loading: true }); // 显示loading
    const { searchName, searchType } = this.state;
    // console.log(pageNum, PAGE_SIZE, searchName, searchType);
    // 如果搜索关键字有值, 说明我们要做搜索分页
    let result;
    if (searchName) {
      // console.log(1);
      result = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType,
      });
    } else {
      // console.log(2);
      //就是一般请求列表
      result = await reqProducts(pageNum, PAGE_SIZE);
    }
    this.setState({ loading: false }); // 隐藏loading
    if (result.status === 0) {
      // 取出分页数据, 更新状态, 显示分页列表
      console.log(result);
      const { list, total } = result.data;
      this.setState({
        total,
        products: list,
      });
    }
  };
  // 更新指定商品的状态
  updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status);
    if (result.status === 0) {
      message.success("更新商品成功");
      this.getProducts(this.pageNum);
    }
  };
  componentWillMount() {
    // 调用一下，不调用出不来
    this.initColumns();
  }
  componentDidMount() {
    //页码为1
    this.getProducts(1);
  }
  render() {
    // 取出状态数据
    const { products, total, searchType, searchName, loading } = this.state;

    const title = (
      <span>
        <Select
          value={searchType}
          style={{ width: 150 }}
          onChange={(value) =>
            this.setState({
              searchType: value,
            })
          }
        >
          <Option value="productName">按名称搜索</Option>
          <Option value="productDesc">按描述搜索</Option>
        </Select>
        <Input
          placeholder="关键字"
          style={{ width: 150, margin: "0 15px" }}
          value={searchName}
          onChange={(e) =>
            this.setState({
              searchName: e.target.value,
            })
          }
        />
        <Button type="primary" onClick={() => this.getProducts(1)}>
          搜索
        </Button>
      </span>
    );
    const extra = (
      <span>
        <Button
          type="primary"
          onClick={() => this.props.history.push("/product/addupdate")}
        >
          <Icon type="plus" />
          添加商品
        </Button>
      </span>
    );
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey="_id"
          loading={loading}
          columns={this.columns}
          dataSource={products}
          pagination={{
            current: this.pageNum,
            total,
            showQuickJumper: true,
            defaultPageSize: PAGE_SIZE,
            onChange: this.getProducts,
          }}
        />
      </Card>
    );
  }
}

export default ProductHome;
