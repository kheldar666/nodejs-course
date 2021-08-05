const fs =  require('fs');

const requestHandler = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === '/message' && method ==='POST') {
        const body = [];
        req.on('data', (chunck) => {
            body.push(chunck)
        });
        req.on('end',() => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split('=')[1];
            fs.appendFile('messages.txt',message +'\n', err => {
                res.statusCode = 302 ;
                res.setHeader('Location','/');
                res.end();
            });
        });
    } else {
        res.setHeader("Content-Type","text/html");
        res.write("<html>");
        res.write("<head>");
        res.write("<title>Home Page</title>");
        res.write("</head>");
        res.write("<body>");
        res.write('<form action="/message" method="POST"><span>Input your message : </span><input type="text" name="message"/><button type="submit">Send</button></form>');
        res.write("</body>");
        res.write("<html>");
        res.end();
    }
};

// module.exports = {
//     handler:requestHandler,
//     someText: "Some important information"
// };

exports.handler = requestHandler;
exports.sometext = "Some important information";