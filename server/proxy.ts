import http, { IncomingMessage, ServerResponse } from "http";
import url from "url";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("request");

http.createServer(onRequest).listen(process.env.SRVR_PORT || 4000);

function onRequest(req: IncomingMessage, res: ServerResponse) {
  const queryData = url.parse(req.url, true);
  console.log(queryData);
  if (req.url.includes("/api")) {
    req
      .pipe(request(`${process.env.AGENCY_URL}${req.url}`))
      .on("error", (e: Error) => {
        res.end(e);
      })
      .pipe(res);
  } else if (req.url.includes("/")) {
    req
      .pipe(request(`${process.env.AGENCY_URL}/touch${req.url}`))
      .on("error", (e: Error) => {
        res.end(e);
      })
      .pipe(res);
  } else {
    res.end("no url found");
  }
}
