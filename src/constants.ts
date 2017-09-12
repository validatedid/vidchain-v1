/**
 * Created by alexmarcos on 24/8/17.
 */


let AVAILABLES_EMPTY_GROUPS = ['email','phone','numberID','name','education'];

let CONSTANT = {
    AVAILABLES_EMPTY_GROUPS : AVAILABLES_EMPTY_GROUPS,
    URL : {
        URL_CONFIRM_LOGIN : " http://vidchainpoc.azurewebsites.net/confirm_login.php",
        URL_CONFIRM_EMAIL : " http://vidchainpoc.azurewebsites.net/validate_email.php",
        URL_ETHEREUM :"http://vps391817.ovh.net/api/chainevidences",
    },
    SOCIAL_LOGINS:{
        'FACEBOOK':'FACEBOOK',
        'GOOGLE':'GOOGLE',
        'DNI':'DNI'
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
        "DNI":[{
          name : 'name',
          value : "Name",
          unique : true,
      },{
          name : "photo",
          value : "PhotoB64",
          unique : true,
      },{
          name : "gender",
          value : "Sex",
          unique : true,
      },{
          name : "birthday",
          value : "DateOfBirth",
          unique : true,
      },{
          name : "nationality",
          value : "Nationality",
          unique : true,
      },{
          name : "city",
          value : "City",
          unique : true,
      },{
          name : "address",
          value : "Address",
          unique : true,
      },{
          name : "nif",
          value : "DniNumber",
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