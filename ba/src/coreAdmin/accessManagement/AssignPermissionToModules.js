import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import  'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import $ from 'jquery';

import  './AccessManagement.css';

class AssignPermissionToModules extends Component {
  
	constructor(props){
		super(props);
		this.state={
			roleType : '',
			roleName : '',
			facilityPermission : 'waitingforResult',
			defaultRoles:[],
			AMData:[],
			allRoles:[],
			'subscription': {
				// allPermission : Meteor.subscribe('allAccessPermission'),
			}

		}
		this.handleChange = this.handleChange.bind(this);
		// console.log("1 =",this.state.allRoles)	
	}

	componentWillMount(){
  		/* Meteor.call("isAuthenticated","AccessManagement","AssignPermissions",(err,res)=>{
			if(err){
				console.log(err);
			}else{
				if(res==true){
		          this.setState({
		             facilityPermission : res,
		          });
		        }else if(res==false){
		          this.setState({
		             facilityPermission : res,
		          });
		        }
			}
		});*/
  	}

	componentDidMount(){
		/*if ( !$('body').hasClass('adminLte')) {
		  var adminLte = document.createElement("script");
		  adminLte.type="text/javascript";
		  adminLte.src = "/js/adminLte.js";
		  $("body").append(adminLte);
		}*/
		axios.get('https://jsonplaceholder.typicode.com/todos/1',)
            .then((response)=> {
                console.log("-------examMaster------>>",response.data);
                this.setState({
          	AMData : response.data,
          	defaultRoles : response.data,
          	allRoles : response.data

        });
                // localStorage.setItem("token",response.data.token);
                // direct.setState({loggedIn:response.data.token})
            })
            .catch(function (error) {
                console.log(error);
            });
  	}
  	
  	componentWillUnmount(){
    	$("script[src='/js/adminLte.js']").remove();
    	$("link[href='/css/dashboard.css']").remove();
  	}

  	handleChange(event){
		var target = event.target;
		var name = target.name;
		this.setState({
			[name]: event.target.value,
		});
	}

  	getRole(event){
  		var roleName = this.refs.roleName.value;
  		// console.log("role name",roleName);
  		this.setState({
  			roleName : roleName
  		});
  		// FlowRouter.go('/admin/AssignPermissionstoModules/'+roleName);
  		
  		
  	}
  	componentDidUpdate(){
  		/*var accessPermissions = AccessPermissionManagement.find({}).fetch();
		if(accessPermissions){
			accessPermissions.map((allAcceessPermission,index)=>{
				allAcceessPermission.moduleFacilityPermission.map((moduleFacilities, facIndex)=>{
						if(moduleFacilities.rolepermissionId!='')
						$('.'+moduleFacilities.rolepermissionId).attr('checked',true);
					
				});
			});
		}*/
  	}

  	showwhenClick(){
  	// 	var accessPermissions = AccessPermissionManagement.find({}).fetch();
			// if(accessPermissions){
			// 	accessPermissions.map((allAcceessPermission,index)=>{
			// 		allAcceessPermission.moduleFacilityPermission.map((moduleFacilities, facIndex)=>{
			// 			if(moduleFacilities.rolepermissionId!=''){
			// 				$('.'+moduleFacilities.rolepermissionId).attr('checked',true);
			// 			}
			// 		});
			// 	});
			// }
  	}

  	getAMcheckboxId(event){
  		/*var uniqVal  = event.target.getAttribute('class');
  		var facilityName = event.target.getAttribute('id');
  		var moduleId     = event.target.getAttribute('data-id'); 
  		Meteor.call("addRolesAccessPermission",moduleId,facilityName,uniqVal,(err,res)=>{
  			if(err){
  				console.log(err);
  			}else{
  			this.showwhenClick();
  			location.reload();

  			}
  		});
  		*/
  	}

  	addRemoveAccessPermission(event){
  		/*var uniqVal = $(event.target).attr('class');
  		var sameId = $(event.target).attr('data-Idval');
  		var idArrayIndex = sameId.split('-');
  		var id = idArrayIndex[0];
  		var facilityIndex = idArrayIndex[1];
  		var facilityName = $(event.target).attr('id');
  		var roleName = $(event.target).attr('name');

  		Meteor.call("addRemoveRolePermission",id,facilityName,roleName,facilityIndex,uniqVal);
*/  	}


