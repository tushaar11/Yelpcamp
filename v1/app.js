var  express        =require("express"),
     app            =express(),
     bodyParser     =require("body-parser"),
     mongoose       =require("mongoose"),
     passport       =require("passport"),
     methodOverride =require("method-override"),
     LocalStrategy  =require("passport-local"),
     User           =require("./models/user"),
     Campground     =require("./models/campground.js"),
     Comment        =require("./models/comment"),
     flash          =require("connect-flash"),
     seedDB         =require("./seeds");
     
var commentRoutes    =require("./routes/comments"),
    campgroundRoutes =require("./routes/campgrounds"),
    indexRoutes      =require("./routes/index");
    
mongoose.connect("mongodb+srv://tushaar11:<yelpcamp@123>@clusteryelpcamp-rwveg.mongodb.net/test?retryWrites=true");     

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname+"/public"));
app.use(flash());
// seedDB();
//passport configuration

app.use(require("express-session")({
    secret:"once again rusty",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser=req.user; 
   res.locals.error=req.flash("error");
   res.locals.success=req.flash("success");
   next();
});
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
    
app.listen(process.env.PORT,process.env.IP,function(){
    console.log("Yelpcamp has started");
});