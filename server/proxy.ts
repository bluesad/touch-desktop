import http, { IncomingMessage, ServerResponse } from "http";
import url from "url";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("request");

http.createServer(onRequest).listen(4000);

function onRequest(req: IncomingMessage, res: ServerResponse) {
  const queryData = url.parse(req.url, true);
  console.log(queryData);
  if (req.url.includes("/api")) {
    req
      .pipe(request(`http://localhost:8000${req.url.replace(/\/api/gi, "")}`))
      .on("error", (e: Error) => {
        res.end(e);
      })
      .pipe(res);
  } else if (req.url.includes("/")) {
    req
      .pipe(request(`http://localhost:8000/hello-go${req.url}`))
      .on("error", (e: Error) => {
        res.end(e);
      })
      .pipe(res);
  } else {
    res.end("no url found");
  }
}
