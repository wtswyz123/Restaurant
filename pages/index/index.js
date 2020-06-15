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
    orders:[],
    menus: [
    {id: 1,menu: '湘菜'}, 
    {id: 2,menu: '干锅系列'}, 
    {id: 3,menu: '铁板系列'}],
    // 商品列表
    menu:[]
  },
  onLoad: function() {
    let that = this;
    // 取出订单传过来的数据
    wx.getStorage({
      key: 'orders',
      success: function (res) {
        that.setData({
          orders: res.data
        });
      }
    })
  },
  getData:function(menuType){
    var that = this
    wx.request({
     url: 'http://192.168.1.3:8222/api/Menu/MenuList?type='+menuType,
     headers: {'Content-Type': 'application/json'},
     success: function (res) {
       var data=JSON.parse(res.data)
       data.forEach(element => {
         that.data.orders.forEach(or=>{
          if(or.M_Id==element.M_Id)
          {
            element.M_State=2;
          }
         })
       });
      that.setData({
        menu: data
      })
     }
    })
  },
  onShow: function () {
    var that = this;
    that.getData(1);
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
    let id=this.data.menus[index].id;
    this.getData(id);
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
    let subOrders = that.data.orders; // 购物单列表存储数据
    param.M_State==1 ? param.M_State = 2 : param.M_State = 1;
    // 改变添加按钮的状态
    this.data.menu.splice(index, 1, param);
    that.setData({
      menu: this.data.menu
    });
    // 将已经确定的菜单添加到购物单列表
    if(param.M_State==2){subOrders.push(param);}
    else{that.delarr(param.M_Id);}

    //this.data.menu.forEach(item => {
    //  if (item.M_State==2) {
        
    //  }
    //});
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
      orderCount,
      orders:subOrders
    });
    // 将选中的商品存储在本地
    wx.setStorage({
      key: "orders",
      data: subOrders
    });
  },
  delarr:function(_obj) {
    var that=this;
            var length = that.data.orders.length;
            for (var i = 0; i < length; i++) {
                if (that.data.orders[i].M_Id == _obj) {
                    if (i == 0) {
                        that.data.orders.shift(); //删除并返回数组的第一个元素
                        return;
                    }
                    else if (i == length - 1) {
                      that.data.orders.pop();  //删除并返回数组的最后一个元素
                        return;
                    }
                    else {
                      that.data.orders.splice(i, 1); //删除下标为i的元素
                        return;
                    }
                }
            }
        }
})