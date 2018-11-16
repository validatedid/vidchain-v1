/**
 * Created by alexmarcos on 24/8/17.
 */


let AVAILABLES_EMPTY_GROUPS = ['email','phone','numberID','name','education','photo', 'profession'];

let CONSTANT = {
    AVAILABLES_EMPTY_GROUPS : AVAILABLES_EMPTY_GROUPS,
    URL : {
        URL_CONFIRM_LOGIN : " http://vidchainpoc.azurewebsites.net/confirm_login.php",
        URL_CONFIRM_EMAIL : " http://vidchainpoc.azurewebsites.net/validate_email.php",
        URL_VALIDATED_BIOMETRICS : " http://vidchainpoc.azurewebsites.net/validate_biometrics.php",
        URL_ETHEREUM :"http://vidchainapipre.cloudapp.net/api/v1.0/hash",
        URL_SHOW_ETHEREUM : "https://ropsten.etherscan.io/tx/"
    },
    BLOCKCHAIN : {
        ALASTRIA : {
            DESTINATION : "alastria",
            TESTNET : "testnet",
            URL_SHOW_ACCOUNT_TX : "https://alastria-explorer.councilbox.com/account/0x503d056BEB96bC865F26150E74dBB4AadeC3E0DB/transactions",
            URL_SHOW_TX : "https://alastria-explorer.councilbox.com/transaction/",
        }
    },
    SOCIAL_LOGINS:{
        'FACEBOOK':'FACEBOOK',
        'GOOGLE':'GOOGLE',
        'DNI':'DNI'
    },
    SOCIAL_LOGIN_ATTRIBUTES:{
      "FACEBOOK":[
        
        /**** DATOS CON FIREBASE*****/
        /* 
        {
          name : 'name',
          value : "additionalUserInfo.profile.name",
          unique : true,
        },{
            name : "email",
            value : "additionalUserInfo.profile.email",
            unique : false,
        },{
            name : "photo",
            value : "additionalUserInfo.profile.picture.data.url",
            unique : true,
        },{
            name : "gender",
            value : "additionalUserInfo.profile.gender",
            unique : true,
        },{
            name : "birthday",
            value : "additionalUserInfo.profile.birthday",
            unique : true,
        }
        */
        {
            name : 'name',
            value : "name",
            unique : true,
        },{
            name : "email",
            value : "email",
            unique : false,
        },{
            name : "photo",
            value : "picture.data.url",
            unique : true,
        },{
            name : "gender",
            value : "gender",
            unique : true,
        },{
            name : "birthday",
            value : "birthday",
            unique : true,
        }
        ],
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
        "GOOGLE":[
        /**** DATOS CON FIREBASE *****/
        /*
        {
            name : 'name',
            value : "additionalUserInfo.profile.name",
            unique : true,
        },{
            name : "email",
            value : "additionalUserInfo.profile.email",
            unique : false,
        },{
            name : "photo",
            value : "additionalUserInfo.profile.picture",
            unique : true,
        }*/
        {
            name : 'name',
            value : "displayName",
            unique : true,
        },{
            name : "email",
            value : "email",
            unique : false,
        },{
            name : "photo",
            value : "imageUrl",
            unique : true,
        }
        ],
    }
};
export default CONSTANT;