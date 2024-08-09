import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order from frontend
const placeCardOrder= async(req , res) =>{

    const frontend_url = "https://food-del-frontend-k6yk.onrender.com";
    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address,
            
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});

        const line_item = req.body.items.map((item)=>({
            price_data:{
                currency:"USD",
                product_data:{
                    name: item.name,
                },
                unit_amount: item.price*100
            },
            quantity: item.quantity
        }))

        line_item.push({
            price_data:{
                currency:"USD",
                product_data:{
                    name:"delivery charges",
                },
                unit_amount:2*100,
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_item,
            mode:'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })

        res.json({success:true, session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:"error"})    
    }
}

//cod
const placeCodOrder= async(req , res) =>{

    const frontend_url = "https://food-del-frontend-k6yk.onrender.com";
    //const frontend_url = "http://localhost:5173/";
    try {
        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address,
            
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId,{cartData:{}});
        console.log("userId: " + req.body.userId)
        
        const id= newOrder._id;
        console.log("order:"+id);
        
        await orderModel.findByIdAndUpdate(id,{payment:true});
        
        res.json({success:true, session_url:"http://localhost:5173/myorders"});
  
       
    } catch (error) {
        console.log("im here sad");    
        console.log(error);
        res.json({success:false, message:"error"})    
    }
}




const verifyOrder = async ( req, res ) => {
    const {orderId, success} = req.body;
    console.log("im in verify");
    
    try {
        if(success=="true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            res.json({success:true, message:"Paid"})
            console.log("verord pass");

        }
        else{
            await orderModel.findByIdAndDelete(orderId);
            res.json({success:false, message:"Not Paid"})
            console.log("verord err");

        }
    } catch (error) {
        console.log(error);
        console.log("verord err");
        
        res.json({success:false, message:"Error"})
    }
}

// user orders for frontend
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true, data:orders}); 
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//listing orders for admin panel
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});   
        res.json({success:true , data:orders});
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

//api for updating order sttus
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
        res.json({success:true, message:"Status updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"});
    }

}



export {placeCardOrder, placeCodOrder, verifyOrder, userOrders, listOrders, updateStatus}
