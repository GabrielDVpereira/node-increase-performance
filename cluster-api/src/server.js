import http from 'http'; 

const processId = process.pid; 

const server = http.createServer((request, response) => {
    // simulate a frozen process
    for(let i; i < 1e7; i++); 
    response.end(`handled by pid ${processId}`)
})


server.listen(3000).once('listening', () => {
    console.log('server started in process', processId); 
}); 


// wait connections to end so we can finish the system
process.on('SIGTERM', () => {
    // If a terminate request was performed to kill the server process, we close the server
    console.log('server endig', new Date().toISOString()); 
    server.close(() => process.exit());
})


// Let's create a error so we can make node create a new process again
const randomTime = Math.random() * 1e4 // up to 10s 
setTimeout(() => {
   process.exit(1) // Breaks the aplication
}, randomTime)