import os from 'os'; 
import cluster from 'cluster'; 

// Here we will manage the process so it creates copies if one ends


// Create the copies of tha application and redirect to the worker
const runPrimaryProcess = async () => {
    const processCount = os.cpus().length * 2
    console.log(`Primary ${process.pid} is running`); 
    console.log(`Forking Server with ${processCount} processes \n`)

    for(let i = 0; i < processCount; i++){
        cluster.fork()
    }

    // if any of the workers fail then we generate a new one
    cluster.on('exit', (worker, code, signal)=> {
        // a code !== 0 means that the server stopped due to an error
        if(code !== 0 && !worker.exitedAfterDisconnect){
            console.log(`Worker ${worker.process.pid} died... scheduling another one!`); 
            cluster.fork();
        }
    })
}

// Child of the process who will execute the code
const runWorkerProcess = async () => {
    await import('./server.js'); 
}

// primary process is Who manages the load for requests. The worker is who perform the work for the request
cluster.isPrimary ? runPrimaryProcess() : runWorkerProcess(); 