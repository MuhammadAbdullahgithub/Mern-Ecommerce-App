import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout/Layout';
import AdminMenu from '../../components/Layout/AdminMenu';
import toast from 'react-hot-toast';
import axios from 'axios';
import CategoryForm from '../../components/Form/CategoryForm';
import { Modal } from 'antd';

const CreateCategory = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categories, setCategory] = useState([]);
  const [name, setName] = useState('')
  const [visible, setVisible] = useState(false)
  const [selected, setSelected] = useState(null)
  const [updatedName, setUpdatedName] = useState('')
  const [deleteId, setDeleteId] = useState(null);


  //handle Form
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/v1/category/create-category', { name })
      if (data?.success) {
        toast.success(`${name} is created`)
        getAllCateory();
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form")
    }
  }


  //get all category
  const getAllCateory = async () => {
    try {
      const { data } = await axios.get('/api/v1/category/get-category')
      if (data?.success) {
        setCategory(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category")
    }
  }

  useEffect(() => {
    getAllCateory();
  }, [])

  //update category
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updatedName })
      if (data.success) {
        toast.success(`${updatedName} is updated`)
        setSelected(null)
        setUpdatedName('')
        setVisible(false)
        getAllCateory()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
    }
  };
  //delete category
  const handleDelete = async () => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${deleteId}`)
      if (data.success) {
        toast.success(`Category is deleted`)
        setIsModalVisible(false);
        setDeleteId(null);
        getAllCateory()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error("Something went wrong")
      setIsModalVisible(false);
    }
  };

  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3">
        <div className='row'>
          <div className='col-md-3'>
            <AdminMenu />
          </div>
          <div className='col-md-9'>
            <h1>Manage Category</h1>
            <div className='p-3 w-50'>
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className='w-75'>
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>

                  {categories?.map((c) => (
                    <tr key={c._id}>
                      <td>{c.name}</td>
                      <td>
                        <button className='btn btn-primary ms-2' onClick={() => {
                          setVisible(true);
                          setUpdatedName(c.name);
                          setSelected(c)
                        }}
                        >Edit</button>

                        <button
                          className='btn text-white bg-danger ms-2'
                          onClick={() => {
                            setDeleteId(c._id);
                            setIsModalVisible(true);
                          }}
                        >Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal onCancel={() => setVisible(false)} footer={null} open={visible}>
              < CategoryForm value={updatedName} setValue={setUpdatedName} handleSubmit={handleUpdate} />
            </Modal>
            <Modal
              title="Confirm Delete"
              open={isModalVisible}
              onOk={handleDelete}
              onCancel={() => {
                setIsModalVisible(false);
                setDeleteId(null);
              }}
              okText="Delete"
              okType="danger"
              cancelText="Cancel"
            >
              <p>Are you sure you want to delete this category?</p>
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CreateCategory;