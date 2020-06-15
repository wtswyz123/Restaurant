//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    tabIndex: 0,
    // 统计商品数量和价格
    orderCount: {
      num: 0,
      money: 0
    },
    bottomFlag: false,
    // 提交的订单
    orders: true,
    menus: [{
      id: 1,
      menu: '菜单一'
    }, {
      id: 1,
      menu: '菜单一'
    }, {
      id: 1,
      menu: '菜单一'
    }, {
      id: 1,
      menu: '菜单二'
    }, {
      id: 1,
      menu: '菜单三'
    }, {
      id: 1,
      menu: '菜单四'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }, {
      id: 1,
      menu: '菜单五'
    }],
    // 商品列表
    items: [{
      id: 1,
      title: '湖南辣椒小炒肉1',
      price: 12,
      active: false,
      num: 1
    }, {
      id: 2,
      title: '湖南辣椒小炒肉2',
      price: 13,
      active: false,
      num: 1
    }, {
      id: 3,
      title: '湖南辣椒小炒肉3',
      price: 14,
      active: false,
      num: 1
    }, {
      id: 4,
      title: '湖南辣椒小炒肉4',
      price: 15,
      active: false,
      num: 1
    }, {
      id: 5,
      title: '湖南辣椒小炒肉5',
      price: 16,
      active: false,
      num: 1
    }, {
      id: 6,
      title: '湖南辣椒小炒肉5',
      price: 17,
      active: false,
      num: 1
    }, {
      id: 7,
      title: '湖南辣椒小炒肉5',
      price: 18,
      active: false,
      num: 1
    }]
    ,menu:[]
  },
  onShow: function () {
    var that = this//不要漏了这句，很重要
    wx.request({
     url: 'http://192.168.1.3:8222/api/Menu/MenuList?type=1',
     headers: {'Content-Type': 'application/json'},
     success: function (res) {
       console.log(res);
       var data=JSON.parse(res.data)
     //将获取到的json数据，存在名字叫zhihu的这个数组中
      that.setData({
        menu: data
      })
     }
    })
    },
  // 下拉刷新
  onPullDownRefresh: function () {
    setTimeout(()=>{
      wx.showToast({
        title: '成功加载数据',
        icon: 'success',
        duration: 500
      });
      wx.stopPullDownRefresh()
    }, 500);
  },
  tabMenu: function(event) {
    let index = event.target.dataset.index;
    this.setData({
      tabIndex: index
    });
  },
  // 点击去购物车结账
  card: function() {
    let that = this;
    // 判断是否有选中商品
    if (that.data.orderCount.num !==  0) {
      // 跳转到购物车订单也
      wx.redirectTo({
        url: '../order/order'
      });
    } else {
      wx.showToast({
        title: '您未选中任何商品',
        icon: 'none',
        duration: 2000
      })
    }
  },
  addOrder: function(event) {
    let that = this;
    let id = event.target.dataset.id;
    let index = event.target.dataset.index;
    let param = this.data.menu[index];
    let subOrders = []; // 购物单列表存储数据
    param.M_State==1 ? param.M_State = 2 : param.M_State = 1;
    // 改变添加按钮的状态
    this.data.menu.splice(index, 1, param);
    that.setData({
      menu: this.data.menu
    });
    // 将已经确定的菜单添加到购物单列表
    this.data.menu.forEach(item => {
      if (item.M_State==2) {
        subOrders.push(item);
      }
    });
    // 判断底部提交菜单显示隐藏
    if (subOrders.length == 0) {
      that.setData({
        bottomFlag: false
      });
    } else {
      that.setData({
        bottomFlag: true
      });
    }
    let money = 0;
    let num = subOrders.length;
    subOrders.forEach(item => {
      money += item.M_Price; // 总价格求和
    });
    let orderCount = {
      num,
      money
    }
    // 设置显示对应的总数和全部价钱
    this.setData({
      orderCount
    });
    // 将选中的商品存储在本地
    wx.setStorage({
      key: "orders",
      data: subOrders
    });
  },
  onLoad: function() {

  }
})