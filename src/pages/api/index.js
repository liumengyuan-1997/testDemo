import ajax from "./ajax";

// 登录接口封装
export const reqLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");
// 获取一级/二级分类
export const reqCategorys = (parentId) => ajax("/manage/category/list", { parentId });

//更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax("/manage/category/update", { categoryId, categoryName }, "POST")
//添加分类
// 接口封装要准确
export const reqAddCategory = ({ parentId, categoryName }) => ajax("/manage/category/add", { parentId, categoryName }, "POST")

//商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax("/manage/product/list", { pageNum, pageSize })
// 搜索商品分页列表 (根据商品名称/商品描述)
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax("/manage/product/search", { pageNum, pageSize, [searchType]: searchName }, "GET")

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax("/manage/product/" + (product._id ? "update" : "add"), product, "POST")
//对商品进行上架/下架处理
export const reqUpdateStatus = (productId, status) => ajax("/manage/product/updateStatus", { productId, status }, "POST")
// 分类ID获取一个分类
export const reqCategory = (categoryId) => ajax("/manage/category/info", { categoryId }, "GET")

// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax("/manage/user/" + (user._id ? "update" : "add"), user, "POST")
// 获取所有用户的列表
export const reqUsers = () => ajax("/manage/user/list", "GET")
// 删除指定用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete', { userId }, 'POST')
//  获取所有角色的列表
export const reqRoles = () => ajax("/manage/role/list", "GET")
// 添加角色
export const reqAddRole = (roleName) => ajax("/manage/role/add", { roleName }, "POST")
// 更新角色(给角色设置权限)
export const reqUpdateRole = (role) => ajax("/manage/role/update", role, "POST")

/*
jsonp解决ajax跨域的原理
  1). jsonp只能解决GET类型的ajax请求跨域问题
  2). jsonp请求不是ajax请求, 而是一般的get请求
  3). 基本原理
   浏览器端:
      动态生成<script>来请求后台接口(src就是接口的url)
      定义好用于接收响应数据的函数(fn), 并将函数名通过请求参数提交给后台(如: callback=fn)
   服务器端:
      接收到请求处理产生结果数据后, 返回一个函数调用的js代码, 并将结果数据作为实参传入函数调用
   浏览器端:
      收到响应自动执行函数调用的js代码, 也就执行了提前定义好的回调函数, 并得到了需要的结果数据
 */