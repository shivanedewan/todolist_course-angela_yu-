const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const _=require("lodash");
const date=require(__dirname+"/date.js");
// date module exported from date.js
const date1=date.getDay();   


//  adding database
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/todolistDB');
}

const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,"no name given"]
      }
  });

const items_model=mongoose.model("Item",itemsSchema);

const item1=new items_model({name:"welcome to your to do list"});
const item2=new items_model({name:"click on add button to add items"});
const item3=new items_model({name:"click on the checkbox to delete an item"});

const default_items=[item1,item2,item3];


const list_schema=new mongoose.Schema({
    name: String,
    // this will contain an array of item docs
    items: [itemsSchema]
});
const list_model=mongoose.model("List",list_schema);




app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// let items_array=["go to market"," buy food","cook food"];
// let work_items=[];

app.set('view engine', 'ejs');
app.get("/",function(req,res){

    

    items_model.find(function(err,items_array){
        if(items_array.length===0){
            // only insert the default items if collection is empty
            items_model.insertMany(default_items, function(error, docs) {
                if(error){
                    console.log("there seems to be an error");
                }
                else{
                    console.log(" default items added successfully");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list",{title:date1,items_array:items_array});
            }
        }
    );
    
});

// app.get("/work",function(req,res){
//     // first item is the name of variable that is passed to ejs
//     res.render("list",{title:"work list",items_array:work_items})
// })

app.get("/:path",function(req,res){
    custom_list_title=_.capitalize(req.params.path);
    // this list model has various names of lists that are created on the fly
    list_model.findOne({name:custom_list_title},function(err,found_list){
        if(!err){
            if(!found_list){
                const new_list=new list_model({name:custom_list_title,items:default_items});
                new_list.save()
                res.redirect("/"+custom_list_title);
            }
            else{
                res.render("list",{title:custom_list_title,items_array:found_list.items})
            }
        }
    })
    

})

app.get("/about",function(req,res){
    res.render("about");
});

app.post("/",function(req,res){
    const item_name=req.body.fnum;
    const list_title=req.body.submit;
    const new_item=new items_model({name:item_name});
    if (date1==list_title)
    {
        console.log("match");
        new_item.save();
        res.redirect("/");
    }
    else{
        list_model.findOne({name:list_title},function(err,found_list){
            found_list.items.push(new_item);
            found_list.save();
            res.redirect("/"+list_title);
    })};
    
    
    // if(req.body.submit==="work"){
    //     work_items.push(item);
    //     res.redirect("/work");
    // }
    // else{
    //     items_array.push(item);
    // res.redirect("/");
    // }

});

app.post("/delete",function(req,res){
    // gets name of item to be deleted
  const delete_item=req.body.checkbox;
  const listName=req.body.list_name;
  if(date1==listName){
    items_model.deleteOne({name:delete_item},function(err){
        if(err){
            console.log("error")
        }
        else{
            console.log("deleted successfully");
            res.redirect("/");
        }
    });
  }
  else{
    list_model.findOneAndUpdate({name:listName},{$pull:{items:{name:delete_item}}},function(err,found_list){
        res.redirect("/"+listName);
    })}
});

app.listen(3000,function(req,res){
    console.log("server running at 3000");
})