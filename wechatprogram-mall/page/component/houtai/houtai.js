// page/component/new-pages/user/user.js
const app = getApp()

Page({
  data:{
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    thumb:'',
    nickname:'',
    goods:[],
    hasAddress:false,
    address:{},
    hiddenmodalput: true,
    myname: "",
    mymoney: "",
    mycount: "",
    myupdateid: '',
    inputname: "",
    inputmoney: "",
    inputcount: ""
  },
  onLoad(){
    var self = this;
    /**
     * 获取用户信息
     */
    wx.getUserInfo({
      success: function(res){
        self.setData({
          thumb: res.userInfo.avatarUrl,
          nickname: res.userInfo.nickName
        })
      }
    })

    /**
     * 发起请求获取订单列表信息
     */
    wx.request({
      url: 'https://timelooper.wang/feng/getgoods.php',
      success(res){
        self.setData({
          goods: res.data
        })
      }
    })
  },
  bindGetUserInfo: function(e) {
    if (e.detail.userInfo) {
        //用户按了允许授权按钮
        var that = this;
        // 获取到用户的信息了，打印到控制台上看下
        console.log("用户的信息如下：");
        console.log(e.detail.userInfo);
        //授权成功后,通过改变 isHide 的值，让实现页面显示出来，把授权页面隐藏起来
        that.setData({
            isHide: false
        });
    } else {
        //用户按了拒绝按钮
        wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
            showCancel: false,
            confirmText: '返回授权',
            success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                    console.log('用户点击了“返回授权”');
                }
            }
        });
    }
},
  /**
   * 发起支付请求
   */
  deletegoods(e){
    var self = this;
    var deleteid = e.target.id;
    wx.request({
      url: 'https://timelooper.wang/feng/deletegoods.php',
      method: "POST",
      data: {
        secret: "fenghlz",
        id: deleteid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res){
        wx.request({
          url: 'https://timelooper.wang/feng/getgoods.php',
          success(res){
            self.setData({
              goods: res.data
            })
          }
        })
        wx.showModal({
          title:'提示',
          content:'删除商品完成',
          showCancel:false
        })
      },
      fail(info){
        console.log("Failed!")
      }
    })
  },
  updategoods(e){
    var updateid = e.target.id;
    console.log(updateid);
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput,
      myupdateid: updateid
    })
    
    for(var index in this.data.goods){
      var myid = this.data.goods[index].id;
      if(myid == updateid){
        var myindex = index;
        break;
      }
    }
    var myname = this.data.goods[index].name;
    var mymoney = this.data.goods[index].money;
    var mycount = this.data.goods[index].count;
    this.setData({
      myname: myname,
      mymoney: mymoney,
      mycount: mycount
    })
  },
  cancel(e){
    this.setData({
    hiddenmodalput: true
    });
  },

  goodsName(e){
    this.setData({
      myname: e.detail.value
    })
  },
  goodsMoney(e){
    this.setData({
      mymoney: e.detail.value
    })
  },
  goodsNumber(e){
    this.setData({
      mycount: e.detail.value
    })
  },

  confirm(e){
    var self = this;
    console.log(this.data.myupdateid)
    console.log(this.data.myname)
    console.log(this.data.mymoney)
    console.log(this.data.mycount)
    wx.request({
      url: 'https://timelooper.wang/feng/updategoods.php',
      method: "POST",
      data: {
        secret: "fenghlz",
        id: this.data.myupdateid,
        name: this.data.myname,
        money: this.data.mymoney,
        count: this.data.mycount
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success(res){
        console.log(res.data)
        self.setData({
          hiddenmodalput: true
        })

        wx.request({
          url: 'https://timelooper.wang/feng/getgoods.php',
          success(res){
            self.setData({
              goods: res.data
            })
          }
        })
        wx.showModal({
          title:'提示',
          content:'修改商品信息完成',
          showCancel:false
        })
      },
      fail(info){
        console.log("Failed!")
      }
    })
  },
  formSubmit(e){
    var self = this;
    const value = e.detail.value;
    if (value.name && value.money && value.count){
      wx.request({
        url: 'https://timelooper.wang/feng/insertgoods.php',
        method: "POST",
        data: {
          secret: "fenghlz",
          name: value.name,
          money: value.money,
          count: value.count
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success(res){
          console.log(res.data)
          wx.request({
            url: 'https://timelooper.wang/feng/getgoods.php',
            success(res){
              self.setData({
                goods: res.data
              })
            }
          })
          wx.showModal({
            title:'提示',
            content:'添加商品信息完成',
            showCancel:false
          })
          self.setData({
            inputname: "",
            inputmoney: "",
            inputcount: ""
          })
        },
        fail(info){
          console.log("Failed!")
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整信息',
        showCancel:false
      })
    }
  }
})