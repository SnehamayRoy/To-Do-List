

const express =require("express");
const bodyparser = require("body-parser");
const mongoose =require("mongoose")
const date = require(__dirname + "/date.js");
const _=require("lodash");

const app= express();



app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todoDB");

const todoschema ={
    name:String,
}
const Item = mongoose.model("Item",todoschema)

const Item1=new Item({
    name:"Welcome to your Todolist", 
})
const Item2=new Item({
    name:"Hit the + button to add a new line", 
})
const defaultitems=[Item1,Item2];
 


 const listschema={
    name: String,
    items:[todoschema]
 };

 const List = mongoose.model("list",listschema)





app.get("/",function(req,res){

    
    // const day=date.getday();
    Item.find({},(err,founditems)=>{

        if(founditems.length===0){
            Item.insertMany(defaultitems,(err)=>{
                if(err){
                    console.log("err");
              
                }else{
                    console.log("Success saved DB");
                }
            })
            res.redirect("/");
        }else{
             res.render("list",{kindofday : "Today" , newitems :founditems});
        }
          
     } )
});

app.get("/:customListName", function(req, res){
    const customListName = _.capitalize(req.params.customListName);
    
  
    List.findOne({name: customListName}, function(err, foundList){
      if (!err){
        if (!foundList){
          //Create a new list
          const list = new List({
            name: customListName,
            items: defaultitems,
          });
          list.save();
          res.redirect("/" + customListName);
        } else {
          //Show an existing list
  
          res.render("list", {kindofday: foundList.name, newitems: foundList.items});
        }
      }
    });
    
  

  
   
})

app.post("/",(req,res)=>{

    

    const itemname= req.body.item;
    const listname=req.body.list;

    const item= new Item({
        name:itemname,
    })

    if(listname==="Today"){
      item.save();
    res.redirect("/")
    }else{
      List.findOne({name:listname},(err,found)=>{
        found.items.push(item);
        found.save();
        res.redirect("/"+listname);
      })
    }
     
})

app.post("/delete" ,(req,res)=>{
    const checkid =req.body.checkbox;
    const listname=req.body.listname;
    if(listname==="Today"){
      Item.findByIdAndDelete(checkid,(err)=>{
        if(!err){
            console.log("Successfull Deletion")
            res.redirect("/");
        }
    })
    }else{
       List.findOneAndUpdate({name:listname},{$pull:{items:{_id:checkid}}},(err,result)=>{
          if(!err){
            res.redirect("/"+listname);
          }
       })
    }
    
    
})




app.listen(3000,()=>{
    console.log("Server is runnig "); 
})