import React, { useContext } from 'react'
import './CartTotal.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';



const CartTotal = () => {
    const {getTotalCartAmount} = useContext(StoreContext)
    const navigate = useNavigate();

    //onClick={()=>navigate('/order')}


  return (
    <div className="cart-total">
          <h2>Cart Total</h2>
          <div>

            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
                <p> Delivery Fee </p>
                <p> ${getTotalCartAmount()===0?0:2} </p>        
            </div>
            <hr />
            <div className="cart-total-details">
              <p> Total </p>
              <p> ${getTotalCartAmount()===0?0:getTotalCartAmount()+2} </p>
            </div>
            <hr />
          </div>
          <button type='submit' onClick={()=>navigate('/order')} > PROCEED TO PAYMENT </button>
        </div>
  )
}

export default CartTotal