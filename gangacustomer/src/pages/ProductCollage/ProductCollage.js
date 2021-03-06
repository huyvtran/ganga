import React, { Component } 		from 'react';
import ProductCollageView 			from '../../blocks/ProductCollage/ProductCollageView.js';
import SearchProductPage  			from  './SearchProductPage.css';
import $                    		from 'jquery';
import InputRange 					from 'react-input-range';
import  'react-input-range/lib/css/index.css';
import axios 						from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import 'bootstrap/js/collapse.js';
import Loader from "../../common/loader/Loader.js";

class ProductCollage extends Component {
	constructor(props){
    super(props);
	    this.state = { 
	    	searchResult : [],
	    	data:[1, 2, 3, 4, 5, 6],
	    	price: { min: 10, max: 1299999 },
	    	categoryDetails:[],
	    	masterproducts:[],
	    	products:[],
	    	sectionID:'',
	    	categoryID:'',
			subcategoryID:'',
      		activePage: 1,
      		selectedbrands:[],
      		minPrice: 0,
      		maxPrice: 0,
      		minPriceLmt: 0,
      		maxPriceLmt: 0,
      		sizes : [],
      		colors: [],
      		color: '',
      		size : '',
      		selector:{},
      		loading:true,
      		toggleIcon : "fa fa-plus-circle"
      		//selector:{sectionID: this.props.match.params.sectionID, categoryID:'',subcategoryID:'',brands:[], size:'',color:'',price: { min: 10, max: 129999 } }
	    };
	    this.handlePriceChange = this.handlePriceChange.bind(this);  
	    
  	}

  	componentDidMount() {

		this.getWishData();
  		
  		var selector = this.state.selector;
  		
  		if (this.props.match.params.categoryID && this.props.match.params.subcategoryID) {
  			selector.category_ID = this.props.match.params.categoryID;
        	selector.subCategory_ID = this.props.match.params.subcategoryID;
        	this.setState({selector: selector});
        	var subcatArray = [];
        	subcatArray.push(this.props.match.params.subcategoryID);
        	this.getBrandsBySubcategories(subcatArray);
        	this.getSizeBySubcategory(this.props.match.params.subcategoryID)
  			this.getColorBySubategory(this.props.match.params.subcategoryID);
  			this.getProductsBySubCategory(this.props.match.params.categoryID, this.props.match.params.subcategoryID);
  			this.getAttributesBySubcategory();
  		}
  		else if(this.props.match.params.categoryID){
  			selector.category_ID = this.props.match.params.categoryID;
        	this.setState({selector: selector});
        	var catArray = [];
        	catArray.push(this.props.match.params.categoryID);
        	this.getBrandsByCategories(catArray);
        	this.getSizeByCategory(this.props.match.params.categoryID);
        	this.getColorByCategory(this.props.match.params.categoryID);
  			this.getProductsByCategory(this.props.match.params.categoryID);
  			this.getAttributesByCategory();
  		}
  		else{
  			selector.section_ID = this.props.match.params.sectionID;
        	this.setState({selector: selector});
        	this.getBrands();
        	this.getSize();
        	this.getColor();
        	this.getAttributes();
  			this.getProductsBySection(this.props.match.params.sectionID);
  		}
  		this.getSectionDetails(this.props.match.params.sectionID);
  		// this.getCategoryDetails(this.props.match.params.categoryID);
  		
  		
  		
  		
  		this.getPriceLimits();

		$('.dropdown-submenu a.test').on("click", function(e){
		    $(this).next('ul').toggle();
		    e.stopPropagation();
		    e.preventDefault();
		});
  	}
  	handleToggle(event){
  		var currentIcon = $('.'+event.target.getAttribute('data-key')+"Icon").attr('class');
  		console.log(currentIcon)
  		if (currentIcon == "fa fa-plus-circle "+ event.target.getAttribute('data-key')+"Icon") {
			this.setState({['toggleIcon'+event.target.getAttribute('data-key')]	:"fa fa-minus-circle "+event.target.getAttribute('data-key')+"Icon"},()=>{})
		}else{
			this.setState({['toggleIcon'+event.target.getAttribute('data-key')]: "fa fa-plus-circle "+event.target.getAttribute('data-key')+"Icon"},()=>{})
		}
  	}
  	getSectionDetails(sectionID){
  		axios.get("/api/category/get/"+sectionID)
	      .then((response)=>{ 
	          this.setState({
	              categoryDetails : response.data
	          })
	          
	      })
	      .catch((error)=>{
	            console.log('error', error);
	      })
  	}
  	getCategoryDetails(categoryID){
		axios.get("/api/category/get/one/"+categoryID)
	      .then((response)=>{ 
	          this.setState({
	              categoryDetails : response.data
	          })
	          
	      })
	      .catch((error)=>{
	            console.log('error', error);
	      })
	}
	getPriceLimits(){
		axios.get("/api/products/get/minmaxprice/"+this.props.match.params.sectionID)
	      .then((response)=>{ 
	      		this.setState({
		      		minPriceLmt : Number(response.data.min),
		        	maxPriceLmt : Number(response.data.max),
		        	price:{min : Number(response.data.min), max: Number(response.data.max) }
		      	});
	      })
	      .catch((error)=>{
	            console.log('error', error);
	      })
	}
	getProductsBySection(sectionID){
		var limit;
		if ($('.limitProducts').val()) {
			limit = $('.limitProducts').val();
		}else{
			limit = "10";
		}
		axios.get("/api/products/get/list/"+sectionID)
	      .then((response)=>{ 

	      		var products = response.data.filter( (array_el, index)=>  {
			        return index < limit ;
			    });
	          	this.setState({
	          	  loading:false,
	              products 		 : products
	          	})
	      })
	      .catch((error)=>{
	      	//alert();
	            console.log('error', error);
	      })
	}
	
