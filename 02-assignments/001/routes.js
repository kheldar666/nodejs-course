
const requestHandler = (req,res) => {
    const url = req.url;
    const method = req.method;

    res.setHeader("Content-Type","text/html");

    if(url === '/') {
        res.write("<html>");
        res.write("<head>");
        res.write("<title>Home Page</title>");
        res.write("</head>");
        res.write("<body>");
        res.write('<h1>Welcome to our First App assignment</h1>');
        res.write('<form action="/create-user" method="POST"><span>User Name : </span><input type="text" name="username"/><button type="submit">Send</button></form>');
        res.write('<p><a href="/users">Go to our user List page</a></p>');
        res.write("</body>");
        res.write("<html>");
        return res.end();
    } else if(url === '/users') {
        res.write("<html>");
        res.write("<head>");
        res.write("<title>User List</title>");
        res.write("</head>");
        res.write("<body>");
        res.write('<ul>');
        res.write('<li>User 1</li>');
        res.write('<li>User 2</li>');
        res.write('<li>User 3</li>');
        res.write('<li>User 4</li>');
        res.write('<li>User 5</li>');
        res.write('</ul>');
        res.write('<p><a href="/">Back to Home Page</a></p>');
        res.write("</body>");
        res.write("<html>");
        return res.end();
    } else if(url === '/create-user' && method === 'POST') {
        const body = [];
        req.on('data', (chunck) => {
            body.push(chunck)
        });
        req.on('end',() => {
            const parsedBody = Buffer.concat(body).toString();
            const username = parsedBody.split('=')[1];
            console.log(username);
        });
        res.statusCode = 302 ;
        res.setHeader('Location','/');
        return res.end();
    }

    res.statusCode = 404;
    res.write("<html>");
    res.write("<head>");
    res.write("<title>Page Not Found</title>");
    res.write("</head>");
    res.write("<body>");
    res.write('<h1>Page Not Found</h1>');
    res.write('<p><a href="/">Back to Home Page</a></p>');
    res.write("</body>");
    res.write("<html>");

};

exports.routes = requestHandler;