	render(){
		/*if(this.state.facilityPermission != 'waitingforResult' && this.state.facilityPermission == true){
			$('.sidebar').css({display:'block',background: '#222d32'});*/
		return(
			<div className = "container-fluid ">
          		<div className = "row ">
            		<div className= "formWrapper fontF">      
               			<div className= "content">  
							<div className="col-lg-12 pageContent">
								<div className="row">
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 ">
										<div className="col-lg-6 col-md-7 col-sm-12 col-xs-12">
							    			<h3 className="pageHeader"> Access Management </h3> 
							    		</div>
										<hr className="container-fluid row hr-head"/>
										<div className="col-lg-6 col-md-7 col-sm-12 col-xs-12">
						            		<h3 className="pageSubHeader">Assign Permissions to Modules & Facilities</h3>
							    		</div>
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
											<div className="col-lg-5 col-lg-offset-7 col-md-5 col-md-offset-7 col-sm-5 col-sm-offset-7 col-xs-12 rolesList-AM">								
												<select type="text" name="roleName" ref="roleName" /*onChange={this.getRole.bind(this)}*/ className="form-control col-lg-12 col-md-12 col-sm-12 col-xs-12 inputBox-main" title="Select Role">
																<option value=''>-- Select Role --</option>
																{/*<option>Show All</option>
																{this.state.allRoles.map((roles,index)=>{
																	return <option key={index}>{roles.name}</option>
																  })
																}*/}
												</select>
											</div>
											<div className=" col-lg-12 col-md-12 col-sm-12 col-xs-12 categoryTable AMFTable">
							              		<table className="table table-striped formTable table-responsive  table-hover" id="AM-Table">
												    <thead className=" tableHeader-AM">
												        <tr>
												            <th className="col-lg-1">Sr.No</th>
												            <th className="col-lg-4 "> List of Modules & Facilities </th>
												           {/* {this.state.defaultRoles.map((defaultRole,index)=>{
												            	return */}
												            	 <th className="col-lg-1"  /* key={index}*/ >
												            	 {/* {defaultRole.name}*/}
												            	 </th>
												           {/* })} */}
												        </tr>
												    </thead>
												    <tbody>
												    	{/*{this.state.AMData.map((allAMData ,index)=>{ 
											    		return  
												    	*/}
											    		<tr /* key={index}*/>
											    					<td className="srNoAMTable">
											    					{/*	{index + 1}*/}
											    					</td>
														    		<td className="AMTableTd">
														    		{/*	{allAMData.moduleName}*/}
														    			{/*{allAMData.facilities.map((facility, indexx)=>{
													    				return */ } 
													    						<table className="nestedTable nestedTable-AMTable" /* key={indexx}*/>
													    							<tbody>
														     							<tr /*key={indexx}*/>
														     								<td className="col-lg-1">
														     									 {/*{index + 1 }.{indexx}*/ }
														     								 </td>
														     								<td>
															     								{/*{facility.facilityName}*/}
															     							</td>
														     							</tr>
													    							</tbody>
											     								</table>
														    			{/*})}*/}
														    		</td>
														    		{/*{this.state.defaultRoles.map((defaultRole, index)=>{
														    			return*/}
														    				<td className="srNoAMTable" /*key={index}*/>
																    			<input type="checkbox" className="hiddenCheckbox-AM" disabled/>

																    			{/*{allAMData.facilities.map((facility, indexx)=>{
															    					return*/}
															    						<table className="nestedTable nestedTable-AMTable" /*key={indexx}*/>
															    							{/*{index == 0  ?*/}
															     							<tbody>
																     							<tr /* key={indexx}*/ >

															     									<td className="checkbox AMCheckbox checkbox-success">
																		     							<div className="checkboxAccessContainer">
																										   <input type="checkbox" className=""/>
																										   <span className="checkboxMark "></span>
																										</div>
										 								                        		<label></label>
									 								                    			</td>
																     							</tr>
															     						{/*	: 
																     							index == 1 ? 
																	     							<tr key={indexx}>
																	     								<div className="checkbox AMCheckbox checkbox-success">
											 								                        		<input type="checkbox" className={allAMData._id+'-'+index+'-'+indexx} data-id={allAMData._id} id={facility.facilityName} onClick={this.getAMcheckboxId.bind(this)}/>
											 								                        		<label></label>
									 								                    				</div>
																	     								
																	     							</tr>
																     							:
																	     							<tr key={indexx}>
																     									<div className="checkbox AMCheckbox checkbox-success">
										 								                        			<input type="checkbox" className={allAMData._id+'-'+index+'-'+indexx} id={facility.facilityName} name={index + 1} data-Idval={allAMData._id+'-'+indexx} data-Id={allAMData._id+'-'+(index + 1)} onClick={this.addRemoveAccessPermission.bind(this)}/>
										 								                        			<label></label>
									 								                    				</div>
																	     							</tr>
																     							
															     							}*/}

													     								</tbody>
													     								</table>
																    		{/*	})}*/}
														    					</td>
														    {/*		})}*/}

														    	</tr>
												    {/*	})}*/}
												    	
												    </tbody>
												</table>
											</div>
										</div>
									</div>
							    </div>	
					      	</div>		
						</div>
					</div>
				</div>
			</div>
		);
		/*}else if (this.state.facilityPermission == false ){
			  	FlowRouter.go('/noAccesss')
		  }else if(this.state.facilityPermission == "waitingforResult"){
		  	return(<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
			   <img className="loaderImageSize1" src="/images/loading1.gif" alt="loading"/>
			</div>);
		  }else{ 
		  return (<div className="col-lg-12 col-md-12 col-sm-12 waitingResLoadingWrap">
		  			<h3>You dont have access. Please <a href="/admin/AssignPermissionstoModules/Show%20All">click here </a>to assign permission</h3>
		  		 </div>
		  	);
		}*/
	}
}
export default AssignPermissionToModules;