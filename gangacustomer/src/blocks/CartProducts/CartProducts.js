import React, { Component } from 'react';
import $                    from 'jquery';
import axios                from 'axios';
import {Route, withRouter} from 'react-router-dom';
import "./CartProducts.css";
import { connect }        from 'react-redux';
import { bindActionCreators } from 'redux';
import { getCartData } from '../../actions/index';
import Loader from "../../common/loader/Loader.js";
import Message from '../Message/Message.js';
class CartProducts extends Component{
    constructor(props) {
        super(props);
        this.state={
            cart:[],
            totalCartPrice:'',
            productData:{},
            productCartData:[],
            vatPercent:0,
            companyInfo:"",
            cartProduct:"",
            shippingCharges:0,
            quantityAdded: 0,
            totalIndPrice: 0,
            bannerData : {
                title : "MY SHOPPING CART",
                breadcrumb : 'My Shopping Cart',
                backgroungImage : '/images/cartBanner.png',
            }
        }
        this.getCompanyDetails();
    }

    async componentDidMount(){
    	await this.props.fetchCartData();
        
        this.getCompanyDetails();
    }
    componentWillReceiveProps(nextProps) { 
       
    }
    // getCartData(){
    //     $('.fullpageloader').show();
    //     const userid = localStorage.getItem('user_ID');
    //     axios.get("/api/carts/get/list/"+userid)
    //       .then((response)=>{ 
    //         $('.fullpageloader').hide();
    //           this.setState({
    //             cartProduct : response.data[0]
    //           });
    //       })
    //       .catch((error)=>{
    //             console.log('error', error);
    //       })
    // }
    getCompanyDetails(){
        axios.get("/api/companysettings/list")
          .then((response)=>{ 
              this.setState({
                companyInfo : response.data[0]
              },()=>{
                  this.getCartTotal();
              })
          })
          .catch((error)=>{
                console.log('error', error);
          })
    }
    getCartTotal(){
        var companyData = this.state.companyInfo;
        if (this.props.recentCartData.length>0  && companyData) {

            if(this.props.recentCartData[0].cartItems.length>0){
                
                    this.setState({
                    "shippingCharges":0,
                    "productCartData": this.props.recentCartData[0].cartItems,
                    "productData":this.props.recentCartData[0],
                    "vatPercent":companyData.taxSettings ? companyData.taxSettings[0].taxRating : 0,
                });

            }else{
                this.setState({"shippingCharges":0.00});
            }
        }else{
            this.setState({
                "shippingCharges":0.00,
            });
        }
    }

    Removefromcart(event){
        event.preventDefault();
        const userid = localStorage.getItem('user_ID');
        const cartitemid = event.target.getAttribute('id');
        const formValues = { 
            "user_ID"    : userid,
            "cartItem_ID" : cartitemid,
        }
        axios.patch("/api/carts/remove" ,formValues)
        .then((response)=>{
            this.setState({
                messageData : {
                  "type" : "outpage",
                  "icon" : "fa fa-check-circle",
                  "message" : response.data.message,
                  "class": "success",
                  "autoDismiss" : true
                }
            })
            setTimeout(() => {
                this.setState({
                    messageData   : {},
                })
            }, 3000);
            this.props.fetchCartData();
            this.getCompanyDetails();
        })
        .catch((error)=>{
        console.log('error', error);
        })
    }

