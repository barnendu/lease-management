const  fs = require('fs'),
    cp = require('child_process'),
    path =require('path'),
    numCPUs = require('os').cpus().length,
    cluster = require('cluster'),
    express = require("express"),
    bodyParser = require('body-parser'),
    web3 = require('web3'),
    cors = require('cors'),
    mongoose =require("mongoose"),
    app =express();

   
    //==============connection to mongoDb database ====//
 process.env.SECRET_KEY ="hey this barnendu";
 mongoose.Promise = global.Promise
 mongoose.connect('mongodb://localhost:27017/lease-management',function(err){
      if(err)
        console.log('There is a connection error.')
        else
        console.log('connection successful.');
      
    });
    
//clustering the application
// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
   
   
//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//     cluster.fork()
//   });
// } else {
 
app.use(express.static(path.join(__dirname ,'public')))
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(cors());
 require("./server/route.js")(app);

  // Now creating HTTP server
  app.listen(3000,() => {
   console.log(`Worker ${process.pid} started`);
  });

//}