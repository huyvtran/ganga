import { StyleSheet, Dimensions,Platform } from 'react-native';
import {colors} from '../../config/styles.js';
const window = Dimensions.get('window');

export default StyleSheet.create({

  container:{
    // backgroundColor: '#0ff',
    alignItems:'center',
    minHeight:'100%',
    // minHeight:'100%',
    // flex:1,
  },
  /*containerView:{
  	backgroundColor: '#0ff',
    alignItems:'center',
    justifyContent:'center',
    height:100
  },*/
  formContainer:{
    // alignItems:'center',
    paddingHorizontal:'10%',
  },
  formInputView: {
    width:'90%',
  },
  headertitle:{
     fontSize: 20,
     marginTop:20
  },
    linkText:{
    color: colors.textLight,
    // fontSize: 17,
    fontFamily:"Montserrat-Bold",
    fontWeight:600
    // textDecorationLine: 'underline'
  },
    linkLightText:{
    color: colors.textLight,
    // fontSize: 15,
    fontFamily:"Montserrat-Regular",
  },
loginTitleTxt:{
    fontSize: 22,
    color:'#c10000',
    fontFamily:"Montserrat-Bold",
    textAlign:'center'

  },
  inputText:{
    borderWidth:1,
    borderColor:'#aaa',
    height: 40,
    paddingLeft:10,
    textAlignVertical:'center',
    paddingTop:0,
    paddingBottom:0,
  },
  labelText:{
    top:6,
    paddingLeft:2,
  },
  button:{
    width:'100%',
    backgroundColor: colors.button,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
      borderRadius:5
  },
  marginTB:{
    marginVertical: 5,
    // marginBottom: 20, 
  },
  buttonText:{
    color: colors.buttonText,
    fontSize: 13,
    fontFamily:"Montserrat-Regular",
  },
  linkWrap:{
    width: '100%',
    flexDirection:'row',
    justifyContent:'space-between',
  },
  linkText:{
    // color: colors.primary,
    fontSize: 15,
    fontFamily:"Montserrat-Regular",
  },
 bgImage:{
    // flex:1,
    width:'100%',
    height:'100%',
    alignItems:'center',
  },
  outerWrapper:{
    width:'100%',
    alignItems:'center',
    marginTop:((Platform.OS === 'ios') ? 0 : 0),

  },

  logoRoundWrapper :{
    height:80,
    width:80,
    borderRadius:80/2,
    backgroundColor:'#fff',
    position:'absolute',
    zIndex:1,
    borderColor: colors.primary,
    borderWidth:10,
    padding:6,
  },

  formWrapper:{
    width:'100%',
    backgroundColor:'#fff',
    // padding:10,
    paddingHorizontal:5,
    paddingBottom : 25,
    alignItems:'center',
    // shadowOpacity: 0.8,
    // shadowColor: 'grey',
    // shadowRadius: 5,
    shadowOffset: { height: 2, width: 0 },
  },

  smInputWrapper : {
    // width:'86%',
    borderColor:'#666',
    borderWidth:1,
    flexDirection:'row',
    borderRadius: 3,
  },

  smInputImgWrapper : {
    width:'10%',
    justifyContent:'center',
    alignItems:'center',
    borderRightWidth:1,
    borderColor: colors.textLight,
    marginVertical:5,

    // paddingHorizontal: 10
  },

  smInputTextWrapper : {
    width:'85%'
  },

  inputWrapper : {
   width:'100%',
    borderColor:'#666',
    borderWidth:1,
    flexDirection:'row',
    borderRadius: 5,
  },

  inputImgWrapper : {
    width:'10%',
    justifyContent:'center',
    alignItems:'center',
    borderRightWidth:1,
    borderColor: colors.textLight,
    marginVertical:15,

  },

  inputTextWrapper : {
    width:'88%'
  },

  marginBottom30: {
    marginBottom: 30,
  },

  marginTop30:{
    marginTop: 30
  },

  marginBottom20:{
    marginBottom: 20
  },
  
  buttonContainer:{
    width:'90%',
    ...Platform.select({
      ios:{
        justifyContent:'center',
        marginLeft: 40

      },
      android : {
        alignItems:'center'
      }
    })
  },
  buttonContainer1:{
    width:'100%',
  },
  textContainer:{
    height:'auto',
    paddingLeft:10
  },
  textInputContainer:{
    backgroundColor:'transparent',
    // left:5,
    // fontFamily:"Montserrat-Regular",
    borderBottomColor: "transparent"
  },
  textTitle:{
    fontFamily:"Montserrat-Regular",
    top:0,
  },
  textStyle:{
    fontFamily:"Montserrat-Regular",
    backgroundColor:'transparent',
    paddingTop:0,
    marginTop:-6,
  },
  textLabel:{
    backgroundColor:'#fff',
    fontFamily:"Montserrat-Regular",
    top:-7,

  },
  errorWrapper:{
    width:'100%',
    marginBottom:-10
  },
  errorText:{
    color:'#dc3545',
    fontSize:13,
    fontFamily:'Montserrat-Regular',
    paddingHorizontal:25
  },
  successText:{
    color:'#28a745',
    fontSize:13,
    fontFamily:'Montserrat-Regular'
  },
  eyeWrapper:{
    width:'15%',
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:"#f0f"
  },
  inputText2Wrapper:{
    width:'74%',
    justifyContent:'center'
  },
  button1Container:{
    width:'45%',
    // marginTop:25,
    ...Platform.select({
      ios:{
        justifyContent:'center',
        // marginLeft: 40

      },
      android : {
        alignItems:'center'
      }
    })
  },
   buttonSignUp:{
     width:'85%',
    backgroundColor: colors.buttonSignUp,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius:50,
    borderWidth:1,
    borderColor:'#333'

  },
   buttonSignInText:{
    color: colors.buttonText1,
    borderRadius:50,
    fontSize:13,
    fontFamily:"Montserrat-Regular",
  },
});
