const express = require("express");
const http = require("http");
const https = require('https');
const socketIo = require("socket.io");

const port = process.env.PORT || 4011;

const app = express();

const server = http.createServer(app);

const io = socketIo(server);

let interval;

io.on("connection", (socket) => {
  //if (interval) {
   // clearInterval(interval);
 // }
  interval = setInterval(() => getApiAndEmit12(socket), 1000);

 // socket.on("disconnect", () => {
   // console.log("Client disconnected");
  //  clearInterval(interval);
 // });
});



 const getApiAndEmit12= async socket => {
  const response = new Date();

var axios = require('axios');

	var config = {
	  method: 'get',
	  url: 'http://172.105.49.149:8000/lordsexch/worli2/',
	  headers: { 
		'Cookie': 'XSRF-TOKEN=eyJpdiI6IjU2YURwNmxneEVwSVZhcmttcTFSRGc9PSIsInZhbHVlIjoicXQzZUxpaHFXU1pmMlJkSFNjQkU5ajBmVnlhcHZUTTFXM2QwNkpNRzVBYVBkdjMrWGZ4czc1S3ZSNHYyZ1lNcSIsIm1hYyI6Ijc3YjgwOTUzZjVmYzU4NjliMzM4YWE5M2VlZTAyMGJlMzlhN2EyZjQ3ZTVhMGVmMzI4ZmUwZjg0ZTVjZmE1MTYifQ%3D%3D; laravel_session=eyJpdiI6IjBoUTRkVzUwbFBjZVBlOHpkUTlMK3c9PSIsInZhbHVlIjoicll5OXFQOWhzUzVtNTJ0V21rd09DUTFcL3ljQkVGdW5mbVVBWVwvMjdBUHlXQ2NjcVVWTlJPcGZVWktONEdjUmdyIiwibWFjIjoiMTNmMDdjNTQ4MDljODJjOWE3YjJkMmRhNWE1YjhhYzA3ODdkZTlhNGQxOTE3MGUxYzM4MWQ1NmRjOTM5ZjVjNSJ9'
	  },
	  httpsAgent: new https.Agent({
			rejectUnauthorized: false
		}),
	};

	var getData = await  axios(config);
	
		socket.emit("FromAPI11",{data:getData.data.data,data1:getData.data.result});
	
  
  
  
  








  
  // Emitting a new message. Will be consumed by the client
 
};

server.listen(port, () => console.log(`Listening on port ${port}`));