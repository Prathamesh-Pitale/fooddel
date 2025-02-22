import React, { useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import { toast } from 'react-toastify';

const List = ({url}) => {

  //const url= "http://localhost:4000";

  const [list, setList]= useState([]);
  

  const fetchList = async () =>{
    const rersponse = await axios.get(`${url}/api/food/list`);
    console.log(rersponse.data);
    if(rersponse.data.success){
      setList(rersponse.data.data)
    }else{
      toast.error("Error");
    }
  }

  // const removeFood= async (foodId) =>{
  //   //console.log(foodId);
  //   const response = await axios.post(`${url}/api/food/remove`, {id: foodId});
  //   await fetchList();
  //   if(response.data.success){
  //     toast.success(response.data.message);

  //   }else{
  //     toast.error("Error");
  //   }
  // }

  const removeFood = async (foodId) => {
    console.log("Attempting to delete food with ID:", foodId);
  
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      console.log("Backend Response:", response.data);
  
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList(); // Refresh the list after deleting
      } else {
        toast.error("Error deleting food: " + response.data.message);
      }
    } catch (error) {
      console.error("Error removing food:", error);
      toast.error("Failed to remove food. Check console for details.");
    }
  };
  

  useEffect(() => {
    fetchList()
  },[])

  return (
    <div className='list add flex-col'>
      <p> All Foods List </p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <p>Name</p>
          <p>Category</p>
          <p>Price</p>
          <p>Action</p>
        </div>
        {list.map((item,index)=>{
          return(
            <div key={index} className='list-table-format'>
              {/* <img src={`${url}/images/`+item.image} alt='' /> */}
              <img src={item.image} alt='' />

              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p onClick={()=>{removeFood(item._id)}} className='cursor'>X</p>
            </div>

          )
        })}
      </div>

    </div>
  )
}

export default List