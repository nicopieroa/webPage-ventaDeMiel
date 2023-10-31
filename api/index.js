const http = require("node:http");

const desirePort = process.env.PORT ?? 1234;

const processRequest = (req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Request processed, this is the Home page");
  }
};

const server = http.createServer(processRequest);

server.listen(desirePort, () => {
  console.log(`server listening on port http://localhost:${desirePort}`);
});
