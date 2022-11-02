
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandle =require('./errorHandle');
const todos = [
    {
        "title": "今天要買菜",
        "id": uuidv4()
    },
    {
        "title": "今天吃大餐",
        "id": uuidv4()
    }
];

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
    

    console.log(req.url);
    console.log(req.method);
    if(req.url == "/" && req.method == 'GET'){
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    }else if(req.url == "/todos" && req.method == 'POST'){
        req.on('end', ()=>{
            try{
                console.log(JSON.parse(body));
                const title = JSON.parse(body).title;
                console.log(title);
                if(title !== undefined){
                    const todo = {
                        "title": title,
                        "id": uuidv4()
                    }
                    todos.push(todo);
                    console.log(todo);
                    res.writeHead(200, headers);
                    res.write(JSON.stringify({
                        "status": "success",
                        "data": todos
                    }));
                    res.end();
                }else{
                    errHandle(res);
                }
                
            }catch(error){
                errHandle(res);
            }
            
        })
    
    }else if(req.url == "/todos" && req.method == 'DELETE'){
        todos.length = 0;
        res.writeHead(200, headers);
        res.write(JSON.stringify({
            "status": "success",
            "data": todos
        }));
        res.end();
    }else if(req.url.startsWith("/todos/") && req.method=="DELETE"){
        const id = req.url.split('/').pop();
        const index = todos.findIndex(element => element.id == id);
        if(index !== -1){
            todos.splice(index, 1); // 存在此資料，才將該筆資料刪除
            res.writeHead(200, headers);
            res.write(JSON.stringify({
                "status": "success",
                "data": todos
            }));
            res.end();
        }else{
            errHandle(res);
        }
        
        
    }else if(req.url.startsWith("/todos/") && req.method=="PATCH"){
        req.on('end', ()=>{
            try{
                const todo = JSON.parse(body).title;
                const id = req.url.split('/').pop();
                const index = todos.findIndex(element => element.id == id);
                if(todo !== undefined && index !== -1){
                    todos[index].title = todo;
                    res.writeHead(200, headers); // 寫入表頭
                    res.write(JSON.stringify({ // 寫入成功資料
                        "status": "success",
                        "data": todos
                    }));
                    res.end(); // 回傳資料
                }else{
                    errHandle(res);
                }
            }catch{
                errHandle(res);
            }
        })
    }
    else if(req.method == 'OPTIONS'){
        res.writeHead(200, headers);
        res.end();
    }else{
        res.writeHead(404, headers);
        res.write(JSON.stringify({
            "status": "false",
            "message": "no data found"
        }));
        res.end();
    }

}
const server = http.createServer(requestListener);
server.listen(3005);