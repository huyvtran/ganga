import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { browserHistory } from 'react-router';
import $ from "jquery";
import jQuery from 'jquery';
import 'jquery-validation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import 'font-awesome/css/font-awesome.min.css';
import './SignUp.css';
import Message from '../blocks/Message/Message.js';
import Loader from "../common/loader/Loader.js";
import axios from 'axios';

class SignUp extends Component {

	constructor() {
		super();
		this.state = {
			checkUserExists: 0,
			loggedIn: false,
			auth: {
				firstname: '',
				lastname: '',
				mobNumber: '',
				email: '',
				pwd: '',
				signupPassword: '',
				role: ''
			},
			formerrors: {
				firstNameV: "",
				lastNameV: "",
				mobileV: "",
				emailIDV: "",
			},
			termsCondition: ["The price of products  is as quoted on the site from time to time.",
				"Price and delivery costs are liable to change at any time, but changes will not affect orders in respect of which we have already sent you a Despatch Confirmation.",
				"Products marked as 'non-returnable' on the product detail page cannot be returned.",
				"Products may not be eligible for return in some cases, including cases of buyer's remorse such as incorrect model or color of product ordered or incorrect product ordered."]
		}
		this.handleChange = this.handleChange.bind(this);
	}
	componentWillMount() {

	}
	validation() {
        $.validator.addMethod("regxfirstname", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Name should only contain letters.");
        $.validator.addMethod("regxmobNumber", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid mobile number.");
        
        $.validator.addMethod("regxsignupPassword", function (value, element, regexpr) {
            return regexpr.test(value);
		}, "Please enter valid address.");
		$.validator.addMethod("regxsignupConfirmPassword", function (value, element, regexpr) {
            return regexpr.test(value);
        }, "Please enter valid address.");
       
        jQuery.validator.setDefaults({
            debug: true,
            success: "valid"
        });

        $("#signUpUser").validate({
            rules: {
                firstname: {
                    required: true,
                    regxfirstname : /^[A-Za-z]*$/,
				},
				lastname: {
                    required: true,
                    regxfirstname : /^[A-Za-z]*$/,
                },
                mobNumber: {
                    required: true,
                    regxmobNumber: /^([7-9][0-9]{9})$/,
                },
                signupEmail: {
                    required: true,
                },
                signupPassword: {
                    required: true,
				},
				signupConfirmPassword: {
					required: true,
					equalTo : "#signupPassword"
				},
				idacceptcondition: {
					required: true,
				}
			},
			messages:{
				signupConfirmPassword:"Password do not match"
			},
            errorPlacement: function (error, element) {
                if (element.attr("name") == "firstname") {
                    error.insertAfter("#firstname");
				}
				if (element.attr("name") == "lastname") {
                    error.insertAfter("#lastname");
                }
                if (element.attr("name") == "mobNumber") {
                    error.insertAfter("#mobNumber");
                }
                if (element.attr("name") == "signupEmail") {
                    error.insertAfter("#signupEmail");
                }
                if (element.attr("name") == "signupPassword") {
                    error.insertAfter("#signupPassword");
				}
				if (element.attr("name") == "signupConfirmPassword") {
                    error.insertAfter("#signupConfirmPassword");
                }
                if (element.attr("name") == "idacceptcondition") {
                    error.insertAfter("#idacceptcondition");
                }
            }
        });
    }
	usersignup(event) {
		event.preventDefault();
		// console.log("-------this.state.auth------>>",this.state.auth);
		if($("#signUpUser").valid()){
			var auth = {
				firstName: this.refs.firstname.value,
				lastName: this.refs.lastname.value,
				mobileNumber: this.refs.mobNumber.value,
				emailId: this.refs.signupEmail.value,
				pwd: this.refs.signupPassword.value,
				signupPassword: this.refs.signupConfirmPassword.value,
				roles: 'user',
				status: 'Unverified'
			}

			// console.log("-------auth------>>",auth);
			$('.fullpageloader').show();
			document.getElementById("signUpBtn").innerHTML = 'Please Wait...';

			var firstname = this.refs.firstname.value;
			var mobile = this.refs.mobNumber.value;
			var email = this.refs.signupEmail.value;
			var passwordVar = this.refs.signupPassword.value;
			var signupConfirmPasswordVar = this.refs.signupConfirmPassword.value;

				if (passwordVar === signupConfirmPasswordVar) {
					return (passwordVar.length >= 6) ?
						(true,

							document.getElementById("signUpBtn").innerHTML = 'Sign Up',
							// browserHistory.push("/"),
							axios.post('/api/users', auth)
								.then((response) => {
									$('.fullpageloader').hide();
									this.setState({
						              messageData : {
						                "type" : "outpage",
						                "icon" : "fa fa-check-circle",
						                "message" : "&nbsp; Great, Information submitted successfully and OTP is sent to your registered Email.",
										"class": "success",
										"autoDismiss" : false
						              }
									})
									this.props.history.push("/confirm-otp/" + response.data.user_id);
								})
								.catch((error) => {
								})
						)
						:
						(
							document.getElementById("signUpBtn").innerHTML = 'Sign Up',
							this.setState({
				              messageData : {
				                "type" : "inpage",
				                "icon" : "fa fa-exclamation-circle",
				                "message" : "&nbsp; Password should be at least 6 Characters Long, Please try again or create an Account.",
								"class": "warning",
								"autoDismiss" : false
				              }
							})
						)


				} else {
					document.getElementById("signUpBtn").innerHTML = 'Sign Up';
					
					this.setState({
		              messageData : {
		                "type" : "inpage",
		                "icon" : "fa fa-times-circle",
		                "message" : "&nbsp; Passwords does not match, Please Try Again.",
						"class": "danger",
						"autoDismiss" : false
		              }
					})
				}
		}

	}
	Closepagealert(event) {
		event.preventDefault();
		$(".toast-error").html('');
		$(".toast-success").html('');
		$(".toast-info").html('');
		$(".toast-warning").html('');
		$(".toast-error").removeClass('toast');
		$(".toast-success").removeClass('toast');
		$(".toast-info").removeClass('toast');
		$(".toast-warning").removeClass('toast');
	}

	checkUserExists(event) {
		if (event.target.value != '') {
			axios.get('/api/users/get/checkUserExists/' + event.target.value)
				.then((response) => {

					if (response.data.length > 0) {
						$(".checkUserExistsError").show();
						$('.button3').attr('disabled', 'disabled');
						this.setState({ checkUserExists: 1 })

					} else {
						$(".checkUserExistsError").hide();
						$('.button3').removeAttr('disabled');
						this.setState({ checkUserExists: 0 })
					}
				})
				.catch(function (error) {
					// console.log(error);
				})
		} else {
			$(".checkUserExistsError").hide();
		}
	}

	handleChange(event) {
		// const target = event.target;
		// const {name , value}   = event.target;
		// const datatype = event.target.getAttribute('data-text');
		// const {name,value} = event.target;
		// let formerrors = this.state.formerrors;

		// // console.log("datatype",datatype);
		// switch (datatype){

		//    case 'firstNameV' : 
		//    formerrors.firstNameV = firstnameRegex.test(value) ? '' : "Please Enter Valid Name";
		//    break;

		//    case 'lastNameV' : 
		//    formerrors.lastNameV = lastnameRegex.test(value) ? '' : "Please Enter Valid Name";
		//    break;

		//    case 'mobileV' : 
		//    formerrors.mobileV = mobileRegex.test(value) ? '' : "Please Enter Valid Mobile Number";
		//    break;

		//    case 'emailIDV' : 
		//    formerrors.emailIDV = emailRegex.test(value) ? '' : "Invalid EmailID";
		//    break;

		//    default :
		//    break;

		//  case 'companyName' : 
		//  formerrors.companyName = value.length < 1 && value.lenght > 0 ? 'Minimum 1 Character ' : "";
		//  break;

		// }
		// this.setState({formerrors,})
		this.setState({
			[event.target.name]: event.target.value
		});
	}
	acceptcondition(event) {
		var conditionaccept = event.target.value;
		if (conditionaccept == "acceptedconditions") {
			$(".acceptinput").removeAttr('disabled');
		} else {
			$(".acceptinput").addAttr('disabled');
		}
	}

	showModal() {
		// if(this.state.roletype){
		//     $(".modalbg").css("display","block");
		// }else{
		//      swal("Please select student or franchise","","warning");
		// }
		$(".modalbg").css("display", "block");
	}
	hideModal() {
		$(".modalbg").css("display", "none");
	}
	componentDidMount() {
		this.validation();
		$(".checkUserExistsError").hide();
	}

	showSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.inputTextPass').attr('type', 'text');
	}
	hideSignPass() {
		$('.showPwd').toggleClass('showPwd1');
		$('.hidePwd').toggleClass('hidePwd1');
		return $('.inputTextPass').attr('type', 'password');
	}
	proceed() {

	}
	render() {
		// var winHeight = window.innerHeight;
		//       var divHeight = winHeight/4.5+'px';

		return (
			<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 LoginWrapper">
			<Loader type="fullpageloader"/>
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15 mb100">
					<div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-sm-12 col-xs-12 formShadow">
						<Message messageData={this.state.messageData} />
						<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 innloginwrap">
							<h3>Sign Up</h3>
						</div>
						<form id="signUpUser">
							<div className="logininput col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<label>First Name</label><label className="astricsign">*</label>
								<input type="text" maxlength="25" className="form-control" id="firstname" ref="firstname" name="firstname" placeholder="" onChange={this.handleChange} data-text="firstNameV" />
							</div>
							<div className="logininput col-lg-6 col-md-6 col-sm-12 col-xs-12">
								<label>Last Name</label><label className="astricsign">*</label>
								<input type="text" maxlength="25" className="form-control" id="lastname" ref="lastname" name="lastname" placeholder="" onChange={this.handleChange} data-text="lastNameV" />
							</div>
							<div className="logininput col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
								<label>Email ID</label><label className="astricsign">*</label>
								<input type="email" className="form-control" id="signupEmail" ref="signupEmail" name="signupEmail" placeholder="" onChange={this.handleChange} data-text="emailIDV" onBlur={this.checkUserExists.bind(this)} />
								<label className="checkUserExistsError">User already exists!!!</label>
								
							</div>
							<div className="logininput col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
								<label>Mobile Number</label><label className="astricsign">*</label>
								<input className="form-control" type="text" maxlength="10" ref="mobNumber" name="mobNumber" id="mobNumber" placeholder="Eg. 9876543210" onChange={this.handleChange} data-text="mobileV" />
							</div>
							
							<div className="logininput col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
								<label>Password</label><label className="astricsign">*</label>
								<input minLength="6" type="password" className="form-control" id="signupPassword" ref="signupPassword" placeholder="" name="signupPassword" />
							</div>
							<div className="logininput col-lg-12 col-md-12 col-sm-12 col-xs-12 mt15">
								<label>Confirm Password</label><label className="astricsign">*</label>
								<input minLength="6" type="password" className="form-control" id="signupConfirmPassword" ref="signupConfirmPassword" placeholder="" name="signupConfirmPassword" />
							</div>
							{/* <div  className="mt15 loginforgotpass col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<input name="idacceptcondition" type="checkbox" value="acceptedconditions" onClick={this.acceptcondition.bind(this)} /><a data-toggle="modal" data-target="#myModal" className="" onClick={this.showModal.bind(this)}>&nbsp;I agree to the <span className=""> terms & conditions</span><label className="astricsign">*</label></a><br/>
								<div id="idacceptcondition"></div>
							</div> */}
							
							<div className="col-lg-4 col-lg-offset-3 col-md-12 col-sm-12 col-xs-12 mt15">
								<button id="signUpBtn" onClick={this.usersignup.bind(this)} className="col-lg-12 col-md-12 col-md-offset-3 col-sm-12 col-xs-12 button3  btn btn-warning  signupbtn">Sign Up</button>
							</div>
							<div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 text-center loginforgotpass mt15">
								<lable>Already have an account?</lable>&nbsp;<a href='/login' className="">Sign In <b>&#8702;</b></a>
							</div>
						</form>
						<div class="modal" id="myModal" role="dialog">
							<div class="modal-dialog">
								<div class="modal-content">
									<div class="modal-header">
										<img src="/images/Icon.png" />
										<button type="button" class="close modalclosebut" data-dismiss="modal">&times;</button>
										<h2 className="modaltext modalheadingcont">TERMS AND CONDITIONS</h2>
									</div>
									<div class="modal-body">
										<ul>
											{
												this.state.termsCondition && this.state.termsCondition.length > 0 ?
													this.state.termsCondition.map((data, index) => {
														return (
															<li>{data}</li>
														);
													})
													:
													null
											}
										</ul>
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default SignUp;
