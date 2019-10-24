import React, { Component } 		from 'react';
import ProductCollageView 			from '../../blocks/ProductCollage/ProductCollageView.js';
import SearchProductPage  			from  './SearchProductPage.css';
import $                    		from 'jquery';
import InputRange 					from 'react-input-range';
import  'react-input-range/lib/css/index.css';
import axios 						from 'axios';
import { connect }        from 'react-redux';
import {Route, withRouter} from 'react-router-dom';

class SearchProduct extends Component {
	constructor(props){
    super(props);
	    this.state = {
	    	searchResult : [],
	    	data:[1, 2, 3, 4, 5, 6],
	    	masterproducts:[],
	    	products:[],
	    	categoryID:'',
			subcategoryID:'',
      		activePage: 1,
      		selectedbrands:[],
      		searchCriteria: [],
      		categoryDetails:[]
	    };
	    this.handlePriceChange = this.handlePriceChange.bind(this);  
  	}

  	componentDidMount() {
  		$('div[data-toggle="collapse"]').click(function () {
  			$(this).find('i').toggleClass('fa fa-minus fa fa-plus');
  		});
  		
  	}
  	componentWillReceiveProps(nextProps){
  		
  		this.setState({
  			products 		: nextProps.searchResult,
	        masterproducts 	: nextProps.searchResult,
	        searchCriteria  : nextProps.searchCriteria,
	        categoryDetails : nextProps.categoryDetails 

  		},()=>{
  			console.log('categoryDetails',this.state.categoryDetails);
	  		if (this.state.categoryDetails &&  this.state.categoryDetails[0]) {
	  			this.getBrands(this.state.categoryDetails[0].section_ID);
	  		}
	  		
  		})
  		
  	}
  	
	onSelectedItemsChange(filterType, selecteditems){
		
		if (filterType == 'brands') {
			var checkboxes = document.getElementsByName('brands[]');
			var brands = [];
			for (var i=0, n=checkboxes.length;i<n;i++) 
			{
			    if (checkboxes[i].checked) 
			    {
			    	brands.push(checkboxes[i].value);
			    }
			}
			this.setState({selectedbrands : brands},() =>{
				this.filterProducts(this.state.subcategoryID, this.state.selectedbrands,this.state.price);
			});
		}
			
	}
	filterProducts(subcategoryID,selectedbrands,price){
		
		if(selectedbrands.length > 0){
			var products = this.state.masterproducts.filter( (array_el)=>  {
				return selectedbrands.filter( (selectedItems_el) => {
                  return selectedItems_el == array_el.brand
                }).length != 0
        	});
        	this.setState({products :products})
		}
		
		else{
			this.setState({products :this.state.masterproducts})
		}
	}
	getBrands(sectionID){
		

		axios.get("/api/products/get/listBrand/"+sectionID)

	  	.then((response)=>{ 
	  	
	      this.setState({
	          brands : response.data
	      })
	  	})
	  	.catch((error)=>{
	        console.log('error', error);
	  	})
	}
	
