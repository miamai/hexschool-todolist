const errorHandle = (res, msg) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, PATH, GET, OPTIONS, DELETE",
    "Access-Control-Allow-Headers":
      "Content-Type, X-Requested-With, Authorization, Content-Length",
    "Content-Type": "application/json",
  };

  res.writeHead(400, headers);
  res.write(
    JSON.stringify({
      status: "false",
      message: msg ? msg : "Encounter error when handling request.",
    })
  );
  res.end();
};

export default errorHandle;
