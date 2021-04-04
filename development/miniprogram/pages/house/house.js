//house.js
const app = getApp()
let currentPage = 0 // 当前第几页,0代表第一页 
let pageSize = 10 //每页显示多少数据 
Page({
  data: {
    dataList: [], //放置返回数据的数组  
    loadMore: false, //"上拉加载"的变量，默认false，隐藏  
    loadAll: false, //“没有数据”的变量，默认false，隐藏  
    ms_img_dir:"cloud://cloud-house-v8lqu.636c-cloud-house-v8lqu-1300500709/image_low_resolution",//民宿低分辨率存放地址
    top_swiper_img_dir: "cloud://cloud-house-v8lqu.636c-cloud-house-v8lqu-1300500709/image",
    top_swiper_img_name_list:["cover_1.jpg","cover_2.jpg","cover_3.jpg"],
    btn_img_name_list: ["abstract.jpg", "catalogue.jpg","map.jpg"]
  },

  
  onLoad: function () {
    //加载页面初始化
    currentPage = 0;
    this.setData({
      loadMore: false, //"上拉加载"的变量，默认false，隐藏  
      loadAll: false, //“没有数据”的变量，默认false，隐藏  
    });
    this.getData();
    },
  //搜索功能

  //轮播图 图片点击事件
  click_swiper_Img: function (e) {
    var src_list = new Array();
    for (var i = 0; i < this.data.top_swiper_img_name_list.length; ++i) 
    {
      var temp_src = this.data.top_swiper_img_dir + "/" + this.data.top_swiper_img_name_list[i];
      src_list[i] = temp_src;

    };
    var src = e.target.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接  
      urls: src_list, // 需要预览的图片http链接列表  
    })
  },
  //按钮 图片点击事件
  click_btn_Img: function (e) {
    var src_list = new Array();
    for (var i = 0; i < this.data.btn_img_name_list.length; ++i) {
      var temp_src = this.data.top_swiper_img_dir  + this.data.btn_img_name_list[i];
      src_list[i] = temp_src;

    };
    var src = e.target.dataset.src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接  
      urls: src_list, // 需要预览的图片http链接列表  
    })
  },
  //页面跳转
  tapToIntroPage: function (e) {
    var ms_en_name = e.currentTarget.dataset.ms_en_name;
    app.globalData.ms_en_name = ms_en_name;
    wx.navigateTo({
      url: '/pages/house-introduction/introduction'
    });
  },

  //页面上拉触底事件的处理函数
  onReachBottom: function () {
    console.log("上拉触底事件")
    let that = this
    if (!that.data.loadMore) {
      that.setData({
        loadMore: true, //加载中  
        loadAll: false //是否加载完所有数据
      });

      //加载更多，这里做下延时加载
      setTimeout(function () {
        that.getData()
      }, 500)
    }
  },
   //访问网络,请求数据 
  getData() {
    let that = this;

    //第一次加载数据
    if (currentPage == 1) {
      this.setData({
        loadMore: true, //把"上拉加载"的变量设为true，显示  
        loadAll: false //把“没有数据”设为false，隐藏  
      })
    }
    //云数据的请求
    wx.cloud.database().collection("info")
      .skip(currentPage * pageSize) //从第几个数据开始
      .limit(pageSize)
      .get({
        success(res) {
          if (res.data && res.data.length > 0) {
            console.log("请求成功", res.data)
            currentPage++
            //把新请求到的数据添加到dataList里  
            let list = that.data.dataList.concat(res.data)
            that.setData({
              dataList: list, //获取数据数组    
              loadMore: false //把"上拉加载"的变量设为false，显示  
            });
            if (res.data.length < pageSize) {
              that.setData({
                loadMore: false, //隐藏加载中。。
                loadAll: true //所有数据都加载完了
              });
            }
          } else {
            that.setData({
              loadAll: true, //把“没有数据”设为true，显示  
              loadMore: false //把"上拉加载"的变量设为false，隐藏  
            });
          }
        },
        fail(res) {
          console.log("请求失败", res)
          that.setData({
            loadAll: false,
            loadMore: false
          });
        }
      })
  },
})
