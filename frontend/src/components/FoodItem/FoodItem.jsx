import React, { useContext, useRef, useState, useEffect } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({id,name,price,description,image}) => {

    const{cartItems, addToCart, removeFromCart,url, getTotalCartQuantity} = useContext(StoreContext)

   // const documentDefined = typeof document !== 'undefined';
   // const originalTitle = React.useRef(documentDefined ? document.title : null);

    useEffect(() => {
       //if (!documentDefined) return;

       if (getTotalCartQuantity()!=0 )
        { document.title =` ${getTotalCartQuantity()} in cart `;}
       else{
        document.title = ` Food-Del `;
       }

       /*return () => {
        document.title = originalTitle.current;
      };*/
      },[addToCart, removeFromCart]);

  return (
    <div className='food-item'>
        <div className="food-item-image-container">
            <img className='food-item-image' src={url+"/images/"+image} alt="" />
            {!cartItems[id]
                    ?<img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt="" />
                    :<div className='food-item-counter'>
                        <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt='' />
                        <p> {cartItems[id]} </p>
                        <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt='' />
                    </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt="" />
            </div>
            <p className="food-item-desc">{description}</p>
            <p className="food-item-price"> ${price} </p>
        </div>

    </div>
  )
}

export default FoodItem