	getProductsByCategory(categoryID){
		var limit;
		if ($('.limitProducts').val()) {
			limit = $('.limitProducts').val();
		}else{
			limit = "10";
		}
		axios.get("/api/products/get/listbycategory/"+categoryID)
	      .then((response)=>{
	      		var products = response.data.filter( (array_el, index)=>  {
			        return index < limit ;
			    });
	          	this.setState({
	          	  loading:false,
	              products 		 : products
	          	})
	          
	          
	      })
	      .catch((error)=>{
	            console.log('error', error);
	      })
	}
	
	getProductsBySubCategory(categoryID, subcategoryID){
		var limit;
		if ($('.limitProducts').val()) {
			limit = $('.limitProducts').val();
		}else{
			limit = "10";
		}
		axios.get("/api/products/get/list/"+categoryID+'/'+subcategoryID)
	      .then((response)=>{ 
	      		var products = response.data.filter( (array_el, index)=>  {
			        return index < limit ;
			    });
	          this.setState({
	          	loading:false,
	            products 		 : products
	          })
	          
	          
	      })
	      .catch((error)=>{
	            console.log('error', error);
	      })
	}
	onSelectedItemsChange(filterType, selecteditems){
		
		var checkboxes = document.getElementsByName('brands[]');
		var brands = [];
		for (var i=0, n=checkboxes.length;i<n;i++) 
		{
		    if (checkboxes[i].checked) 
		    {
		    	brands.push(checkboxes[i].value);
		    }
		}
		if (filterType == 'category') {
			var selector=this.state.selector;
			delete selector.subCategory_ID;
			selector.section_ID = this.props.match.params.sectionID;
			selector.price = this.state.price;
			selector.category_ID = $(selecteditems.target).data().id;
			if (this.props.match.params.subcategoryID && !selector.subCategory_ID) {
				selector.subCategory_ID = this.props.match.params.subcategoryID;
			}
			this.setState({	selector: selector },()=>{
					this.getFilteredProducts(this.state.selector);
				})
		}
		if (filterType == 'subcategory') {
			var selector=this.state.selector;
			selector.section_ID = this.props.match.params.sectionID;
			selector.price = this.state.price;
			selector.subCategory_ID = $(selecteditems.target).data().id;

			if (this.props.match.params.categoryID && !selector.category_ID) {
				selector.category_ID = this.props.match.params.categoryID;
			}
			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
			}) 
		}
		if (filterType == 'brands') {
			var selector=this.state.selector;
			selector.section_ID = this.props.match.params.sectionID;
			selector.price = this.state.price;
			selector.brands = brands;
			
			if (this.props.match.params.categoryID && !selector.category_ID) {
				selector.category_ID = this.props.match.params.categoryID;
			}
			if (this.props.match.params.subcategoryID && !selector.subCategory_ID) {
				selector.subCategory_ID = this.props.match.params.subcategoryID;
			}
			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
			})
		}
		if (filterType == 'price') {
			var minPrice = selecteditems.min;
			var maxPrice = selecteditems.max;

			var selector=this.state.selector;
			selector.section_ID = this.props.match.params.sectionID;
			
			if (this.props.match.params.categoryID && !selector.category_ID) {
				selector.category_ID = this.props.match.params.categoryID;
			}
			if (this.props.match.params.subcategoryID && !selector.subCategory_ID) {
				selector.subCategory_ID = this.props.match.params.subcategoryID;
			}

			this.setState({price: {min: minPrice, max: maxPrice } }, ()=>{
				selector.price = this.state.price;
				this.setState({	selector: selector },()=>{
					this.getFilteredProducts(this.state.selector);
				})
			});
		}
		if (filterType == 'color') {
			$('.color-option').css('box-shadow','0px 0px 0px 0px #888888');
			$(selecteditems.currentTarget).find('.color-option').css('box-shadow','0px 0px 1px 4px #888888');
			var selector=this.state.selector;
			selector.section_ID = this.props.match.params.sectionID;
			selector.price = this.state.price;
			selector.color = $(selecteditems.currentTarget).find('.color-option').data('color');
			
			if (this.props.match.params.categoryID && !selector.category_ID) {
				selector.category_ID = this.props.match.params.categoryID;
			}
			if (this.props.match.params.subcategoryID && !selector.subCategory_ID) {
				selector.subCategory_ID = this.props.match.params.subcategoryID;
			}

			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
			})
		}
		if (filterType == 'size') {
			var selector=this.state.selector;
			selector.section_ID 	= this.props.match.params.sectionID;
			selector.price 		= this.state.price;
			selector.size 	= $(selecteditems.currentTarget).val();

			if (this.props.match.params.categoryID && !selector.category_ID) {
				selector.category_ID = this.props.match.params.categoryID;
			}
			if (this.props.match.params.subcategoryID && !selector.subCategory_ID) {
				selector.subCategory_ID = this.props.match.params.subcategoryID;
			}

			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
			})
		}
		if (filterType == 'attributes') {
			var selector=this.state.selector;
			var AttrArray = selector.attributes ? selector.attributes : [];
			if (selecteditems.currentTarget.checked) {
				AttrArray.push({
					attributeName  : $(selecteditems.currentTarget).attr('name'),
					attributeValue : $(selecteditems.currentTarget).val()
				})
			}else{
				AttrArray = AttrArray.filter((item)=>{
		    		return  item.attributeValue != $(selecteditems.currentTarget).val();
		    	})
			}
			//console.log(AttrArray);
			
			selector.attributes = AttrArray;
			selector.section_ID 	= this.props.match.params.sectionID;
			selector.price 		= this.state.price;
			
			if (this.props.match.params.categoryID && !selector.category_ID) {
				selector.category_ID = this.props.match.params.categoryID;
			}
			if (this.props.match.params.subcategoryID && !selector.subCategory_ID) {
				selector.subCategory_ID = this.props.match.params.subcategoryID;
			}

			this.setState({	selector: selector },()=>{
				this.getFilteredProducts(this.state.selector);
			})
		}
	}
	getFilteredProducts(selector){
		
		//console.log('limitProducts',$('.limitProducts').val());
		if ($('.limitProducts').val()) {
			selector.limit = $('.limitProducts').val();
		}else{
			selector.limit = "10";
		}
		
		console.log('selector',selector);
		axios.post("/api/products/post/list/filterProducts/",selector)

	      	.then((response)=>{ 
	      		this.setState({products :response.data});
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	filterProducts(subcategoryID,selectedbrands,price,color,size){
		
		if (subcategoryID != '') { 

			var products = this.state.masterproducts.filter( (array_el)=>  {
              return subcategoryID == array_el.subCategory_ID 
              && Number(array_el.discountedPrice) > Number(this.state.price.min) 
              && Number(array_el.discountedPrice) < Number(this.state.price.max);
        	});
        	this.setState({products :products});
		}
		if(selectedbrands.length > 0 && subcategoryID != ''){
			var products = this.state.masterproducts.filter( (array_el)=>  {
				return selectedbrands.filter( (selectedItems_el) => {
                  return selectedItems_el == array_el.brand 
                  	&& subcategoryID == array_el.subCategory_ID
                  	&& Number(array_el.discountedPrice) > Number(this.state.price.min) 
              		&& Number(array_el.discountedPrice) < Number(this.state.price.max);
                }).length != 0
        	});
        	this.setState({products :products})
		}
		if (subcategoryID == '') {
			
			var products = this.state.masterproducts.filter( (array_el)=>  {
              return Number(array_el.discountedPrice) > Number(this.state.price.min) 
              && Number(array_el.discountedPrice) < Number(this.state.price.max);
        	});
         	this.setState({products :products});
		}
		if (subcategoryID == '' && selectedbrands.length > 0) {
			var products = this.state.masterproducts.filter( (array_el)=>  {
				return selectedbrands.filter( (selectedItems_el) => {
                  return selectedItems_el == array_el.brand
                  	&& Number(array_el.discountedPrice) > Number(this.state.price.min) 
              		&& Number(array_el.discountedPrice) < Number(this.state.price.max);
                }).length != 0
        	});
        	this.setState({products :products});
		}
		else{

		}
	}
	getBrands(){
		axios.get("/api/products/get/listBrand/"+this.props.match.params.sectionID)

	      	.then((response)=>{ 
	      	
	          this.setState({
	              brands : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getBrandsByCategories(categories){
		var formValues = {
			categories : categories
		}
		 
		axios.post("/api/products/get/listBrandByCategories",formValues)

	  	.then((response)=>{ 
	      this.setState({
	          brands : response.data
	      })
	  	})
	  	.catch((error)=>{
	        console.log('error', error);
	  	})
	}
	getBrandsBySubcategories(subcategories){
		var formValues = {
			subcategories : subcategories
		}
		 
		axios.post("/api/products/get/listBrandBySubcategories",formValues)

	  	.then((response)=>{ 
	      this.setState({
	          brands : response.data
	      })
	  	})
	  	.catch((error)=>{
	        console.log('error', error);
	  	})
	}
	
	getSize(){
		axios.get("/api/products/get/listSize/"+this.props.match.params.sectionID)

	      	.then((response)=>{ 
	      	
	          this.setState({
	              sizes : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getSizeByCategory(categoryID){
		axios.get("/api/products/get/listSizeByCategory/"+categoryID)

	      	.then((response)=>{ 
	      	
	          this.setState({
	              sizes : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getSizeBySubcategory(subcategoryID){
		axios.get("/api/products/get/listSizeBySubcategory/"+subcategoryID)

	      	.then((response)=>{ 
	      	
	          this.setState({
	              sizes : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getColor(){
		axios.get("/api/products/get/listColor/"+this.props.match.params.sectionID)

	      	.then((response)=>{ 
	      	
	          this.setState({
	              colors : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getColorByCategory(categoryID){
		axios.get("/api/products/get/listColorByCategory/"+categoryID)

	      	.then((response)=>{ 
	      	
	          this.setState({
	              colors : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getColorBySubategory(subcategoryID){
		axios.get("/api/products/get/listColorBySubcategory/"+subcategoryID)

	      	.then((response)=>{ 
	      	
	          this.setState({
	              colors : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getAttributes(){
		axios.get("/api/products/get/attributes/"+this.props.match.params.sectionID)

	      	.then((response)=>{ 
	        var arr = [];
		    Object.keys(response.data).forEach(function(key) {
		      arr.push(response.data[key]);
		    });			
	          this.setState({
	              attributesArray : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getAttributesByCategory(){
		axios.get("/api/products/get/attributesbycategory/"+this.props.match.params.categoryID)

	      	.then((response)=>{ 
	        var arr = [];
		    Object.keys(response.data).forEach(function(key) {
		      arr.push(response.data[key]);
		    });			
	          this.setState({
	              attributesArray : response.data
	          })
	      	})
	      	.catch((error)=>{
	            console.log('error', error);
	      	})
	}
	getAttributesBySubcategory(){
		axios.get("/api/products/get/attributesbysubcategory/"+this.props.match.params.subcategoryID)

	      	.then((response)=>{ 
	        var arr = [];
		    Object.keys(response.data).forEach(function(key) {
		      arr.push(response.data[key]);
		    });			
	          this.setState({
	              attributesArray : response.data
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
		      	},()=>{
		      		console.log('target',Number(target.value))
		      		if ( Number(target.value) < this.state.minPriceLmt) {
		      			this.setState({
		          		price: { min : Number(this.state.minPriceLmt), max : Number(this.state.price.max) } });
	      			}else{
	      				var selector=this.state.selector;
						selector.section_ID = this.props.match.params.sectionID;
						selector.price = this.state.price;
							this.setState({	selector: selector },()=>{
								this.getFilteredProducts(this.state.selector);
							})
	      			}
		      		
				});
	      	//}
	      	 
	      }
	      if (name == 'slider_max') {
	      	if (Number(target.value) == this.state.maxPriceLmt) {

	      	}else{
		      	this.setState({
		          price: { min : Number(this.state.price.min),  max : Number(target.value)}
		      	},()=>{
		      		var selector=this.state.selector;
					selector.section_ID = this.props.match.params.sectionID;
					selector.price = this.state.price;
						this.setState({	selector: selector },()=>{
							this.getFilteredProducts(this.state.selector);
						})
		      	}); 
		    }
	      	
	      }
	}
	getWishData(){
		var user_ID = localStorage.getItem('user_ID');
		axios.get('/api/wishlist/get/userwishlist/'+user_ID)
		.then((response)=>{
		  this.setState({
			wishList : response.data
		  },()=>{
		  })
		})
		.catch((error)=>{
		  console.log('error', error);
		})
	}
	
  limitProducts(event){
    event.preventDefault();
    var selector = this.state.selector;

    selector.limit = $(event.target).val()

    this.setState({	selector: selector },()=>{
		this.getFilteredProducts(this.state.selector);
	})
    /*if (this.props.parameters) {
      if (this.props.parameters.categoryID && this.props.parameters.subcategoryID) { 
        var selector = this.props.selector;
        selector.category_ID = this.props.parameters.categoryID;
        selector.subCategory_ID = this.props.parameters.subcategoryID;
        selector.limit = $(event.target).val()

        this.setState({	selector: selector },()=>{
			this.getFilteredProducts(this.state.selector);
		})
        //this.props.getFilteredProductsFun(this.props.selector);
      }
      else if (this.props.parameters.categoryID) {
        var selector = this.props.selector;
        selector.category_ID = this.props.parameters.categoryID;
        selector.limit = $(event.target).val()
        this.setState({	selector: selector },()=>{
			this.getFilteredProducts(this.state.selector);
		})
        //this.props.getFilteredProductsFun(this.props.selector);
      }
      else if (this.props.parameters.sectionID) {
        var selector = this.props.selector;
        selector.section_ID = this.props.parameters.sectionID;
        selector.limit = $(event.target).val()
        this.setState({	selector: selector },()=>{
			this.getFilteredProducts(this.state.selector);
		})
        //this.props.getFilteredProductsFun(this.props.selector);
      }
    }else{
      var limit = $(event.target).val();   
      var products = this.state.masterLimitProducts.filter( (array_el, index)=>  {
       
          return index < limit ;
      });
      this.setState({products : products});
    }*/
  }  
  sortProducts(event){
      event.preventDefault(); 
      var sortBy = event.target.value;
      //console.log('products1',this.state.products);
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
  	render() {
		
    	var tempdata = [1,2,3]
		let minPrice = this.state.price.min;
		let maxPrice = this.state.price.max;
		//console.log('state',this.state["toggleIconcategory"])
		return (
	      	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 mb25" id="containerDiv">
	     	 <div className="row"> 

	     	 	<div>		
	     		<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">

	     			<ul className="links">
				    	<li><a  href="/">Home /</a></li>
				    	{ this.state.categoryDetails[0] ? 
				    		<li><a  href={"/section/"+this.state.categoryDetails[0].section.replace(/\s+/g, '-').toLowerCase()+'/'+this.state.categoryDetails[0].section_ID}>
				    		{this.state.categoryDetails[0].section}</a></li>
				    		: ""
				    	}
				    	{
				    	/*<li><a href={"/product-collage/"+this.state.categoryDetails._id}>{this.state.categoryDetails && this.state.categoryDetails.category}</a></li>*/
				  		}
				  	</ul>
				</div>	
               {/*for sm and xs*/}

                  <div className="hidden-lg hidden-md col-sm-12 col-xs-12 menudiv1">
                    <div className="hidden-lg menudiv hidden-md col-sm-4 col-xs-4">
                      <div className="dropdown">
					    <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">Menu
					    <span className="caret"></span></button>
					    <ul className="dropdown-menu">
					      	<li className="dropdown-submenu">
					        <a className="test" tabindex="-2" href="#">CATEGORY<span className="caret"></span></a>
					        <ul className="dropdown-menu">
					        {
								this.state.categoryDetails.length > 0  ?
								this.state.categoryDetails.map((data,index)=>{
									return(
										<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoriesContainerEcommerce" key={index} >
											<li>
												<a href="#productDiv" className="subcategory" data-id={data._id} onClick={this.onSelectedItemsChange.bind(this,'category')} style={{fontWeight:"100!important"}}>{data.category}</a>
												<ul>
													{
														data.subCategory.map((subcat,subind)=>{
															return(
																<li>
																<a href="#productDiv" className="subcategory" data-id={subcat._id} onClick={this.onSelectedItemsChange.bind(this,'subcategory')} style={{fontWeight:"100!important"}}>{subcat.subCategoryTitle}</a>
																</li>
															);	
														})
													}
													
												</ul>
											</li>
										</div>
									);
								})
								:
								<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-align-center">
								<li>No data Found</li>
								</div>
							}	
					        </ul>
					      	</li>

					      	{
					      		this.state.categoryDetails[0] && this.state.categoryDetails[0].section != "Grocery" &&
						    <li className="dropdown-submenu">
						        <a className="test" tabindex="-1" href="#">COLOR <span className="caret"></span></a>
						        <ul className="dropdown-menu">

						          {this.state.colors ? 
							      	this.state.colors.map((data,index)=>{
							      		return(
							      		<a href="#" className="col-sm-6 col-xs-6 swatch-option-link-layered" onClick={ this.onSelectedItemsChange.bind(this,"color")}>
	                                    	<div className="color-option" data-color={data} style={{backgroundColor:data}} option-tooltip-value={data} ></div>
	                            		</a>);
							      	})
							      	
							      	: <li>"no data </li>}	

						          {/*<li><a tabindex="-1" href="#">2nd level dropdown</a></li>
						          <li><a tabindex="-1" href="#">2nd level dropdown</a></li>*/}
						        </ul>
						    </li> 
						    }
						    {
					      	this.state.categoryDetails[0] && this.state.categoryDetails[0].section != "Grocery" &&
						       	<li className="dropdown-submenu">
						        <a className="test" tabindex="-1" href="#">SIZE <span className="caret"></span></a>
						        <ul className="dropdown-menu">
						         <select onChange={ this.onSelectedItemsChange.bind(this,"size")}>
						          {this.state.sizes ? 
							      	this.state.sizes.map((data,index)=>{
							      		return(<option value={data}>{data}</option>);
							      	  })
							      	: ''}
							      	</select>
						        </ul>
						      	</li>
					      }
					    </ul>
					  </div>		
			          </div> 
			           <div className="hidden-lg  hidden-md col-sm-4 col-xs-4 pull-right">
			            <div className="dropdown">
			              <button className="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">Menu1
						   <span className="caret"></span></button>
						    <ul className="dropdown-menu">
						     <li className="dropdown-submenu">
						        <a className="test" tabindex="-2" href="#">Featured Brands<span className="caret"></span></a>
						        <ul className="dropdown-menu">

						        { this.state.brands && this.state.brands.length > 0 ? 
								this.state.brands.map((data,index)=>{											
									return(
									<div className="hidden-lg hidden-md col-sm-6 col-xs-6 " key={index}>
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
						       </ul>
						      </li>
						    </ul>
			             </div>
			           </div>
			          </div> 


         {/*for lg and md*/}
			{
			this.state.categoryDetails.length > 0	?		
              <div className="col-lg-3 col-md-3 hidden-sm hidden-xs">
              		<div className="nb-brand col-lg-10 col-md-10 col-sm-12 col-xs-12 NoPadding">
						<div className="accordion" id="accordionExample">
						   <div className="card-header" id="headingOne">
						    <div className="pagefilter" data-toggle="collapse" data-target="#collapseOne" data-key="category"  onClick={this.handleToggle.bind(this)}>	
						        <button className="btn btn-link" type="button" data-key="category"   >
						          CATEGORY 
						        </button>
						        <span className="expand"><i className={this.state["toggleIconcategory"] ? this.state["toggleIconcategory"] : "fa fa-plus-circle categoryIcon"} data-key="category"></i></span>
						    </div>
						   </div>
						    <div id="collapseOne" className="collapse">
						      <div className="card-body">
						      	{
									this.state.categoryDetails.length > 0  ?
									this.state.categoryDetails.map((data,index)=>{
										return(
											<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 categoriesContainerEcommerce" key={index} >
												<li>
													<a href="#productDiv" className="subcategory" data-id={data._id} onClick={this.onSelectedItemsChange.bind(this,'category')} style={{fontWeight:"100!important"}}>{data.category}</a>
													<ul>
														{
															data.subCategory.map((subcat,subind)=>{
																return(
																	<li>
																	<a href="#productDiv" className="subcategory" data-id={subcat._id} onClick={this.onSelectedItemsChange.bind(this,'subcategory')} style={{fontWeight:"100!important"}}>{subcat.subCategoryTitle}</a>
																	</li>
																);	
															})
														}
														
													</ul>
												</li>
											</div>
										);
									})
									:
									<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 text-align-center">
									<li>No data Found</li>
									</div>
								}
						      </div>
						    </div>
							{
								this.state.categoryDetails[0] && this.state.categoryDetails[0].section != "Grocery" &&
								<div className="card-header" id="headingTwo">
						      <div className="pagefilter" data-toggle="collapse" data-target="#collapseTwo" data-key="color" onClick={this.handleToggle.bind(this)} >	
						        <button className="btn btn-link" type="button" data-key="color">
						          COLOR 
						        </button>
						        <span className="expand"><i className={this.state["toggleIconcolor"] ? this.state["toggleIconcolor"] : "fa fa-plus-circle colorIcon"} data-key="color"></i></span>
						     </div>
						    </div>
							}
						    

						    <div id="collapseTwo" className="collapse" >
						      <div className="card-body">
						      <br/>
						      {this.state.colors ? 
						      	this.state.colors.map((data,index)=>{
						      		return(
						      		<a href="#" className="swatch-option-link-layered" onClick={ this.onSelectedItemsChange.bind(this,"color")}>
                                    	<div className="color-option" data-color={data} style={{backgroundColor:data}} option-tooltip-value={data} ></div>
                            		</a>);
						      	})
						      	
						      	: ''}	
						      </div>
						    </div>
						
							{
					      	this.state.categoryDetails[0] && this.state.categoryDetails[0].section != "Grocery" &&
						    <div className="card-header" id="headingFour">
						      <div className="pagefilter" data-toggle="collapse" data-target="#collapseFour" data-key="size" onClick={this.handleToggle.bind(this)}>	
						        <button className="btn btn-link" type="button" data-key="size">
						          SIZE
						        </button>
						        <span className="expand"><i className={this.state["toggleIconsize"] ? this.state["toggleIconsize"] : "fa fa-plus-circle sizeIcon"} data-key="size"></i></span>
						      </div>
						    </div>
							}
						    <div id="collapseFour" className="collapse" >
						      <br/>
						      <div className="card-body">
							    <select  onChange={ this.onSelectedItemsChange.bind(this,"size")}>
							      {this.state.sizes ? 
							      	this.state.sizes.map((data,index)=>{
							      		return(<option value={data}>{data}</option>);
							      	  })

							      	: ''}
							      	
	                            </select>	
						      </div>
						    </div>

						    <div className="card-header" id="headingThree">
						      <div className="pagefilter"  data-toggle="collapse" data-target="#collapseThree" data-key="price" onClick={this.handleToggle.bind(this)}>	
						        <button className="btn btn-link" type="button" data-key="price">
						          PRICE
						        </button>
						        <span className="expand"><i className={this.state["toggleIconprice"] ? this.state["toggleIconprice"] : "fa fa-plus-circle priceIcon"} data-key="price" ></i></span>
						      </div>
						    </div>
						    <div id="collapseThree" className="collapse" >
						      <div className="card-body">
						      	<InputRange
							        maxValue={this.state.maxPriceLmt}
							        minValue={this.state.minPriceLmt}
							        value={this.state.price}
							        onChange={ this.onSelectedItemsChange.bind(this,"price")} />
							        <label>Min </label>
							        <input className="input-field min-value" type="text" maxLength="3" id="slider_min" name="slider_min" placeholder="From" value={this.state.price.min} onChange={this.handlePriceChange} /> &nbsp;
							        <label>Max </label><input className="input-field max-value" type="text" maxLength="5" id="slider_max" name="slider_max" placeholder="To" value={this.state.price.max} onChange={this.handlePriceChange} />
						      </div> 
						    </div>
						    {
						    	this.state.attributesArray ? 
						    	Object.entries(this.state.attributesArray).map(([key, value1], i)=>{
						    		
						    		return(
						    		<div>	
						    			<div className="card-header" id="headingThree">
									      <div className="pagefilter"  data-toggle="collapse" data-target={"#collapse"+key.replace(/\s/g,'') } data-key={key.replace(/\s/g,'')} onClick={this.handleToggle.bind(this)}>	
									        <button className="btn btn-link" type="button" data-key={key.replace(/\s/g,'')}>
									          {key}
									        </button>
									        <span className="expand"><i className={this.state["toggleIcon"+key.replace(/\s/g,'')] ? this.state["toggleIcon"+key.replace(/\s/g,'')] : "fa fa-plus-circle "+key.replace(/\s/g,'')+"Icon"} data-key={key.replace(/\s/g,'')}></i></span>
									      </div>
									    </div>
									    <div id={"collapse"+key.replace(/\s/g,'')} className="collapse" >
									    	<div className="card-body">
									    		{value1 && value1.length>0 ?
									    			value1.map((attrvalue, ind)=>{
									    				//console.log('attrvalue', attrvalue.attributeValue);
									    				return(<div class="checkbox">
																  <label><input type="checkbox" name={key} value={attrvalue.attributeValue} onClick={this.onSelectedItemsChange.bind(this,'attributes')} />{ attrvalue.attributeValue}</label>
																</div>
															);

									    			})
									    		 : null}
							    			</div>
									    </div>
									</div>    		
								    )
								})
								: null
						    }

						 </div>
              		</div>
              		<br/>
 					<div className="nb-brand col-lg-10 col-md-10 col-sm-12 col-xs-12 NoPadding">
					 <div className="Featured-Brands-tittle">Featured Brands</div>	
						{/*<ul className="Featured-Brands">
																
							<li className="Featured-Brands-li">
								<div className="Featured-Brands-li-div">
									<div className="Featured-Brands-li-div-div">
									<a className="imgs" href="http://demo8.cmsmart.net/mag2_amazon_themeforest/france/shopbybrand/index/view/id/1/">
									<img className="img_logo_brand" src="http://demo8.cmsmart.net/mag2_amazon_themeforest/pub/media///Shopbybrand//techservice.png" />
									</a>

									<a href="http://demo8.cmsmart.net/mag2_amazon_themeforest/france/shopbybrand/index/view/id/1/" className="name_brand"> iPhone</a>	
									</div>
								</div>	
							</li>
						</ul>*/}
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
              </div> : ""
          	}
              	{ 
              		this.state.loading ? 
              		<div className="col-lg-9 col-md-9 col-sm-12 col-xs-12 col-lg-offset-3" id="productDiv">
              			<Loader type="collageloader" productLoaderNo = {6}/> 
			        </div>  
			          :
              		this.state.products.length > 0 ? 
	              <div className="col-lg-9 col-md-9 col-sm-12 col-xs-12" id="productDiv">
					<br/>
					  <div className="tab-content">
					    <div id="products" className="tab-pane fade in active">
					    	<div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding content">
					    	
					    	<div className="row">
					          <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12 NoPadding mb20">
					            <div className="col-lg-4 col-md-6 col-sm-8 col-xs-8 NoPadding">
					              <div className="categoryName">{this.state.categoryDetails && this.state.categoryDetails.category}</div>
					            </div>
					            
					            <div className="col-lg-offset-2 col-md-offset-2 col-lg-4 col-md-6 col-sm-9 col-xs-9 NoPadding">
					              <label className="col-lg-3 col-md-6 col-sm-9 col-xs-9 NoPadding labeldiv">Sort By</label>
					              <select className="sortProducts col-lg-8 col-sm-9 col-md-8 col-xs-9 NoPadding" onChange={this.sortProducts.bind(this)}>
					                <option  className="hidden" >Relevance</option>
					                <option value="alphabeticallyAsc">Name A-Z</option>
					                <option value="alphabeticallyDsc">Name Z-A</option>
					                <option value="priceAsc">Price Low to High</option>
					                <option value="priceDsc">Price High to Low </option>
					            </select>
					            </div> 
					           
					            <div className="col-lg-2 col-md-2 col-sm-3 col-xs-3 pull-right NoPadding">
					              <label className="col-lg-5 col-md-5 col-sm-10 col-xs-10 NoPadding labeldiv">Show</label>
					              <select className="limitProducts col-lg-6 col-md-6 col-sm-6 col-xs-6 NoPadding" onChange={this.limitProducts.bind(this)}>
					                <option  value="10" >10</option>
					                <option value="20">20</option>
					                <option value="30">30</option>
					                <option value="40">40</option>
					            </select>
					            </div>
					          </div>
						    </div>
					    	{
					    		<ProductCollageView
					    		products={this.state.products} 
					    		categoryDetails={this.state.categoryDetails} 
					    		getWishData={this.getWishData.bind(this)} wishList={this.state.wishList}
					    		getFilteredProductsFun = {this.getFilteredProducts.bind(this)}
					    		parameters={this.props.match.params} 
					    		selector={this.state.selector}/>
					    	}		
					     	</div>
					    </div>
					    <div id="categories" className="tab-pane fade">
					    	Categories 
					    </div>
					  </div>
	              </div>
              	: <div className="text-center"><img src="/images/noproducts.jpeg" /></div>
          		}
              </div>
            
             </div>
	     	</div>
	    )
	}
}  	
export default ProductCollage;