
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle =require('./errorHandle');
const data = [];

const requestListener = (req, res) => {
    const headers = {
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
        'Content-Type': 'application/json'
    };
    let body = "";
    req.on('data', chunk=>{
        body += chunk;
    });
    

    //console.log(req.url);
    //console.log(req.method); 
    if(req.url == "/query" && req.method == 'GET'){
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": data
        }));
        res.end();
    }else if(req.url == "/query" && req.method == 'POST'){
        req.on('end', ()=>{
            try{
                const deviceType = JSON.parse(body).deviceType;
                const os = JSON.parse(body).os;
                const osVersion = JSON.parse(body).osVersion;
                const browser = JSON.parse(body).browser;
                const browserVersion = JSON.parse(body).browserVersion;
                const browserVendor = JSON.parse(body).browserVendor;
                const isFromIphone = JSON.parse(body).isFromIphone;
                const isFromIpad = JSON.parse(body).isFromIpad;
                const isFromIpod = JSON.parse(body).isFromIpod;
                const isFromIos = JSON.parse(body).isFromIos;
                const isFromAndroidMobile = JSON.parse(body).isFromAndroidMobile;
                const isFromAndroidTablet = JSON.parse(body).isFromAndroidTablet;
                const isFromAndroidOs = JSON.parse(body).isFromAndroidOs;
                const timeStamp = JSON.parse(body).timeStamp;
                if(deviceType !== undefined){
                    const container = {
                        "id": uuidv4(),
                        "deviceType": deviceType,
                        "os": os,
                        "osVersion": osVersion,
                        "browser": browser,
                        "browserVersion": browserVersion,
                        "browserVendor": browserVendor,
                        "isFromIphone": isFromIphone,
                        "isFromIpad": isFromIpad,
                        "isFromIpod": isFromIpod,
                        "isFromIos": isFromIos,
                        "isFromAndroidMobile": isFromAndroidMobile,
                        "isFromAndroidTablet": isFromAndroidTablet,
                        "isFromAndroidOs": isFromAndroidOs,
                        "timeStamp": timeStamp
                    }
                    data.push(container);
                    //console.log("container=>" + container);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": data
                    }));
                    res.end();
                }else{
                    errHandle(res);
                }
                
            }catch(error){
                errHandle(res);
            }
            
        })
    
    }else if(req.url.startsWith("/data/") && req.method=="DELETE"){
        const id = req.url.split('/').pop();
        const index = data.findIndex(element => element.id == id);
        if(index !== -1){
            data.splice(index, 1); // 存在此資料，才將該筆資料刪除
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": data
            }));
            res.end();
        }else{
            errHandle(res);
        }
    }else if(req.method == 'OPTIONS'){
        res.writeHead(200, headers);
        res.end();
    }else{
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "查無此網站路由"
        }));
        res.end();
    }

}
const server = http.createServer(requestListener);
server.listen(process.env.PORT || 8080);