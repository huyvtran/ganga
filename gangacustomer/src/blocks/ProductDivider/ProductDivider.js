import React, { Component } from 'react';
import "./ProductDivider.css";

export default class ProductDivider extends Component {
	constructor(props){
    super(props);
	   
	    this.state={
	    	categoriesImg        : [],
	    }
  	} 
  	componentWillReceiveProps(nextProps){
  		
  		this.setState({categoriesImg:nextProps.categories},()=>{
  			
  		});
      // this.changeProductCateWise(categoryID, type);
    } 
  render() {
  	 
		return (
		<div className="col-lg-12 col-md-12 col-ms-12 col-xs-12">	
			<div className="col-lg-12 col-md-12 col-ms-12 col-xs-12">
				{
					this.state.categoriesImg && this.state.categoriesImg.map((data,index)=>{
						if (index < 8 ) {
							console.log("section", data);
						return(
							<div className="col-lg-3 col-md-3 col-sm-6 col-xs-6" key={index}>
				                <a href={"/section/"+ data.section.replace(/\s+/g, '-').toLowerCase() +'/'+data.section_ID} >
				                <div className="block">
				                    <a className="image" href={"/section/"+data.sectionUrl+'/'+data.section_ID} target="_blank"> 
				                    <img src={data.categoryImage} alt="home banner" className="divImage"/></a>
				                	<div className="figcaption">
				                		<span>{data.category}</span>
				                	</div>
				                </div>
				                </a>
			            	</div>
						);
						}
					})
				}
         	</div>  
        </div> 	
		);
	}
}
