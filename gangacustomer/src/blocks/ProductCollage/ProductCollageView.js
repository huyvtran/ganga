import React, { Component } from 'react';
import "./ProductCollageView.css";
import axios                      from 'axios';
import { connect }                from 'react-redux';
import ProductDetailsHomeView from "../../pages/ProductDetailsEcommerce/ProductDetailsHomeView.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/modal.js';
import 'bootstrap/js/tab.js';
import $ from 'jquery';
import Message from '../Message/Message.js';
import { bindActionCreators } from 'redux';
import { getCartData } from '../../actions/index';
const user_ID = localStorage.getItem("user_ID");

class ProductCollageView extends Component {
	constructor(props){
    super(props);
	   this.state = {
         products:[],
         masterLimitProducts:[],
         categoryDetails:[],
         modalIDNew : []
	   }
  }  
	async componentDidMount(){
    await this.props.fetchCartData(); 
  
		this.setState({
      products : this.props.products,
      masterLimitProducts : this.props.products
    });

	}
  componentWillReceiveProps(nextProps){
    this.setState({
      products : nextProps.products,
      masterLimitProducts : nextProps.products,
      categoryDetails : nextProps.categoryDetails
    });
	}
  

  	addtocart(event){
      event.preventDefault();
      if(user_ID){
      
      var id = event.target.id;
      axios.get('/api/products/get/one/'+id)
      .then((response)=>{
        var totalForQantity   =   parseInt(1 * response.data.discountedPrice);
            const userid = localStorage.getItem('user_ID');           
            const formValues = { 
                "user_ID"    : userid,
                "product_ID" : response.data._id,
                "currency" : response.data.currency,
                "productCode" : response.data.productCode,
                "productName" : response.data.productName,
                "section_ID"        : response.data.section_ID,
                "section"           : response.data.section,
                "category_ID": response.data.category_ID,
                "category": response.data.category,
                "subCategory_ID": response.data.subCategory_ID,
                "subCategory": response.data.subCategory,
                "productImage" : response.data.productImage,
                "quantity" : 1  ,
                "discountedPrice" : parseInt(response.data.discountedPrice),
                "originalPrice" : parseInt(response.data.originalPrice),
                "discountPercent" :parseInt(response.data.discountPercent),
                "totalForQantity" : totalForQantity,
                
            }
            axios.post('/api/carts/post', formValues)
            .then((response)=>{
              this.props.fetchCartData();
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
            })
            .catch((error)=>{
              console.log('error', error);
            })
      })
      .catch((error)=>{
        console.log('error', error);
      })
        }else{
          this.setState({
            messageData : {
              "type" : "outpage",
              "icon" : "fa fa-times-circle",
              "message" : "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
              "class": "danger",
              "autoDismiss" : true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData   : {},
            })
          }, 3000);
    }
   }
   addtowishlist(event) {
    event.preventDefault();
    if (user_ID) {
      
      var id = event.target.id;
      const userid = localStorage.getItem('user_ID');
      const formValues =
      {
        "user_ID": userid,
        "product_ID": id,
      }
      axios.post('/api/wishlist/post', formValues)
        .then((response) => {
          this.setState({
            messageData : {
              "type" : "outpage",
              "icon" : "fa fa-check-circle",
              "message" : "&nbsp; "+response.data.message,
              "class": "success",
              "autoDismiss" : true
            }
          })
          setTimeout(() => {
            this.setState({
              messageData   : {},
            })
          }, 3000);
          this.props.getWishData();
        })
        .catch((error) => {
          console.log('error', error);
        })
    }
    else {
      this.setState({
        messageData : {
          "type" : "outpage",
          "icon" : "fa fa-exclamation-circle",
          "message" : "Need To Sign In, Please <a href='/login'>Sign In</a> First.",
          "class": "warning",
          "autoDismiss" : true
        }
      })
      setTimeout(() => {
        this.setState({
          messageData   : {},
        })
      }, 3000);
    }
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
    openModal(event){
      event.preventDefault();
      var modalID = event.target.id;
      this.setState({
        modalIDNew : {productID:modalID}
      })
    }
    

  render() {
    
    return(
      <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
        <Message messageData={this.state.messageData} />
        
        <div className="row">
        {
          this.state.products && this.state.products.length > 0 ?
            this.state.products && this.state.products.map((data, index) =>{
              var x = this.props.wishList && this.props.wishList.length > 0 ? this.props.wishList.filter((abc) => abc.product_ID == data._id) : [];
              if(x && x.length > 0){
                var wishClass = '';
                var tooltipMsg = 'Remove from wishlist';
              }else{
                var wishClass = '-o';
                var tooltipMsg = 'Add to wishlist';
              }
            return (
                      <div className="item col-lg-4 col-md-4 col-sm-4 col-xs-4" key={index}>
                        <a href={"/productdetails/"+data.productUrl+"/" + data._id}>
                                <div className="">
                                  <div className="card">
                                    <div className="item-top">
                                      <div className="productImg">
                                        <button type="submit" id={data._id} title={tooltipMsg} className={"wishIcon fa fa-heart"+wishClass} onClick={this.addtowishlist.bind(this)}></button>
                                        {data.discountPercent ? <div className="btn-warning discounttag">{data.discountPercent} % </div> : null} 
                                        <a className="product photo product-item-photo collage" tabIndex="-1">
                                          <img src={data.productImage[0] ? data.productImage[0] : '/images/notavailable.jpg'} />
                                        </a>
                                      </div>
                                      <div className="productDetails">
                                        <div className="innerDiv">
                                          <div className="product-brand" title={data.brand}>{data.brand}</div>
                                          <div className="product-item-link" title={data.productName}>{data.productName}</div>
                                          <div className="col-lg-12 col-md-12 NOpadding">
                                            {
                                              data.discountPercent ?
                                                <div className="col-lg-12 col-md-12 NOpadding">
                                                  
                                                  <span className="price"><i className="fa fa-inr"></i>&nbsp;{data.discountedPrice}</span> &nbsp;
                                                  <span className="oldprice"><i className="fa fa-inr oldprice"></i>&nbsp;{data.originalPrice}</span> 
                                                </div>
                                                :
                                                <span className="price"><i className="fa fa-inr"></i>&nbsp;{data.originalPrice}</span>
                                            }
                                          </div>
                                          
                                          <div >
                                          </div>
                                          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NOpadding">
                                              <button type="submit" id={data._id} onClick={this.addtocart.bind(this)} title="Add to Cart" className="homeCart fa fa-shopping-cart">
                                                &nbsp;Add to Cart
                                              </button>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </a>
                      </div>
                    );
            })
            :

            <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                <div className="wishlistNoProduct col-lg-12 col-md-12 col-sm-12 col-xs-12 mt25">
                    <i className="fa fa-exclamation-triangle"></i>&nbsp;  There is no items in this category.
                </div>
                <a href="/" className="pull-right mt15 wishBack">Back</a>
            </div>
        }
       
        
        <div id="productviewmodal" className="modal" role="dialog">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <img src="/images/Icon.png" />
                <button type="button" className="close modalclosebut" data-dismiss="modal">&times;</button>
                <h4 className="modal-title modalheadingcont"></h4>
              </div>
              <div className="modal-body">
                <ProductDetailsHomeView productInfo={this.state.modalIDNew} />
              </div>
              <div className="modal-footer">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>  
    );    
	}
}
const mapStateToProps = (state) => {
  return {
    recentCartData :  state.recentCartData
  }
}
const mapDispachToProps = (dispatch) => {
  return  bindActionCreators({ fetchCartData: getCartData }, dispatch)
}
export default connect(mapStateToProps, mapDispachToProps)(ProductCollageView);