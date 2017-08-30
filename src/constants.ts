/**
 * Created by alexmarcos on 24/8/17.
 */


let AVAILABLES_EMPTY_GROUPS = ['email','phone','numberID','name'];

let CONSTANT = {
    AVAILABLES_EMPTY_GROUPS : AVAILABLES_EMPTY_GROUPS,
    URL : {
        URL_CONFIRM_LOGIN : " http://vidchainpoc.azurewebsites.net/confirm_login.php"
    },
    SOCIAL_LOGINS:{
        'FACEBOOK':'FACEBOOK',
        'GOOGLE':'GOOGLE'
    },
    SOCIAL_LOGIN_ATTRIBUTES:{
      "FACEBOOK":[{
          name : 'name',
          value : "social.facebook.data.full_name",
          unique : true,
      },{
          name : "email",
          value : "social.facebook.data.email",
          unique : false,
      },{
          name : "photo",
          value : "social.facebook.uid",
          unique : true,
      }],
      "GOOGLE":[{
          name : 'name',
          value : "social.google.data.full_name",
          unique : true,
      },{
          name : "email",
          value : "social.google.data.email",
          unique : false,
      },{
          name : "photo",
          value : "social.google.data.profile_picture",
          unique : true,
      },{
          name : "gender",
          value : "social.google.data.raw_data.gender",
          unique : true,
      }],
    }
};
export default CONSTANT;