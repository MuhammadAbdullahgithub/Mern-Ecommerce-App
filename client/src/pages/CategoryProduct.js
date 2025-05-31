import React, { useState, useEffect } from 'react'
import Layout from "../components/Layout/Layout"
import axios from "axios"
import { useParams, useNavigate } from "react-router-dom"
import { useCart } from "../context/cart"
import "../styles/CategoryProductStyles.css";
import { InfinitySpin } from 'react-loader-spinner';
import { Pagination } from 'antd';
import toast from 'react-hot-toast'

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 6;

  //Get Product By Category
  const getProductByCat = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-category/${params?.slug}?page=${page}`);
      setProducts(data?.products);
      setCategory(data?.category);
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params?.slug)
      setPage(1);
    getProductByCat();
  }, [params?.slug]);

  useEffect(() => {
    getProductByCat();
  }, [page]);

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
    <Layout title={"Category Product"}>
      <div className="container mt-3">
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">{total} results found</h6>
        <div className="row">
          <div className="col-md-9 offset-1">
            <div className="category d-flex">
              {products?.map((p) => (
                <div className="card m-2" key={p._id}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <hr className="my-2" />
                  <div className="card-body">
                    <h5 className="card-title">{p?.name}</h5>
                    <p className="card-text">
                      {p?.description.substring(0, 30)}...
                    </p>
                    <p className="card-price">$ {p?.price}</p>
                    <div className="d-flex justify-content-between">
                      <button className="btn btn-primary custom-btn"
                        onClick={() => navigate(`/product/${p.slug}`)}
                      >More Details</button>
                      <button className="btn btn-secondary custom-btn" onClick={() => {
                        setCart([...cart, p]);
                        localStorage.setItem("cart", JSON.stringify([...cart, p]));
                        toast.success("Item Added to cart")
                      }}>ADD TO CART</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > pageSize && (
              <div className="d-flex justify-content-center mt-4 mb-5">
                <Pagination
                  current={page}
                  total={total}
                  pageSize={pageSize}
                  onChange={(value) => setPage(value)}
                  showSizeChanger={false}
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CategoryProduct;


