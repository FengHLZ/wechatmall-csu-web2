// page/component/new-pages/user/user.js
const app = getApp()

Page({
  data:{
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isHide: false,
    thumb:'',
    nickname:'',
    orders:[],
    hasAddress:false,
    address:{}
  },
  onLoad(){
    var self = this;
    wx.getSetting({
      success: function(res) {
          if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                  success: function(res) {
                      // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                      // 根据自己的需求有其他操作再补充
                      // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                      wx.login({
                          success: res => {
                              // 获取到用户的 code 之后：res.code
                              console.log("用户的code:" + res.code);
                              // 可以传给后台，再经过解析获取用户的 openid
                              // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                              // wx.request({
                              //     // 自行补上自己的 APPID 和 SECRET
                              //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
                              //     success: res => {
                              //         // 获取到用户的 openid
                              //         console.log("用户的openid:" + res.data.openid);
                              //     }
                              // });
                          }
                      });
                      wx.getUserInfo({
                        success: function(res){
                          self.setData({
                            thumb: res.userInfo.avatarUrl,
                            nickname: res.userInfo.nickName
                          })
                        }
                      })
                  }
              });
          } else {
              // 用户没有授权
              // 改变 isHide 的值，显示授权页面
              self.setData({
                  isHide: true
              });
            }
      }
    });
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
      url: 'https://timelooper.wang/feng/orders.php',
      success(res){
        self.setData({
          orders: res.data
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
        wx.getUserInfo({
          success: function(res){
            that.setData({
              thumb: res.userInfo.avatarUrl,
              nickname: res.userInfo.nickName
            })
          }
        })
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
  onShow(){
    var self = this;
    /**
     * 获取本地缓存 地址信息
     */
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          hasAddress: true,
          address: res.data
        })
      }
    })
  },
  /**
   * 发起支付请求
   */
  payOrders(){
    wx.requestPayment({
      timeStamp: 'String1',
      nonceStr: 'String2',
      package: 'String3',
      signType: 'MD5',
      paySign: 'String4',
      success: function(res){
        console.log(res)
      },
      fail: function(res) {
        wx.showModal({
          title:'支付提示',
          content:'<text>',
          showCancel: false
        })
      }
    })
  }
})