    cartquantityincrease(event){
        event.preventDefault();
        const userid = localStorage.getItem('user_ID');
        const cartitemid = event.target.getAttribute('id');
        const product_ID = event.target.getAttribute('productid');
        console.log('product_ID', product_ID);
        const quantity = parseInt(event.target.getAttribute('dataquntity'));
        const proprice = event.target.getAttribute('dataprice');
        axios.get("/api/products/get/one/"+product_ID)
        .then((response)=>{
            var productName = response.data.productName ;
            var availableQuantity = response.data.availableQuantity;
            const quantityAdded = parseInt(quantity+1);

            
            if(quantity>0){
                var totalIndPrice   = quantityAdded * proprice;      
            }
            const formValues = { 
                "user_ID"     	: userid,
                "cartItem_ID" 	: cartitemid,
                "quantityAdded" : quantityAdded,
                "totalIndPrice"	: totalIndPrice
            }
            if(quantityAdded > availableQuantity){
                this.setState({
                    messageData : {
                      "type" : "outpage",
                      "icon" : "fa fa-check-circle",
                      "message" : "Last "+availableQuantity+" items taken by you",
                      "class": "success",
                      "autoDismiss" : true
                    }
                })
                setTimeout(() => {
                    this.setState({
                        messageData   : {},
                    })
                }, 3000);
            }else{
                axios.patch("/api/carts/quantity" ,formValues)
                .then((response)=>{
                        this.props.fetchCartData();
                })
                .catch((error)=>{
                        console.log('error', error);
                })
            }
        })
        .catch((error)=>{
            console.log('error', error);
        })   
    }
    Closepagealert(event){
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
    cartquantitydecrease(event){
    	event.preventDefault();
        const userid = localStorage.getItem('user_ID');
        const cartitemid = event.target.getAttribute('id');
        const quantity = parseInt(event.target.getAttribute('dataquntity'));

        const quantityAdded = parseInt(quantity-1) <= 0 ? 1 : parseInt(quantity-1);
        const proprice = event.target.getAttribute('dataprice');
        if(quantity>0){
           var totalIndPrice   = quantityAdded * proprice;      
        }
        
        const formValues = { 
			"user_ID"     	: userid,
			"cartItem_ID" 	: cartitemid,
			"quantityAdded" : quantityAdded,
			"totalIndPrice"	: totalIndPrice
		}
        axios.patch("/api/carts/quantity" ,formValues)
		.then((response)=>{
             this.props.fetchCartData();
		})
		.catch((error)=>{
		    console.log('error', error);
		})
    }
    proceedToCheckout(event){
        event.preventDefault();
        this.props.history.push('/checkout');
    }
    continueShopping(event){
        event.preventDefault();
        this.props.history.push('/');
    }
    updateShoppingCart(){
        window.location.reload();
    }
    moveWishlist(event){
        event.preventDefault();
        const userid = localStorage.getItem('user_ID');
        const cartitemid = event.target.getAttribute('id');
        const productid = event.target.getAttribute('productid');
        const formValues = { 
            "user_ID"    : userid,
            "cartItem_ID" : cartitemid,
        }


          const wishValues = {
            "user_ID": userid,
            "product_ID": productid,
          }
          axios.post('/api/wishlist/post', wishValues)
            .then((response) => {
                axios.patch("/api/carts/remove" ,formValues)
                .then((response)=>{
                    this.setState({
                        messageData : {
                          "type" : "outpage",
                          "icon" : "fa fa-check-circle",
                          "message" : "Product moved to wishlist successfully.",
                          "class": "success",
                          "autoDismiss" : true
                        }
                    })
                    setTimeout(() => {
                        this.setState({
                            messageData   : {},
                        })
                    }, 3000);
                    this.props.fetchCartData();
                    this.getCompanyDetails();
                })
                .catch((error)=>{
                    console.log('error', error);
                })
            })
            .catch((error) => {
              console.log('error', error);
            })


        

    }
    render(){
        // console.log(this.props.recentCartData);
        return(
            <div className="container">
            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cartHeight">
                <Loader type="fullpageloader"/>
                <div className="row">
                    <Message messageData={this.state.messageData} />
                    {
                        this.props.recentCartData.length > 0 &&  this.props.recentCartData[0].cartItems.length > 0? 
                        <div className="col-lg-12 col-sm-12 col-xs-12 NOpadding">
                            
                            <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 cartProduct">
                                <table className="table table-responsive cartProductTable">
                                    <thead>
                                        <tr>
                                            <th>ITEMS</th>
                                            <th>PRICE</th>
                                            <th>QUANTITY</th>
                                            <th>TOTAL</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            
                                            this.props.recentCartData[0].cartItems.map((data, index)=>{
                                                var x = data.discountedPrice;
                                                var discountedPrice = x.toString().replace(/\B(?=(\d\d)+(\d)(?!\d))/g, ",");
                                                var y = data.totalForQantity;
                                                var z = this.state.totalForQantity;
                                                var totalForQantity = y.toString().replace(/\B(?=(\d\d)+(\d)(?!\d))/g, ",");
                                                var totalForQantityState = z ?  z.toString().replace(/\B(?=(\d\d)+(\d)(?!\d))/g, ",") : "";
                                                return(
                                                    <tr key={index}>
                                                        <td>
                                                            <tr>
                                                                <td>
                                                                    <a href={"/productdetails/" + data.product_ID}><img className="img img-responsive cartProductImg" src={data.productImage[0] ? data.productImage[0] : '/images/notavailable.jpg'} /></a>
                                                                </td>
                                                                <td className="cartProductDetail">
                                                                <a href={"/productdetails/" + data.product_ID}><h5>{data.productName}</h5></a>
                                                                {
                                                                    data.discountPercent  ?
                                                                        <div className="col-lg-12 col-md-12 NOpadding">
                                                                            
                                                                            <span className="oldprice"><i className="fa fa-inr oldprice"></i>&nbsp;{data.originalPrice}</span> &nbsp;
                                                                            <span className="price"><i className="fa fa-inr"></i>&nbsp;{data.discountedPrice}</span> &nbsp;
                                                                            <span className="cartDiscountPercent">({data.discountPercent}%)</span>
                                                                        </div>
                                                                        :
                                                                        <span className="price"><i className="fa fa-inr"></i>&nbsp;{data.originalPrice}</span>
                                                                }
                                                                <br/>
                                                                    <button productid={data.product_ID} id={data._id} onClick={this.moveWishlist.bind(this)} className="btn btn-warning moveWish">Move to Wishlist</button>
                                                                </td>
                                                                
                                                            </tr>
                                                        </td>
                                                        <td className="nowrap"><span id="productPrize" className={"cartProductPrize fa fa-inr"}>&nbsp;{discountedPrice}</span></td>
                                                        <td className="nowrap">
                                                            <span className="minusQuantity fa fa-minus" id={data._id} dataquntity={this.state.quantityAdded != 0 ? this.state.quantityAdded : data.quantity} dataprice={data.discountedPrice} onClick={this.cartquantitydecrease.bind(this)}></span>&nbsp;
                                                            <span className="inputQuantity">{this.state['quantityAdded|'+data._id] ? this.state['quantityAdded|'+data._id] : data.quantity}</span>&nbsp;
                                                            <span className="plusQuantity fa fa-plus" productid={data.product_ID} id={data._id} dataquntity={this.state.quantityAdded != 0 ? this.state.quantityAdded : data.quantity} dataprice={data.discountedPrice} onClick={this.cartquantityincrease.bind(this)}></span>
                                                        </td>
                                                        <td className="nowrap"><span className={"cartProductPrize fa fa-inr"}>&nbsp;{totalForQantityState !=0 ? totalForQantityState : totalForQantity}</span></td>
                                                        <td>
                                                            <span className="fa fa-trash trashIcon" id={data._id} onClick={this.Removefromcart.bind(this)}><a href="#" style={{color:"#337ab7"}} ></a></span>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                            
                                        }
                                    </tbody>
                                </table>
                                
                            </div>
                            
                            <div className="col-lg-3 col-md-3 col-sm-12 col-xs-12 NOpadding">
                                <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 cartSummary">
                                    <strong className="cartSummaryTitle">Summary</strong>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="row">
                                            <table className="table table-responsive summaryTable">
                                                <tbody>
                                                    <tr>
                                                        <td>Subtotal</td>
                                                        <td className="textAlignRight">&nbsp; <i className={"fa fa-inr"}></i> {this.props.recentCartData[0].cartTotal > 0 ? (parseInt(this.props.recentCartData[0].cartTotal)).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0.00"} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Shipping Charges</td>
                                                        <td className="textAlignRight">&nbsp; <i className={"fa fa-inr"}></i> {this.state.shippingCharges > 0 ?(this.state.shippingCharges).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "0.00"} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>GST ({this.state.vatPercent > 0 ? this.state.vatPercent : 0}%)</td>
                                                        <td className="textAlignRight">&nbsp; <i className={"fa fa-inr"}></i> {this.props.recentCartData[0].cartTotal > 0 && this.state.vatPercent ?(this.props.recentCartData[0].cartTotal*(this.state.vatPercent/100)).toFixed(2).replace(/\B(?=(\d\d)+(\d)(?!\d))/g, ",") : "0.00"} </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Order Total</td>

                                                        <td className="textAlignRight cartTotal">&nbsp; <i className={"fa fa-inr"}></i> { ((parseInt(this.state.vatPercent))/100*(parseInt(this.props.recentCartData[0].cartTotal))+(parseInt(this.props.recentCartData[0].cartTotal))+parseInt(this.state.shippingCharges)).toFixed(2).toString().replace(/\B(?=(\d\d)+(\d)(?!\d))/g, ",")}  </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <button onClick={this.proceedToCheckout.bind(this)} className="col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-warning cartCheckout">
                                        PROCEED TO CHECKOUT
                                    </button>
                                </div>
                            </div>
                        </div>
                        : 
                        <div className="col-lg-12 textAlignCenter">
                          <img src="/images/emptycart.png" />
                        </div>   
                    }
                    
                </div>
            </div>
            </div>
        );
    }
}
const mapStateToProps = (state)=>{
  return {
    recentCartData :  state.recentCartData
  }
}
const mapDispachToProps = (dispatch) =>{
    return bindActionCreators({ fetchCartData: getCartData }, dispatch);  
}  
export default connect(mapStateToProps, mapDispachToProps)(withRouter(CartProducts));