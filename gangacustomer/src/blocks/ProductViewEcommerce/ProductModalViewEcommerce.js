import React, { Component } 		from 'react';
import $ 				 			from 'jquery';
import {Route, withRouter} from 'react-router-dom';
import axios                  from 'axios';
import swal from 'sweetalert';
import "./ProductViewEcommerce.css";
import _                      from 'underscore';

axios.defaults.baseURL = 'http://gangaapi.iassureit.com';
axios.defaults.headers.post['Content-Type'] = 'application/json';


class ProductModalViewEcommerce extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    	"productData":[],
	    	"subImgArray":[],
	    	"totalQuanity":1,
	    	"quanityLimit":5,
	    	"imgsrc" : "",
	    	"productID" : "",
	    };
    this.changeImage = this.changeImage.bind(this); 
  	}  

  	componentDidMount(){
      	this.getData(this.props.productID);

  		var imageArray=[
			{"image":"/images/45-home_default.jpg"},
			{"image":"/images/41-home_default.jpg"},
			{"image":"/images/32-home_default.jpg"},
			{"image":"/images/45-home_default.jpg"},
  		]
  	}
  	componentWillReceiveProps(nextProps){
  		this.getData(nextProps.productID);
  	}
  	// componentDidUpdate(prevProps,prevState){
  	// 	console.log('prevProps.productID!=this.props.productID',prevProps.productID,this.props.productID)
  	// 	if(prevProps.productID!=this.props.productID){
  	// 	this.getData(this.props.productID);
  	// 	}
  	// }

  	getData(productID){
  		axios.get("/api/products/get/one/"+productID)
            .then((response)=>{
            	console.log("product info---->",response);
              this.setState({ 
                  productData : response.data,
                  quanityLimit : response.data.availableQuantity
              })
            })
            .catch((error)=>{
                console.log('error', error);
            })
  	}
  	 changeImage = (event)=>{
  	 	
        document.getElementById('change-image').src=event.target.src;
        var index = event.target.getAttribute('data-index');
        // if(index==event.target.getAttribute('data-index')){
        // 	$('.imgbx'+index).addClass('imgbxborder');
        // }
        this.setState({
        	imgsrc:event.target.getAttribute('data-index')
        })

  }

    addtocart =(event)=>{
    // const token = localStorage.getItem("token");
    //   if(token!==null){
    //   // console.log("Header Token = ",token);
    //   // browserHistory.push("/");
    //   this.props.history.push("/");
    // }
    // else{
    // 	  this.props.history.push("/login");
    // }
    event.preventDefault();
    var id = event.target.id;
    
    axios.get('/api/products/get/one/'+id)
    .then((response)=>{
      var totalForQantity   =   parseInt(Number(this.state.totalQuanity) * response.data.offeredPrice);
          const userid = localStorage.getItem('user_ID');
         
          const formValues = { 
              "user_ID"    : userid,
              "product_ID" : response.data._id,
              "currency" : response.data.currency,
              "productCode" : response.data.productCode,
              "productName" : response.data.productName,
              "category" : response.data.category,
              "subCategory" : response.data.subCategory,
              "productImage" : response.data.productImage,
              "quantity" : this.state.totalQuanity,
			  "offeredPrice" : parseInt(response.data.offeredPrice),
			  "actualPrice" : parseInt(response.data.actualPrice),			  
              "totalForQantity" : totalForQantity,
              
          }
          axios.post('/api/carts/post', formValues)
          .then((response)=>{
            // console.log('response', response);
          swal(response.data.message)
            .then((obj)=>{
                  window.location.reload();
            });

          })
          .catch((error)=>{
            console.log('error', error);
          })
    })
    .catch((error)=>{
      console.log('error', error);
    })
  }
   addtowishlist(event){
    event.preventDefault();
    var user_ID = localStorage.getItem('user_ID'); 
    // console.log('user_ID ===============>>>>>>>>..', user_ID);
    if(user_ID){
    	var id = event.target.id;
	    axios.get('/api/products/get/one/'+id)
	    .then((response)=>{
	          const userid = localStorage.getItem('user_ID');
	          // console.log("userid",response.data);
	          const formValues = 
	          { 
	              "user_ID"    : userid,
	              "product_ID" : response.data._id,
	          }
	          axios.post('/api/wishlist/post', formValues)
	          .then((response)=>{
	            // console.log('response', response);
	            swal(response.data.message)
	            window.location.reload();
	          })
	          .catch((error)=>{
	            console.log('error', error);
	          })
	    })
	    .catch((error)=>{
	      console.log('error', error);
	    })
    }else{
    	this.props.history.push('/login');
    }
    
  }
  addQuantity(){
  	var totalQuanity = this.state.totalQuanity
  	totalQuanity++;
  	$('#addQuantity').addClass('auto');
  	$('#addQuantity').css('background-color','#fff');
  	$('#decreaseQuantity').addClass('auto');
  	$('#decreaseQuantity').css('background-color','#fff');
  	if(Number(totalQuanity) > Number(this.state.quanityLimit)){
  	 	$('#addQuantity').css('background-color','#ccc');
  	 	$('#addQuantity').addClass('no-drop');
  	}else{
  		this.setState({totalQuanity : totalQuanity});
  		document.getElementById('totalQuanity').innerHTML = totalQuanity;
  	}
  }
  decreaseQuantity(){
  	var totalQuanity = this.state.totalQuanity
  	totalQuanity--;
  	$('#addQuantity').addClass('auto');
  	$('#addQuantity').css('background-color','#fff');
  	$('#decreaseQuantity').addClass('auto');
  	$('#decreaseQuantity').css('background-color','#fff');
  	if(Number(totalQuanity) == 1 || Number(totalQuanity) > 1){
  		this.setState({totalQuanity : totalQuanity},() =>{
  			document.getElementById('totalQuanity').innerHTML = this.state.totalQuanity;
  		});
  		
  	}else{
  		$('#decreaseQuantity').addClass('no-drop');
  		$('#decreaseQuantity').css('background-color','#ccc');	
  	}
  }
  render() {
  		 console.log('this.props.productID', this.props.productID);
		return (
				
			this.state.productData?
				<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt20 backColorWhite mb20 boxBorder">
					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mt50"> 
						<div className="col-lg-5 col-md-5 col-sm-12 col-xs-12 ">							
						<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 imageContainer">
							{
								this.state.productData.productImage && this.state.productData.productImage.length>0? 
								this.state.productData.productImage.map((data, index)=>{
									
									if( !_.isEmpty(data)){
									// if(index>0 && !_.isEmpty(data)){
										return(
                       					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 miniImagesInNew" key={index+this.props.type} onClick={this.changeImage} >
											<div className="row">
											{
												data &&  <img data-index={index} className={index==this.state.imgsrc?"imgbxborder":""} src={data} alt="default"/>
											}
											</div>
										</div>
                       					);
									}
                       				
                       			})	
                       			:
                       			null
							}
						</div>
							<div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 imageContainer imgCont">
								<div className="row">
									<img className="productView" src={this.state.productData.productImage && this.state.productData.productImage[0]} id="change-image" alt="default"/>
									
								</div>
							</div>
						</div>
						<div className="col-lg-7 col-md-7 col-sm-12 col-xs-12 ">
							<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 productInfoEcommerce">
								<div className="row">
									<div id="brand"><label className="productNameClassNewBrand"> {this.state.productData.productName} </label></div>
									{/*<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
									<div className="row  productNameClassNew">{this.state.productData.productName}</div>
									</div>*/}
									
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="row">
										<p className="orangetxt "><a href="#gotoreview" className="anchorclr">Be the first to review this product</a></p>
										{/*<span className="priceEcommerce" ><i className={"fa fa-"+this.state.productData.currency}></i>&nbsp;{this.state.productData.offeredPrice}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
										{this.state.productData.offered == true ? <span className="actualPrice"><i className={"fa fa-"+this.state.productData.currency}>&nbsp;{this.state.productData.actualPrice}</i></span> : null}*/}
										</div>
										<div className="undrln row"> </div>
									</div>
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
										<div className="row">
											<span className="col-md-2 col-lg-2 col-sm-12 col-xs-12 paddingleftzero ttl" >
												Price:
											</span>
											<span className="col-md-6 col-sm-12 col-xs-12 col-lg-6 ">
												<span className="priceEcommerceNew" ><i className={"fa fa-"+this.state.productData.currency}></i>&nbsp;{this.state.productData.offeredPrice}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
												{this.state.productData.offered == true ? <span className="actualPrice"><i className={"fa fa-"+this.state.productData.currency}>&nbsp;{this.state.productData.actualPrice}</i></span> : null}
											</span>				                         
				                          </div>
				                          <div className="row listspace">
											<span className="col-md-2 col-lg-2 col-sm-12 col-xs-12 paddingleftzero ttl" >
												In Stock
											</span>
											<span className="col-md-6  col-sm-12 col-xs-12 col-lg-6 ttl" >
												{this.state.productData.availableQuantity}
											</span>
															                         
				                          </div>
				                          <div className="row listspace">
											<span className="col-md-2 col-lg-2 col-sm-12 col-xs-12  paddingleftzero paddingrightzero ttl" >
												Product Code
											</span>
											<span className="col-md-6  col-sm-12 col-xs-12 col-lg-6 ttllist" >
												{this.state.productData.productCode}
											</span>
															                         
				                          </div>
				                    </div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-12 listspace">
						<span className="col-md-2 col-lg-2 col-sm-12 col-xs-12 paddingleftzero paddingrightzero ttl" >
								Features
							</span>
							<span className="col-md-10 col-sm-12 col-xs-12 col-lg-10 ttllist" >												
								{ this.state.productData.featureList &&
									<div className="">
										<ul className="paddingleftzero">
										{ this.state.productData.featureList && 
											this.state.productData.featureList.map((data,index)=>{
												return (
													<div className="" key={index+this.props.type}>
													<div className="">
													 <span className="fa fa-circle-o tealColorfnt "></span>
													  <span className="blackColor ">&nbsp;&nbsp;{data.feature}</span>
													</div>
													</div>
												);
											})
											
										}
										</ul>
									</div>
								}
						</span>				                         
	                </div>
					<div className="col-lg-8 col-lg-offset-2 col-md-12 col-sm-12 col-xs-12 adCart ">
						<div className="row spc">
							<div className="col-lg-4 col-md-2 col-sm-2 col-xs-2 paddingleftzero">
								<div className="col-lg-6 col-md-8 col-sm-8 col-xs-8">
									<span className="qty" id="totalQuanity">
									&nbsp;&nbsp;1
									</span>
								</div>
								<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4">
									<span className="qty2 col-lg-12 col-md-12 col-sm-12 col-xs-12 cursorpointer" id="addQuantity" onClick={this.addQuantity.bind(this)}>
									 <span className="fa fa-plus" aria-hidden="true"></span>
									</span>
									<span className="qty3 col-lg-12 col-md-12 col-sm-12 col-xs-12 cursorpointer"  id="decreaseQuantity" onClick={this.decreaseQuantity.bind(this)}>
										 <span className="fa fa-minus" aria-hidden="true"></span>
									</span>
								</div>
							</div>
							<div className="col-lg-8 col-md-8 col-sm-8 col-xs-8 paddingleftzero">
								<div className="col-lg-6 col-md-6 col-sm-6 col-xs-6">
									<span onClick={this.addtocart.bind(this)} id={this.state.productData._id} className="qtycart clr cursorpointer">
									 	<i className="fa fa-shopping-cart " aria-hidden="true" id={this.state.productData._id}></i> Add to Cart
									</span>
								</div>
								<div className="col-lg-3 col-md-3 col-sm-3 col-xs-3 paddingleftzero">
									<span onClick={this.addtowishlist.bind(this)}  id={this.state.productData._id} className="icns clr cursorpointer">
									 	<i className="fa fa-heart-o" aria-hidden="true"  id={this.state.productData._id}></i>
									</span>
								</div>				
							</div>   
	                    </div>
					</div>
                </div>
			:
			null
				
		);
	}
}
export default withRouter(ProductModalViewEcommerce);
