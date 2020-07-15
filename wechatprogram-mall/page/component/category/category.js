Page({
    data: {
        category: [
            {name: '水果', id: 'shuiguo'},
            {name: '蔬菜', id: 'shucai'},
            {name: '肉类', id: 'roulei'},
            {name: '炒货', id: 'chaohuo'},
            {name: '甜点', id: 'tiandian'},
        ],
        detail:[
          {id: 'shuiguo', banner: '/image/list1.png', cate: '水果', 
            detail: [
             {thumb: '/image/c4.png', name: '猕猴桃'},
             {thumb: '/image/cate-apple.jpg', name: '苹果'},
             {thumb: '/image/cate-yingtao.jpg', name: '樱桃'}
            ]
          },
          {id: 'chaohuo', banner: '/image/s3.png', cate: '炒货',
            detail: [

            ]
        }
        ],
        curIndex: 0,
        isScroll: false,
        toView: 'shuiguo'
    },
    onReady(){
      var self = this;
    },
    switchTab(e){
      const self = this;
      this.setData({
        isScroll: true
      })
      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      setTimeout(function () {
        self.setData({
          isScroll: false
        })
      },1) 
    }
    
})