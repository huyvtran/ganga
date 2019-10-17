import React, { Component }   from 'react';
import $                      from 'jquery';
import axios                  from 'axios';
import ReactTable             from "react-table";
import IAssureTable           from "./ProductReviewTable/IAssureTable.jsx";
import swal                   from 'sweetalert';
import _                      from 'underscore';
import "./Productreview.css";


class Productreview extends Component{
    constructor(props) { 
        super(props);
        this.state = {
            tableHeading :{
                "product"   : "Product Name(Product Code)",
                "customerReview" : 'Customer Review',
                "customerName" : 'Customer Name',
                "rating" : 'Product Rating',
            },
            tableObjects : {
                paginationApply : true,
                searchApply     : true,
                deleteMethod    : 'delete',
                apiLink         : '/api/customerReview',
                editUrl         : '/add-product/'
            },
            startRange : 0,
            limitRange : 10
        };
        window.scrollTo(0, 0);
    }


    componentWillReceiveProps(nextProps) {
        
    }


    handleChange(event){
        const target = event.target;
        const name   = target.name;
        this.setState({
            [name]: event.target.value,
        });
    }


    componentDidMount() {
        this.getCount();
        this.getData(this.state.startRange, this.state.limitRange);

    }
    getCount(){
        axios.get('/api/customerReview/get/count')
        .then((response)=>{
            console.log('dataCount', response.data.dataCount);
            this.setState({
                dataCount : response.data.dataCount
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    getData(startRange, limitRange){
        var data = {
            startRange : startRange,
            limitRange : limitRange
        }
        this.getCount();
        axios.post('/api/customerReview/get/list', data)
        .then((response)=>{
            var tableData = response.data.map((a, i)=>{
              return{
                "_id"           : a._id,
                "product"       : a.productDetails[0] ? (a.productDetails[0].productName+" "+"("+a.productDetails[0].productCode)+")" : "",
                "customerReview": a.customerReview,
                "customerName"  : a.customerName,
                "orderID"       : a.orderID,
                "productID"     : a.productID,
                "rating"        : a.rating,
                "reviewlist"    : a.reviewlist,
                "status"        : a.status
              };
            })
            this.setState({
                tableData : tableData
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    getSearchText(searchText, startRange, limitRange){
        console.log('searchText', searchText);
        var formValues = {
            searchText : searchText, 
            startRange : startRange, 
            limitRange : limitRange
        };
        axios.post('/api/customerReview/search/post', formValues)
        .then((response)=>{
            var tableData = response.data.map((a, i)=>{
              return{
                "_id"           : a._id,
                "product"    : a.productDetails[0] ? (a.productDetails[0].productName+" "+"("+a.productDetails[0].productCode)+")" : "",
                "customerReview": a.customerReview,
                "customerName"  : a.customerName,
                "orderID"       : a.orderID,
                "productID"     : a.productID,
                "rating"        : a.rating,
                "reviewlist"    : a.reviewlist
              };
            })
            this.setState({
                tableData : tableData
            })
        })
        .catch((error)=>{
            console.log('error', error);
        })
    }
    render(){
        return(
            <div className="container-fluid">
                <div className="row">
                
                        <section className="content">
                            <div className="col-lg-12 col-md-12 col-xs-12 col-sm-12 pageContent">
                                <div className="row">
                                    <div className="box">
                                         <div className="box-header with-border col-lg-12 col-md-12 col-xs-12 col-sm-12 NOpadding-right">
                                              <h4 className="NOpadding-right"> Product Review</h4>
                                        </div>
                                        
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <div className="searchProductFromList  col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                            <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12 NOpadding">
{/*                                                <div className="publishAllProductsClient" aria-hidden="true" data-toggle="modal" data-target={"#publishProduct"}>
                                                    Publish All Products
                                                </div>
*/}                                                <div className="modal fade col-lg-12 col-md-12 col-sm-12 col-xs-12" id={"publishProduct"} role="dialog">
                                                    <div className=" adminModal adminModal-dialog col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                        <div className="modal-content adminModal-content col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-sm-10 col-sm-offset-1 col-xs-12 noPadding">
                                                            <div className="modal-header adminModal-header col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                <h4 className="WightFont textAlignCenter col-lg-11 col-md-11 col-sm-11 col-xs-11">Publish All Product</h4>
                                                                <div className="adminCloseCircleDiv pull-right  col-lg-1 col-md-1 col-sm-1 col-xs-12 NOpadding-left NOpadding-right">
                                                                    <button type="button" className="adminCloseButton" data-dismiss="modal" data-target={"publishProduct"}>&times;</button>
                                                                </div>
                                                            </div>
                                                            <div className="modal-body adminModal-body col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                <h4 className="blackLightFont textAlignCenter col-lg-12 col-md-12 col-sm-12 col-xs-12">Are you sure you want to publish all products?</h4>
                                                            </div>

                                                            <div className="modal-footer adminModal-footer col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
                                                                    <button type="button" className="btn adminCancel-btn col-lg-4 col-lg-offset-1 col-md-4 col-md-offset-1 col-sm-8 col-sm-offset-1 col-xs-10 col-xs-offset-1" data-dismiss="modal">CANCEL</button>
                                                                </div>
                                                                <div className="col-lg-6 col-md-6 col-sm-6 col-xs-12">
{/*                                                                    <button onClick={this.publishAllProducts.bind(this)} type="button" className="btn adminFinish-btn col-lg-4 col-lg-offset-7 col-md-4 col-md-offset-7 col-sm-8 col-sm-offset-3 col-xs-10 col-xs-offset-1" data-dismiss="modal">PUBLISH</button>
*/}                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12 col-md-12 col-sm-12 col-xs-12">
                                        <IAssureTable 
                                        tableHeading={this.state.tableHeading}
                                        twoLevelHeader={this.state.twoLevelHeader} 
                                        dataCount={this.state.dataCount}
                                        tableData={this.state.tableData}
                                        getData={this.getData.bind(this)}
                                        tableObjects={this.state.tableObjects}
                                        getSearchText = {this.getSearchText.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>


            );
        }
    }
export default Productreview ;

