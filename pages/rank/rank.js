// pages/rank/rank.js
var app = getApp();
var util = require("../../utils/utils.js");
Page({

  data: {
    nickName:"玉",
    rank:32,
    award:100,
    avatarUrl:"https://wx.qlogo.cn/mmopen/vi_32/nMg3EGicm0baeaZSYW2PGPKiamOlSwNae47QHmickDibr4M9icIO3j4AH3Af14FLFIrYT2W4g2tjIzU8vjvWFW6icg4A/132",
    ranklist: [
      {
        "openid": "caoye",
        "nickName": "cao",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/nMg3EGicm0baeaZSYW2PGPKiamOlSwNae47QHmickDibr4M9icIO3j4AH3Af14FLFIrYT2W4g2tjIzU8vjvWFW6icg4A/132",
        "award": "10",
        "rank": "1"
      },
      {
        "openid": "Yang Chen",
        "nickName": "LaoBan",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/nMg3EGicm0baeaZSYW2PGPKiamOlSwNae47QHmickDibr4M9icIO3j4AH3Af14FLFIrYT2W4g2tjIzU8vjvWFW6icg4A/132",
        "award": "9",
        "rank": "2"
      }, 
      {
        "openid": "caoye",
        "nickName": "cao",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/nMg3EGicm0baeaZSYW2PGPKiamOlSwNae47QHmickDibr4M9icIO3j4AH3Af14FLFIrYT2W4g2tjIzU8vjvWFW6icg4A/132",
        "award": "8",
        "rank": "3"
      },
      {
        "openid": "Yang Chen",
        "nickName": "LaoBan",
        "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/nMg3EGicm0baeaZSYW2PGPKiamOlSwNae47QHmickDibr4M9icIO3j4AH3Af14FLFIrYT2W4g2tjIzU8vjvWFW6icg4A/132",
        "award": "7",
        "rank": "4"
      },
    ],
    loading:false
  
  },

  onLoad: function (options) {

    this.setData({
      avatarUrl:options.avatarUrl,
      nickName:options.nickName
    });

    this.requestPersonalRank();
  },

  requestPersonalRank:function(){
    var that = this;

    var localTime = util.formatTime(new Date());
    console.log(localTime);

    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/WeeklyRanking',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid:app.globalData.sessionid,
        localTime:localTime
      },
      success:function(res){

        if(res.status == "OK"){
          that.setData({
            rank:res.rank,
            award:res.award
          });

          that.requestRankList();
        }else{
          that.loadingFail();
        }
      },
      fail:function(err){
        that.loadingFail();
      }
    });
  },

  requestRankList:function(){
    var that = this;

    var localTime = util.formatTime(new Date());

    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/RankList',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        localTime: localTime
      },
      success: function (res) {

        if (res.status == "OK") {
          that.setData({
            rankList: res.rankList
          });

          that.setData({
            loading:true
          })
        } else {
          that.loadingFail();
        }
      },
      fail: function (err) {
        that.loadingFail();
      }
    });
  },

  loadingFail:function(){
    wx.showModal({
      title: '提示',
      content: '加载失败，请稍后再试！',
      showCancel: false,
      success:function(res){
        wx.navigateBack({
          
        });
      }
    });
  }


})