import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner';
import { Pagination } from 'antd';
import '../../styles/CategoryProductStyles.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Get All products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
      toast.error("Something Went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Get total count of products
  const getTotal = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/product-count');
      setTotal(data?.total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getTotal();
  }, []);

  useEffect(() => {
    getAllProducts();
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
    <Layout>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>
          <div className="row">
            {products?.map((p) => (
              <Link
                key={p?._id}
                to={`/dashboard/admin/product/${p?.slug}`}
                className="product-link col-md-4 mb-4"
              >
                <div className="card m-2" style={{ width: '18rem' }}>
                  <img
                    src={`/api/v1/product/product-photo/${p?._id}`}
                    className="card-img-top"
                    alt={p?.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p?.name}</h5>
                    <p className="card-text">{p?.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="d-flex justify-content-center mt-4 mb-5">
            <Pagination
              current={page}
              total={total}
              pageSize={pageSize}
              onChange={(value) => setPage(value)}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
