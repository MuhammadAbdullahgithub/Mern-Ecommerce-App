import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from 'react-hot-toast';
import "../styles/CartStyles.css";

const CartPage = () => {
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const navigate = useNavigate();

  //total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD"
      })
    } catch (error) {
      console.log(error);
    }
  }

  //Delete Item
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem('cart', JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  //get payment gateway token
  const getToken = async () => {
    try {
      const { data } = await axios.get('/api/v1/product/braintree/token')
      setClientToken(data?.clientToken)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken()
  }, [auth?.token]);

  //handle payments
  const handlePayment = async () => {
    try {
      const { nonce } = await instance.requestPaymentMethod()
      const { data } = await axios.post('/api/v1/product/braintree/payment', {
        nonce,
        cart
      })
      setLoading(false)
      localStorage.removeItem('cart')
      setCart([])
      navigate('/dashboard/user/orders')
      toast.success("Payment Completed Successfully")
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="cart-header">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${auth?.token ? "" : "please login to checkout !"
                  }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>

        <div className="row">
          <div className="col-md-8">
            {cart?.map((p, index) => (
              <div key={`${p?._id}-${index}`} className="row mb-2 card p-3 flex-row">
                <div className="col-md-4">
                  <img
                    src={`/api/v1/product/product-photo/${p?._id}`}
                    className="card-img-top"
                    alt={p?.name}
                    width="100px"
                    height={"100px"}
                  />
                </div>


                <div className="col-md-8">
                  <p>{p?.name}</p>
                  <p>{p?.description?.substring(0, 30)}</p>
                  <p>Price : {p?.price}</p>
                  <button className="btn text-white bg-danger" style={{ width: "17%" }}
                    onClick={() => removeCartItem(p?._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center ">
            <h2>Cart Summary</h2>
            <p>Total | Checkout | Payment</p>
            <hr />
            <h4>Total : {totalPrice()} </h4>
            {auth?.user?.address ? (
              <>
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth?.user?.address}</h5>
                  <button className='cart-update-address'
                    onClick={() => navigate('/dashboard/user/profile')}
                  >Update Address</button>
                </div>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button className='cart-make-payment'
                    onClick={() => navigate('/dashboard/user/profile')}>Update Address</button>
                ) : (
                  <button className='cart-update-address'
                    onClick={() => navigate('/login', {
                      state: '/cart',
                    })}>Please Login to checkout</button>
                )}
              </div>
            )}
            <div className="mt-2">
              {
                !clientToken || !cart?.length ? ("") : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button className='cart-make-payment' onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}>
                      {loading ? "processing" : "Make Payment"}
                    </button>
                  </>
                )
              }
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CartPage;