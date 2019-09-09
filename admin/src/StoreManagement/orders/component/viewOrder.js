import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import moment                 from "moment";
// import IAssureTable           from "../../IAssureTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';
import '../css/viewOrder.css';

// axios.defaults.baseURL = 'http://gangaapi.iassureit.com';
// axios.defaults.headers.post['Content-Type'] = 'application/json';

class viewOrder extends Component{
    constructor(props) {
        super(props);

        if(!this.props.loading){
            this.state = {
                "orderData":[],
                // "notificationData" :Meteor.subscribe("notificationTemplate"),
            };
        } else{
            this.state = {
                "orderData":[],
            };
        }
        window.scrollTo(0, 0);
    }

    componentDidMount() {
      console.log('orderID',this.props.match.params.orderID);
      var orderID = this.props.match.params.orderID;
      this.getOneOrder(orderID);
    }
    getOneOrder(orderID){
      axios.get("/api/orders/get/one/"+orderID)
            .then((response)=>{
              this.setState({
                  orderData : response.data
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })
    }
    
    componentWillUnmount() {
        $("body").find("script[src='/js/adminLte.js']").remove();
        if(this.basicPageTracker)
          this.basicPageTracker.stop();
    }

    
    
    isEmpty(obj) {
      for(var key in obj) {
          if(obj.hasOwnProperty(key))
              return false;
      }
      return true;
    }
    render(){
      console.log('data',this.state.orderData);
      console.log('datacasj',_.isEmpty(this.state.orderData));
        return(         
            <div className="container-fluid">  
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 parentDiv">   
                    {
                      this.state.orderData && !(_.isEmpty(this.state.orderData)) ?
                         
                          <div className="col-lg-12 bglight">
                            <div className="col-lg-12 orderpagebox">
                              <div className="row">
                                <div className="col-lg-4">
                                <div className="">
                                  <div  className=" col-lg-12 orderButton">{"OrderId-"+(this.state.orderData._id)}</div>
                                  </div>
                                </div>
                               <div  className="col-lg-4 text-center">
                               <div className="row">
                               <div className="col-lg-5 col-lg-offset-3">
                                {this.state.orderData.deliveryStatus ?
                                 this.state.orderData.deliveryStatus.map((delivery, index)=>{
                                  return(
                                    <div className="orderfloat">
                                  <button
                                  title={

                                          delivery.status == "New Order"          ? "Order Placed" : 
                                          delivery.status == "Verified"           ? "Verify" : 
                                          delivery.status == "Packed"             ? "Packed" : 
                                          delivery.status == "Inspection"         ? "Inspected" : 
                                          delivery.status == "Order Verified"     ? "Order Verified" : 
                                          delivery.status == "Dispatch"           ? "Out for Delivery" : 
                                          delivery.status == "Delivered"          ? "Delivered" : 
                                          delivery.status == "Delivered & Paid"   ? "Delivered & Paid" : "Delivered & Paid"
                                      }
                                className="orderButton2">
                                <i className={ 
                                           delivery.status == "New Order"          ? "fa fa-product-hunt admin-orders-stat-NewOrdericon" : 
                                           delivery.status == "Verified"           ? "fa fa-check-square admin-orders-stat-Verifiedicon" : 
                                           delivery.status == "Packed"             ? "fa fa-archive admin-orders-stat-Packedicon" : 
                                           delivery.status == "Inspection"         ? "fa fa-info-circle admin-orders-stat-Inspectionicon" : 
                                           delivery.status == "Order Verified"     ? "fa fa-angellist admin-orders-stat-OrderVerifiedicon" : 
                                           delivery.status == "Dispatch"           ? "fa fa-truck admin-orders-stat-Dispatchedicon" : 
                                           delivery.status == "Delivered"          ? "fa fa-check-circle admin-orders-stat-Deliveredicon" : 
                                           delivery.status == "Delivered & Paid"   ? "fa fa-thumbs-up admin-orders-stat-Deliveredpaidicon" : ""
                              }
                                 aria-hidden="true"></i> {delivery.status=="New Order"  ? "Order Placed" 
                                                        : delivery.status=="Dispatch"   ? "Out for Deliery" 
                                                        : delivery.status=="TO Deliver" ? "Order Initiated" : delivery.status }</button>
                                  
                                  </div>
                                 );
                                    })
                                   :
                                   null
                                  }
                                 </div>
                                 </div>
                                </div>
                                
                              </div>
                              <hr className="hrline"/>
                              <div className="row">
                              {this.state.orderData.products ?
                                 this.state.orderData.products.map((products, index)=>{
                                  return(
                                          <div key={index} className="col-lg-12">
                                              <div className="col-lg-2 mtop10">
                                                <img className="itemImg" src={products.productImage[0]}/>
                                              </div>
                                              <div className="col-lg-6 mtop10">
                                                <h4>{products.productName}</h4>
                                              </div>
                                              <div className="col-lg-2 mtop10"><p className={"fa fa-"+products.currency}> {products.total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </p>
                                              </div>
                                              <div className="col-lg-2"> <h4>{this.state.orderData.status.charAt(0)+this.state.orderData.status.slice(1).toLowerCase()}</h4>
                                              </div>
                                          </div>
                                                );
                                            })
                                           :
                                           null
                                          }
                              </div>
                              <hr className="hrline"/>
                              <div className="row">
                                <div className="col-lg-12 mtop10">
                                <div className="col-lg-6">
                                  <p><span>Ordered On </span>&nbsp;{ moment(this.state.orderData.createdAt).format("DD/MM/YYYY HH:mm") }</p>
                                </div>
                                <div className="col-lg-6 pull-right plright">
                                  <p><span>Order Total</span>&nbsp;<span className={"fa fa-"+this.state.orderData.currency}>&nbsp;{this.state.orderData.totalAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} </span></p>
                                </div>
                                </div>
                              </div>
                            </div>
                           
                          </div>
                                               :
                         <div>
                            <h5 className="col-lg-12 textAlignCenter"><b>Your Orders are empty</b></h5>
                            <div className="col-lg-12 textAlignCenter">
                            <img src="/images/noorder.png" />
                            </div>
                            <p className="col-lg-12 textAlignCenter emptyCartMsg">Looks like you haven't placed anything to your orders yet.</p>
                        </div>
                  }  
                  </div>
                  <br/>
                  

                </div>
                </div>
        );
    }
}

export default viewOrder
