import * as qiniu from 'qiniu-js'
import SparkMD5 from 'spark-md5'
import fa from "element-ui/src/locale/lang/fa";
export default  function (Vue,options){
  Vue.prototype.BmobOption = {
    //文章列表表
    PsList:{
      objectId:"",
      description:"",
      passage:"",
      title:"",
      type: false,
      coverlink:"",
      createdAt:null,
      updatedAt:null,
      /*查询所有文章列表*/
      findPsList(callback) {
        const query = Bmob.Query("PassageList");
        query.equalTo("type", "==", true);
        query.find().then(res => {
          callback(res)
        });
      },
      /*查询所有草稿列表*/
      findAllDraft(callback) {
        const query = Bmob.Query("PassageList");
        query.equalTo("type", "==", false);
        query.find().then(res => {
          callback(res)
        });
      },
      /*保存指定文章*/
      /*保存指定草稿*/
      savePList(plist,type,passage,callback,errback){
        const pointer = Bmob.Pointer('Passage')
        const poiID = pointer.set(passage.objectId)
        const query = Bmob.Query('PassageList');
        query.set("type", type)
        query.set("ftime",this.dateFormat("YYYY-mm-dd HH:MM:SS",new Date()))
        query.set("title", plist.title)
        query.set("description", plist.description)
        query.set("coverlink", plist.coverlink)
        query.set("passage", poiID)
        query.save().then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      },

      /*查询指定文章*/
      /*查询指定草稿*/
      findPList(objectId,callback,errback) {
        const query = Bmob.Query('PassageList');
        query.get(objectId).then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      },
      dateFormat(fmt, date) {
        let ret;
        const opt = {
          "Y+": date.getFullYear().toString(),        // 年
          "m+": (date.getMonth() + 1).toString(),     // 月
          "d+": date.getDate().toString(),            // 日
          "H+": date.getHours().toString(),           // 时
          "M+": date.getMinutes().toString(),         // 分
          "S+": date.getSeconds().toString()          // 秒
          // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
          ret = new RegExp("(" + k + ")").exec(fmt);
          if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
          };
        };
        return fmt;
      },
      /*更新指定文章*/
      /*更新指定草稿*/
      updatePList(plist,callback,errback){
        const query = Bmob.Query('PassageList');
        query.set('id', plist.objectId) //需要修改的objectId
        query.set("title", plist.title)
        query.set("ftime",this.dateFormat("YYYY-mm-dd HH:MM:SS",new Date()))
        query.set("type", plist.type)
        query.set("description", plist.description)
        query.set("coverlink", plist.coverlink)
        query.save().then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      },
      /*删除指定文章*/
      /*删除指定草稿*/
      deletePList(objectId,callback,errback) {
        const query = Bmob.Query('PassageList');
        query.destroy(objectId).then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      },
      /*分页查询*/
      findPsLByPage(type,limit,page,callback){
        const query = Bmob.Query("PassageList");
        if(type!=null){
          query.equalTo("type", "==", type);
        }
        query.limit(limit);
        query.skip(page * limit)
        query.order("-ftime");
        query.find().then(res => {
          callback(res)
        });
      }
    },

    //文章表
    Passage:{
      objectId:"",
      content:"",
      createdAt:null,
      updatedAt:null,
      /*添加或更新文章*/
      savePassage(passage,callback,errback){
        const query = Bmob.Query('Passage');
        query.set("content",passage.content)
        query.save().then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      },
      /*查询所有文章*/
      findAllPassage(type,callback) {
        const query = Bmob.Query("Passage");
        if (type!=null)
          query.equalTo("type", "==", type);
        query.find().then(res => {
          callback(res)
        });
      },
      /*查询指定文章*/
      findOnePassage(objectId,callback,errback){
        const query = Bmob.Query('Passage');
        query.get(objectId).then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      },
      /*更新文章*/
      updatePassage(passage,callback,errback){
        const query = Bmob.Query('Passage');
        query.set("id",passage.objectId)
        query.set("content", passage.content)
        query.save().then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      },
      /*删除文章*/
      deletePassage(objectId,callback,errback){
        const query = Bmob.Query('Passage');
        query.destroy(objectId).then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      }
    },

    //链接表
    LinkTable:{
      objectId:"",
      icon:"",
      url:"",
      type:"",
      name:"",
      createdAt:null,
      updatedAt:null,
      /*保存链接*/
      saveLink(link,callback,errback){
        const query = Bmob.Query('LinkTable');
        query.set("icon", link.icon)
        query.set("name", link.name)
        query.set("type", link.type)
        query.set("url",  link.url)
        query.save().then(res => {
          callback(res)
        }).catch(err => {
          errback(res)
        })
      },
      /*查询链接列表*/
      findAllLink(type,callback){
        const query = Bmob.Query("LinkTable");
        if (type!=null)
          query.equalTo("type", "==", type);
        query.find().then(res => {
          callback(res)
        });
      },
      /*删除链接列表项*/
      deleteLink(objectId,callback,errback) {
        const query = Bmob.Query('LinkTable');
        query.destroy(objectId).then(res => {
          callback(res)
        }).catch(err => {
          errback(err)
        })
      }
    }

  }
  Vue.prototype.Qiniu = {
    Upload:{
      /*图片上传*/
      /*获取Tocken*/
      uploadImg(file,tocken,onComplete,onError,onProgress) {
        var file_name = file.name+""
        var fnindex = file_name.lastIndexOf(".")
        var prefix = file_name.substring(0,fnindex)+new Date().toUTCString()
        var suffix = file_name.substring(fnindex,file_name.length)
        var key = SparkMD5.hash(prefix)+suffix;
        var domain = "http://qiniu.cotubo.cn/"; //你的七牛空间域名
        var config = {
          useCdnDomain: true,
          disableStatisticsReport: false,
          retryCount: 6,
          region: qiniu.region.z2
        };
        var putExtra = {
          fname: file_name,
          params: {},
          mimeType: null
        };
        var observer = {
          next(res) {
            if (onProgress!=null)
              onProgress(res.total.percent)
          },
          error(err) {
            onError(err)
          },
          complete(res) {
            onComplete(domain + res.key)
          }
        }
        var observable = qiniu.upload(file, key, tocken, putExtra, config);
        observable.subscribe(observer);
      }
    }
  }
  Vue.prototype.Listen = {
    cbk:null,
    setCallback(callback){
      this.cbk = callback
    },
    on(param){
      if (param.l==true&&param.r==true){
        this.cbk
      }
    }
  }
}
