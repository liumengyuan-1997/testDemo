import store from "store";
const User_KEY = "user_key";

export default {
  saveUser(user) {
    store.set(User_KEY, user);
  },
  getUser() {
    return store.get(User_KEY);
  },
  removeUser() {
    store.remove(User_KEY);
  },
};

// 进行localstorage数据存储管理的工具模块 编译转码方便
