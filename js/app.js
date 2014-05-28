//Application Key : D1QUmCsQ8oUa8LSLHOWbHLNI6AXuTBlA4W13spz1
//JavaScript Key : x0kPunkKrfmiMmBj4iIoci4UTh0uJOV80ffLRMfj

(function(){

 //初始化Parse();
  Parse.initialize("D1QUmCsQ8oUa8LSLHOWbHLNI6AXuTBlA4W13spz1","x0kPunkKrfmiMmBj4iIoci4UTh0uJOV80ffLRMfj");

 //編譯template engine函數();
  var templates = {};
  ['loginView','evaluationView','updateSuccessView'].forEach(function(e){
    var dom = document.getElementById(e).text;
    templates[e] = doT.template(dom);
  }); 

// 可選-編寫共用函數();
 var handler = {

   navbarFunc: function(){
    var currentUser = Parse.User.current();
    
     if(currentUser){

 //      顯示哪些button();
       document.getElementById('loginButton').style.display = "none"; 
       document.getElementById('evaluationButton').style.display = "display"; 
       document.getElementById('logoutButton').style.display = "display"; 

     } else {

 //      顯示哪些button();    
       document.getElementById('loginButton').style.display = "display"; 
       document.getElementById('evaluationButton').style.display = "none"; 
       document.getElementById('logoutButton').style.display = "none"; 
     }

   },

   logInViewFunc: function(redirect){

  //   把版型印到瀏覽器上();
      document.getElementById('content').innerHTML = templates.loginView();
      var currentUser = Parse.User.current();
      var postAction = function(){
        handler.navbarFunc();
        window.location.hash = (redirect) ? redirect : 'index';
      }

      if(currentUser){
        window.location.hash = '';
      } 
      else{
 //    綁定登入表單的學號檢查事件(); // 可以利用TAHelp物件
        var messgae = (TAHelp.getMemberlistOf(document.getElementById('form-signin-student-id').value)===false ? '學號不存在，請再確認一次' : '');
        document.getElementById('form-signin-messgae').innerHTML = message;
          
 //    綁定註冊表單的學號檢查事件(); // 可以利用TAHelp物件
        var messgae = (TAHelp.getMemberlistOf(document.getElementById('form-signup-student-id').value)===false ? '學號不存在，請再確認一次' : '');
        document.getElementById('form-signup-messgae').innerHTML = message;

 //    綁定註冊表單的密碼檢查事件(); // 參考上課範例
     document.getElementById('form-signup-password1').value.addEventListener('keyup',function(){
      var signupForm_password = document.getElementById('form-signin-password');
      var messgae = (this.value !== signupForm_password.value) ? '密碼不一致，請再確認一次' : '';
        document.getElementById('form-signin-messgae').innerHTML = messgae;
     });

  //   綁定登入表單的登入檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.logIn
     document.getElementById('form-signin').addEventListener('submit',function(){
      Parse.User.logIn(document.getElementById('form-signin-student-id').value,
      document.getElementById('form-signin-password').value,{
        success: function(user){
          postAction();
        },
        error: function(user,error){
        }
      });
     });

  //   綁定註冊表單的註冊檢查事件(); // 送出還要再檢查一次，這裡會用Parse.User.signUp和相關函數
     document.getElementById('form-signup').addEventListener('submit',function(){
      var user = new Parse.User();
      user.set("username",document.getElementById('form-signup-student-id').value);
      user.set("password",document.getElementById('form-signup-password').value);
      user.set("email",document.getElementById('form-signup-email').value);

      user.signUp(null,{
        success: function(user){
          postAction();
        },
        error: function(user,error){
          document.getElementById('form-signin-messgae').innerHTML =
          error.messgae + '[' + error.code + ']';
        }
        });
        },false);
      }
    },

    evalViewFunc: function(){}

  };

 /*    // 基本上和上課範例購物車的函數很相似，這邊會用Parse DB
     var evaluation = Parse.Object.extend("Evaluation");
     var userCurrent = Parse.User.current();
     var parseACL = new Parse.ACL;
         parseACL.setPublicReadAccess(false);
         parseACL.setPublicWriteAccess(false);
         parseACL.setReadAccess(userCurrent,true);
         parseACL.setWriteAccess(userCurrent,true);

     var parseQuery = new Parse.Query(evaluation);
         parseQuery.equalTo("user",userCurrent);
         
         parseQuery.first({
          success:function(parseQuery){
            window.EVAL = parseQuery;
            if(parseQuery===undefined){
              var idCheck = TAHelp.getMemberlistOf(userCurrent.get("username")).filter(function(e){
                return e.StudentID !== userCurrent.get("username") ? true:false}).map(function(e){e.scores=["0","0","0","0"];
                return e})}
            else{var evalToJSON = parseQuery.toJSON().evaluations}

            document.getElementById("content").innerHTML = userCurrent.evaluationView;

    };
*/         

//     問看看Parse有沒有這個使用者之前提交過的peer review物件(

//     沒有的話: 從TAHelp生一個出來(加上scores: [‘0’, ‘0’, ‘0’, ‘0’]屬性存分數並把自己排除掉)

//     把peer review物件裡的東西透過版型印到瀏覽器上();

//     綁定表單送出的事件(); // 如果Parse沒有之前提交過的peer review物件，要自己new一個。或更新分數然後儲存。

 

 var router = Parse.Router.extend({

   routes:{
    '': 'index',
    'evaluation/': 'peer_evaluation'

   },

   index: handler.logInViewFunc,
   peer_evaluation: handler.evalViewFunc,

 });

  this.Router = new router();
  Parse.history.start();
  handler.navbarFunc();

})();