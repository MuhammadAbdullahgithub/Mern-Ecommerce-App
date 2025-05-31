import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout'
import AdminMenu from '../../components/Layout/AdminMenu'
import toast from 'react-hot-toast';
import axios from 'axios';
import { Select, Modal } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { InfinitySpin } from 'react-loader-spinner';
const { Option } = Select;

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState("");
  const [id, setId] = useState("");
  const [loading, setLoading] = useState(true);


  //get single product 
  const getSingleProduct = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/v1/product/single-product/${params.slug}`
      );
      setName(data?.products?.name);
      setId(data?.products?._id);
      setDescription(data?.products?.description);
      setPrice(data?.products?.price);
      setQuantity(data?.products?.quantity);
      setShipping(data?.products?.shipping);
      setCategory(data?.products?.category?._id);
    } catch (error) {
      console.log(error);

    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (params.slug) {
      getSingleProduct();
    }
  }, [params.slug]);


  //get all category
  const getAllCateory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category')
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category")
    }
  }

  useEffect(() => {
    getAllCateory();
  }, [])

  //create product function
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);
      productData.append("category", category);
      const { data } = axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );
      if (data?.success) {
        toast.error(data?.message);
      } else {
        toast.success("Product updated Successfully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  //delete a product
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Product Deleted Successfully");
      setIsModalVisible(false);
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
      setIsModalVisible(false);
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
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3">
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Update Product</h1>
            <div className="m1 w-75">
              <Select variant={false}
                placeholder='Select a category'
                size='large'
                showSearch
                className='form-select mb-3'
                onChange={(value) => { setCategory(value) }}
                value={category}
              >

                {categories?.map(c => (
                  <Option key={c?._id} value={c?._id}>
                    {c?.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <label className="btn btn-outline-secondary d-block w-100 ">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              <div className="m-3">
                {photo ? (
                  <div className="text-center">
                    <img src={URL.createObjectURL(photo)}
                      alt="product_photo"
                      height={"200"}
                      className='img img-responsive'
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`/api/v1/product/product-photo/${id}`}
                      alt="product_photo"
                      height={"200"}
                      className='img img-responsive'
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input type="text"
                  value={name}
                  placeholder='write a name'
                  className='form-control'
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <Select
                  variant={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                  value={shipping ? "yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className='btn btn-primary'
                  onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className='btn text-white bg-danger'
                  onClick={() => setIsModalVisible(true)}
                >
                  DELETE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Confirm Delete"
        open={isModalVisible}
        onOk={handleDelete}
        onCancel={() => setIsModalVisible(false)}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete this product?</p>
      </Modal>
    </Layout>
  )
}

export default UpdateProduct