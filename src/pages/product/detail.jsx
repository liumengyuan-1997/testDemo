import React, { Component } from "react";
import { Card, Icon, List } from "antd";
import qs from "qs";
import { BASE_IMG_URL } from "../../utils/constants";
import { reqCategory } from "../api/index";
// Item的用法
const Item = List.Item;

// Product的详情子路由组件
class ProductDetail extends Component {
  state = {
    cName1: "", // 一级分类名称
    cName2: "", // 二级分类名称
  };
  async componentDidMount() {
    const { categoryId, pCategoryId } = qs.parse(this.props.location.search, {
      ignoreQueryPrefix: true,
    });
    console.log(categoryId, pCategoryId);
    if (pCategoryId === "0") {
      // 一级分类下的
      const result = await reqCategory(categoryId);
      console.log(result);
      const cName1 = result.data.name;
      this.setState({
        cName1,
      });
    } else {
      // 二级分类
      /*
      //通过多个await方式发多个请求: 后面一个请求是在前一个请求成功返回之后才发送
      const result1 = await reqCategory(pCategoryId) // 获取一级分类列表
      const result2 = await reqCategory(categoryId) // 获取二级分类
      const cName1 = result1.data.name
      const cName2 = result2.data.name
      */

      // 一次性发送多个请求, 只有都成功了, 才正常处理
      const results = await Promise.all([
        reqCategory(pCategoryId),
        reqCategory(categoryId),
      ]);
      const cName1 = results[0].data.name;
      const cName2 = results[1].data.name;
      this.setState({
        cName1,
        cName2,
      });
    }
  }

  render() {
    const { name, desc, price, imgs, detail } = qs.parse(
      this.props.location.search,
      { ignoreQueryPrefix: true }
    );
    const { cName1, cName2 } = this.state;

    const title = (
      <span>
        <Icon
          type="arrow-left"
          style={{ fontSize: "16px", color: "#08c", width: 50 }}
          // onClick={() => this.props.history.push("/product")}
          // 两种方法都可以
          onClick={() => this.props.history.goBack()}
        />
        <span>商品详情</span>
      </span>
    );
    return (
      <Card title={title}>
        <List>
          <Item>
            <span className="left">商品名称:</span>
            <span>{name}</span>
          </Item>
          <Item>
            <span className="left">商品描述:</span>
            <span>{desc}</span>
          </Item>
          <Item>
            <span className="left">商品价格:</span>
            <span>{price}</span>
          </Item>
          <Item>
            <span className="left">所属分类:</span>
            <span>
              {cName1}
              {cName2 ? "---->" + cName2 : ""}
            </span>
          </Item>
          <Item>
            <span className="left">商品图片:</span>
            <span>
              {imgs.map((img) => (
                <img
                  src={BASE_IMG_URL + img}
                  alt="img"
                  width="100"
                  height="100"
                />
              ))}
            </span>
          </Item>
          <Item>
            <span className="left">商品详情:</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </Item>
        </List>
      </Card>
    );
  }
}

export default ProductDetail;