	handlePriceChange(event) {
	      event.preventDefault();
	      const target = event.target;
	      const name = target.name;

	      if (name == 'slider_min') {
	      	this.setState({
	          price: { min : Number(target.value),  max : Number(this.state.price.max)}
	      	}); 
	      }
	      if (name == 'slider_max') {
	      	this.setState({
	          price: { min : Number(this.state.price.min),  max : Number(target.value)}
	      	}); 
	      } 
	}
	sortProducts(event){
		event.preventDefault();
		var sortBy = event.target.value;
		
		if(sortBy == "alphabeticallyAsc"){
			let field='productName';
			this.setState({
				products: this.state.products.sort((a, b) => (a[field] || "").toString().localeCompare((b[field] || "").toString()))
			});
		}
		if(sortBy == "alphabeticallyDsc"){
			let field='productName';
			this.setState({
				products: this.state.products.sort((a, b) => -(a[field] || "").toString().localeCompare((b[field] || "").toString()))
			});
		}
		if(sortBy == "priceAsc"){
			let field='discountedPrice';
			this.setState({
				products: this.state.products.sort((a, b) => a[field] - b[field])
			});
		}
		if(sortBy == "priceDsc"){
			let field='discountedPrice';
			this.setState({
				products: this.state.products.sort((a, b) => b[field] - a[field])
			});
		}
	}
	clearAll(event){
	  // this.props.clearAllinput(
	  // 				{
   //                    "searchstr" :  "",  
   //                    "catArray"  :  []
   //                  },[]); 
	}
  	render() {
		return (
	      	<div className="container" id="containerDiv">
	     	<div className="row"> 
	     		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
	     			<ul className="links">
				    	<li><a  href="/">Home /</a></li>
				    	{
				    		this.props.searchCriteria && this.props.searchCriteria.catArray && this.props.searchCriteria.catArray.map((data,index)=>{
				    			return(<li><a href={"/category/"+data.category+"/"+data.section_ID+"/"+data.id}>{data.category} / </a></li>);	
				    		})
				    	}
				    	
				  	</ul>
				</div>		
              <div className="col-lg-3 col-md-3 col-sm-3 col-xs-3">
              		<div className="forSearchDiv">
              			<h5 className="showingby">NOW SHOWING BY</h5>
              			{
              				/*<span><a href="#" onClick={this.clearAll.bind(this)}>Clear All </a></span>*/
              			}
              		</div>
              		
              		<br/>
 					<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 nb-brand">
					<div className="Featured-Brands-tittle">Featured Brands</div>
						
						<br/>
						{ this.state.brands && this.state.brands.length > 0 ? 
										this.state.brands.map((data,index)=>{
											
											return(
											<div className="col-lg-9 col-md-12 col-sm-12 col-xs-12 " key={index}>
												<div>
														<div className="centreDetailContainerEcommerce col-lg-1 row">
														<input type="checkbox" name="brands[]" onChange={this.onSelectedItemsChange.bind(this,"brands")} value={data}/>
														<span className="centreDetailCheckEcommerce"></span>
														</div>
													<span className="centreDetaillistItemEcommerce">{data}</span>
												</div>
											</div>
											);
										})
										: ''

									}
						
					</div>
              </div>
              <div className="col-lg-9 col-md-9 col-sm-9 col-xs-9">

              	<ul className="nav nav-tabs searchtab">
				    <li className="active"><a data-toggle="tab" href="#products">Products</a></li>
				    
			    {/*<li><a data-toggle="tab" href="#categories">Categories</a></li>*/}
				</ul>
				<br/>
				  <div className="tab-content">
				    <div id="products" className="tab-pane fade in active">
				    	{
				    	/*<div className="col-lg-4 col-md-4 col-sm-4 col-xs-4 pull-right NoPadding">
				    		
				    		<select className="form-control sortProducts col-lg-3" onChange={this.sortProducts.bind(this)}>
								<option  className="hidden" >Relevence</option>
								<option value="alphabeticallyAsc">Name A-Z</option>
								<option value="alphabeticallyDsc">Name Z-A</option>
								<option value="priceAsc">Price Low to High</option>
								<option value="priceDsc">Price High to Low </option>
							</select>
				    	</div>*/
				    	}
				    	
				    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding">
				    		<ProductCollageView products={this.state.products}/>
				     	</div>
				    </div>
				    <div id="categories" className="tab-pane fade">
				    	<ul>
				    	{
				    		this.state.categoryDetails && this.state.categoryDetails[0] && this.state.categoryDetails.map((data, index)=>{
				    			return(
				    				<li key={index}><a href={"/product-collage/"+data._id}>{data.category}</a>

				    				</li>
				    				);
				    		})
				    	} 
				    	</ul>
				    </div>
				    
				  </div>
              	
              </div>
            </div>
	     	</div>
	    )
	}
}  	
const mapDispachToProps = (dispach) =>{
  return {
    clearAllinput : (searchCriteria, searchResult)=> dispach({
      type:'SEARCH_PRODUCT',
      searchCriteria : searchCriteria,
      searchResult : searchResult
    }),
  }
}
const mapStateToProps = (state)=>{
  return {
    cartCount :  state.cartCount,
    wishlistCount : state.wishlistCount,
    searchResult : state.searchResult,
    searchCriteria : state.searchCriteria,
    categoryDetails : state.categoryDetails
  }
}
export default connect( mapStateToProps)(withRouter(SearchProduct));