//app.js

var app = getApp();
var aldstat = require("./utils/ald-stat.js");
var utils = require('./utils/utils.js');
var QQMapWX = require('./utils/qqmap-wx-jssdk.js');

App({
  /**
   * @brief 先检查是否还处于登录状态，如果成功直接进入主页，否则进行登录流程
   */
  globalData: {
    category_foreign__to_china:{
      "food": 'restaurant',
      "parks": 'living_service',
      "travel": 'tourism',
      "building": 'hotel',
      "arts": 'entertainment',
      "shopes": 'mall',
      "nightlife" : 'nightlife'
    },
    windowWidth: '',
    rawData:{},
    windowHeight: '',
    openid: '',
    sessionid: '',
    checkins: [],
    latitude: 0.0,
    longitude: 0.0,
    qqmapsdk: {},
    qrcodeUrl: "",
    weatherCity:"",
    locationMap: {
      "房产小区": "resident",
      "教育学校": "school",
      "酒店宾馆": "hotel",
      "公司企业": "company",
      "购物": "mall",
      "美食": "restaurant",
      "娱乐休闲": "entertainment",
      "机构团体": "bureau",
      "银行金融": "bank",
      "生活服务": "living_service",
      "旅游景点": "tourism",
      "基础设施": "infra",
      "医疗保健": "hospital",
      "运动健身": "sports"
    },
    categoryDic:{},
    districtDict:{},
    placeDict:{},
    checkinLastTimeTable: new Array(),
    scores: 30
  },
  
  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  onLaunch: function () {
    
    var res = wx.getSystemInfoSync();
    var that = this;
    this.globalData.windowWidth = res.windowWidth;
    this.globalData.windowHeight = res.windowHeight;

    wx.setStorageSync('first_tabbar', 'no')
    wx.setStorageSync('refresh_activity', 'yes')
    //外部类
    this.globalData.qqmapsdk = new QQMapWX({
      key: 'A5EBZ-DCPK4-IFSU7-XIQGW-NJKPJ-2NFLM'
    });
    console.log('手机高度为 ' + res.windowHeight);
    console.log('手机宽度为 ' + res.windowWidth);
    console.log("发送请求");
    
    /*
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Version',
      method: 'POST',
      
      data:{
        version_code:'0.96'
      },
      success: function (res) {
        console.log(res)
        console.log('....')
        if (res.data.status == 'OK'){
          if (res.data.version == 1){
            
            that.globalData.tabbar = {
              color: "#353535",
              selectedColor: "#3cc51f",
              borderStyle: "white",
              backgroundColor: "#ffffff",
              list: [
                {
                  pagePath: "/pages/weather/weather",
                  text: "天气",
                  iconPath: "/pages/images/icon/weather_icon.png",
                  selectedIconPath: "/pages/images/icon/weather_icon.png",
                  selected: false
                },
                {
                  pagePath: "/pages/activity/activity",
                  text: "活动",
                  iconPath: "/pages/images/icon/activity_icon.png",
                  selectedIconPath: "/pages/images/icon/activity_icon.png",
                  selected: true
                },
                {
                  pagePath: "/pages/mood/mood",
                  text: "心情",
                  iconPath: "/pages/images/icon/mood_icon.png",
                  selectedIconPath: "/pages/images/icon/mood_icon.png",
                  selected: false
                },
                {
                  pagePath: "/pages/discover/discover",
                  text: "发现",
                  iconPath: "/pages/images/icon/discover_icon.png",
                  selectedIconPath: "/pages/images/icon/discover_icon.png",
                  selected: false
                },
                {
                  pagePath: "/pages/account/account",
                  text: "账号",
                  iconPath: "/pages/images/icon/account_icon.png",
                  selectedIconPath: "/pages/images/icon/account_icon.png",
                  selected: false
                }
              ],
              position: "bottom"
            }
            console.log(that.globalData.tabbar)
          }
          else if(res.data.version == 0){
            that.globalData.tabbar = {
              color: "#353535",
              selectedColor: "#3cc51f",
              borderStyle: "white",
              backgroundColor: "#ffffff",
              list: [
                {
                  pagePath: "/pages/weather/weather",
                  text: "天气",
                  iconPath: "/pages/images/icon/weather_icon.png",
                  selectedIconPath: "/pages/images/icon/weather_icon.png",
                  selected: false
                },
                /*
                {
                  pagePath: "/pages/activity/activity",
                  text: "活动",
                  iconPath: "/pages/images/icon/activity_icon.png",
                  selectedIconPath: "/pages/images/icon/activity_icon.png",
                  selected: true
                },
                {
                  pagePath: "/pages/mood/mood",
                  text: "心情",
                  iconPath: "/pages/images/icon/mood_icon.png",
                  selectedIconPath: "/pages/images/icon/mood_icon.png",
                  selected: false
                },
                {
                  pagePath: "/pages/discover/discover",
                  text: "发现",
                  iconPath: "/pages/images/icon/discover_icon.png",
                  selectedIconPath: "/pages/images/icon/discover_icon.png",
                  selected: false
                },
                {
                  pagePath: "/pages/account/account",
                  text: "账号",
                  iconPath: "/pages/images/icon/account_icon.png",
                  selectedIconPath: "/pages/images/icon/account_icon.png",
                  selected: false
                }
              ],
              position: "bottom"
            }
          }
        }
        else{
          wx.showToast({
            title: '读取版本错误!',
          })
        }
      },
      fail: function(res){
        wx.showToast({
          title: '读取版本错误!',
        })
      }
    })*/
    //发送一个请求到服务器
    //如果结果是1，表示可以使用心情功能
    //如果结果是0，表示不可以使用心情功能
  },

  onShow: function (options) {
  },
  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {

  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {

  }
  /**
   * 
   */


})

