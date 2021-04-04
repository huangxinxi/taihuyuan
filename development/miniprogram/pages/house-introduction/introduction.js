//introduction.js

Page({

  data: {

    ms_img_dir: "cloud://cloud-house-v8lqu.636c-cloud-house-v8lqu-1300500709/image_low_resolution",//民宿低分辨率存放地址
    readmore: {
      status: false,
      tip: '查看更多'
    }
  },
  onLoad: function () {



    var ms_en_name = getApp().globalData.ms_en_name;
    var _this = this;
    // const list = Array(100).fill().map((e, i) => i + 1);  //定义一个1到100的数组
    //1、引用数据库
    const db = wx.cloud.database()
    //2、开始查询数据了  info对应的是集合的名称
    db.collection('info')
    .where({
      ms_en_name: ms_en_name
    })
    .get({
      //如果查询成功的话
      success: res => {
        //ms_count_img = res.data[0].ms_count_img;
        // var list = new Array(ms_count_img-1);
        // for (var num = 0; num < ms_count_img; num++){
        //     list[num] = num+1;
        // }
        //这一步很重要，赋值，没有这一步的话，前台就不会显示值
        this.setData({
          //queryResult: JSON.stringify(res.data),
          ms_name: res.data[0].ms_name,
          ms_en_name: res.data[0].ms_en_name,
          ms_address: res.data[0].ms_address,
          ms_tel: res.data[0].ms_tel,
          ms_price: res.data[0].ms_price,
          ms_intro: res.data[0].ms_intro,
          ms_count_img : res.data[0].ms_count_img,
          list: Array(res.data[0].ms_count_img).fill().map((e, i) => i + 1)
       })
        console.log('[数据库] [查询记录] 成功: ', res);
        console.log('list : ', this.data.list);

      }
    })
  },

  //图片点击事件
  clickImg: function (e) {
    var src_list = new Array();
    for(var i = 1 ; i <= this.data.ms_count_img ; ++i)
    {
      var src = this.data.ms_img_dir + "/" + this.data.ms_en_name + "/" + this.data.ms_en_name + i + ".jpg";
      src_list[i-1] = src;
      console.log(src)
    };
    var src = e.target.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接  
      urls: src_list, // 需要预览的图片http链接列表  
    })
  },

  //拨打电话
  calling: function (e) {
    var phoneNumber = e.target.dataset.ms_tel;
    wx.makePhoneCall({
      phoneNumber: phoneNumber, //此号码并非真实电话号码，仅用于测试
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  onReady() {
    const query = wx.createSelectorQuery()
    let self = this
    query.select(".content").boundingClientRect(function (res) {
      const lineHeight = 5
      const height = res.height
      const status = "readmore.status"
      self.setData({
        [status]: height / lineHeight > 3
      })
    }).exec()
  },
  toggle() {
    const status = this.data.readmore.status
    this.setData({
      readmore: {
        status: !status,
        tip: status ? '收起' : '查看更多'
      }
    })
  },

  // previewImg: function (event) {
  //   var that = this;
  //   console.log(event);
  //   var imgs = event.currentTarget.dataset.src;
  //   var temp = [];
  //   for (var index in imgs) {
  //     temp = temp.concat(app.globalData.SERVER_HOST + imgs[index]);
  //   }
  //   wx.previewImage({
  //     current: app.globalData.SERVER_HOST + event.currentTarget.dataset.currentimg,
  //     urls: temp,
  //   })
  // }
 
})
  
