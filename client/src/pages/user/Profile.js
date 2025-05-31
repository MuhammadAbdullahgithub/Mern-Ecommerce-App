import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from "../../context/auth"
import axios from 'axios'
import toast from 'react-hot-toast'


const Profile = () => {
  //context
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  //get user data
  useEffect(() => {
    const { name, email, phone, address } = auth?.user
    setName(name)
    setEmail(email)
    setPhone(phone)
    setAddress(address)
  }, [auth?.user])


  // Form submission function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Sending a POST request to register the user
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls)
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile updated Successfully")
      }

    } catch (error) {
      // Log error and show generic error message
      console.log(error);
      toast.error('Something went wrong', { duration: 8000 });
    }
  };



  return (
    <Layout title={'Your Profile'}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="container-form">
              <form onSubmit={handleSubmit}>
                <h1 className="title">USER PROFILE</h1>

                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Name"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Email"
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Password"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Phone"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Address"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile