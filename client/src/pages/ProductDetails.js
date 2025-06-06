import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/cart"
import "../styles/ProductDetailsStyle.css";
import { InfinitySpin } from 'react-loader-spinner';

const ProductDetails = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const [product, setProduct] = useState({});
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);


    //inital details
    useEffect(() => {
        if (params?.slug) getProduct();
    }, [params?.slug]);
    //getProduct
    const getProduct = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `/api/v1/product/single-product/${params.slug}`
            );
            setProduct(data?.products);
            getSimilarProduct(data?.products._id, data?.products.category._id);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };
    //get similar product
    const getSimilarProduct = async (pid, cid) => {
        try {
            setLoading(true);
            const { data } = await axios.get(
                `/api/v1/product/related-product/${pid}/${cid}`
            );
            setRelatedProducts(data?.products);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <Layout title="Loading...">
                <div className="loading-container">
                    <InfinitySpin width="200" color="#0d6efd" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="row container product-details ">
                <div className="col-md-6">
                    <img
                        src={`/api/v1/product/product-photo/${product._id}`}
                        className="card-img-top"
                        alt={product.name}
                        height="300"
                        width={"350px"}
                    />
                </div>
                <div className="col-md-6 product-details-info ">
                    <h1 className="text-center">Product Details</h1>
                    <hr />
                    <h6>Name : {product.name}</h6>
                    <h6>Description : {product.description}</h6>
                    <h6>
                        Price :
                        {product?.price?.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}
                    </h6>
                    <h6>Category : {product?.category?.name}</h6>
                    <button className="btn btn-secondary custom-btn mt-2" onClick={() => {
                        setCart([...cart, product]);
                        localStorage.setItem("cart", JSON.stringify([...cart, product]));
                        toast.success("Item Added to cart")
                    }}>ADD TO CART</button>
                </div>
            </div>
            <hr />
            <div className="row container similar-products">
                <h6>Similar Products</h6>
                {relatedProducts.length < 1 && (
                    <p className="text-center">No Similar Products found</p>
                )}
                <div className="d-flex flex-wrap">
                    {relatedProducts?.map((p) => (
                        <div className="card m-2" key={p._id}>
                            <img
                                src={`/api/v1/product/product-photo/${p?._id}`}
                                className="card-img-top"
                                alt={p.name}
                            />
                            <div className="card-body">
                                <div className="card-name-price">
                                    <h5 className="card-title">{p.name}</h5>
                                    <h5 className="card-title card-price">
                                        {p.price.toLocaleString("en-US", {
                                            style: "currency",
                                            currency: "USD",
                                        })}
                                    </h5>
                                </div>
                                <p className="card-text">
                                    {p.description.substring(0, 60)}...
                                </p>
                                <div className="card-name-price">
                                    <button
                                        className="pdt-btn btn-info ms-1"
                                        onClick={() => navigate(`/product/${p.slug}`)}
                                    >
                                        More Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default ProductDetails;