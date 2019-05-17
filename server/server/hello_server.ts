import * as http from 'http'

const server=http.createServer(function (request,response) { response.end('Hello World!,leo\n'); }).listen(8888);