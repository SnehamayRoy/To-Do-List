const express =require("express");
const bodyparser = require("body-parser");
const date = require(__dirname + "/date.js");

const app= express();

const items= ["Coding"];
const workitems =[];

app.set('view engine', 'ejs');

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"))


app.get("/",(req,res)=>{
    
    // let current =today.getDay();
    // let day=" ";

    // switch (current) {
    //     case 0:
    //         day="Sunday" 
    //         break;
    //     case 1:
    //         day="Monday"
    //         break;
    //     case 2:
    //         day="Tuesday" 
    //         break;
    //     case 3:
    //         day="Wednesday" 
    //         break;
    //     case 4:
    //         day="Thusday" 
    //         break;
    //     case 5:
    //         day="Friday" 
    //         break;
    //     case 6:
    //         day="Saturday" 
    //         break;   
 
    //     default:
    //         console.log("Eror")
    //         break;
    // }
    const day=date.getday();
    

     res.render("list",{kindofday : day , newitems :items});   
});


app.post("/",(req,res)=>{

    console.log(req.body)

    let item = req.body.item;

    if(req.body.list==="Work"){
        workitems.push(item);
        res.redirect("/work");
    }else{
        items.push(item);
        res.redirect("/");
    }
    
    
  
})

app.get("/work",(req,res)=>{
    res.render("list",{kindofday : "Work Lists" , newitems :workitems}); 

})
// app.post("/work",(req,res)=>{
//     let item = req.body.item;
//    workitems.push(item);
//    res.redirect("/work");
// })


app.listen(3000,()=>{
    console.log("Server is runnig "); 
})