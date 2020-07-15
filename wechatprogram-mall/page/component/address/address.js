// page/component/new-pages/user/address/address.js

var amapFile = require('../../../libs/amap-wx');

Page({
  data:{
    address:{
      name:'',
      phone:'',
      detail:''
    },
    markers: [],
    latitude: '',
    longitude: '',
    textData: {}
  },
  onLoad(){
    var self = this;
    
    wx.getStorage({
      key: 'address',
      success: function(res){
        self.setData({
          address : res.data
        })
      }
    })
    var myAmapFun = new amapFile.AMapWX({key: 'b32e6d3bea26e939d2ad99398bd126b2'});
    myAmapFun.getRegeo({
      iconPath: "../../../image/marker.png",
      iconWidth: 22,
      iconHeight: 32,
      success: function(data){
        var marker = [{
          id: data[0].id,
          latitude: data[0].latitude,
          longitude: data[0].longitude,
          iconPath: data[0].iconPath,
          width: data[0].width,
          height: data[0].height
        }]
        self.setData({
          markers: marker
        });
        self.setData({
          latitude: data[0].latitude
        });
        self.setData({
          longitude: data[0].longitude
        });
        self.setData({
          textData: {
            name: data[0].name,
            desc: data[0].desc
          }
        })
      },
      fail: function(info){
        wx.showModal({title: info.errMsg})
      }
    })

  },
  formSubmit(e){
    const value = e.detail.value;
    if (value.name && value.phone && value.detail){
      wx.setStorage({
        key: 'address',
        data: value,
        success(){
          wx.navigateBack();
        }
      })
    }else{
      wx.showModal({
        title:'提示',
        content:'请填写完整资料',
        showCancel:false
      })
    }
  }
})