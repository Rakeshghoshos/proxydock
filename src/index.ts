    import express ,{Request ,Response  } from "express";
    import http from "http";
    import cors from "cors";
    import router from "./conrtollers/managmentRoutes";
    import { docker } from "./core/dockerConfig";
    import httpProxy from 'http-proxy';
    import path from "path";

    global.containerList = new Map();

    
    //docker event to listen containers event
    docker.getEvents((err:any,streams:any) => {
        if(err){
            console.log(err);
            return;
        }

        streams.on('data',async (stream:any)=>{
            if(!stream) return;

            const event = JSON.parse(stream.toString());

            if(event.Type == 'container' && event.Action == 'start'){
                const container = docker.getContainer(event.id);
                const containerDetails = await container.inspect();

                const containerName = containerDetails.Name.substring(1);
                const containerAddress = containerDetails.NetworkSettings.IPAddress;
                const exposedPorts = Object.keys(containerDetails.Config.ExposedPorts);
                let defaultPort = null;
                if(exposedPorts && exposedPorts.length > 0){
                    const [port ,type] = exposedPorts[0].split("/");
                    if(type == 'tcp'){
                        defaultPort = port;
                    }
                }

                console.log(`${containerName}.localhost ---->  http://${containerAddress}:${defaultPort}`);
                global.containerList.set(containerName , {containerName,containerAddress ,defaultPort});
            }

            if(event.Type == 'container' && event.Action == 'start'){
                const container = docker.getContainer(event.id);
                const containerDetails = await container.inspect();

                const containerName = containerDetails.Name.substring(1);
                const containerAddress = containerDetails.NetworkSettings.IPAddress;
                const exposedPorts = Object.keys(containerDetails.Config.ExposedPorts);
                let defaultPort = null;
                if(exposedPorts && exposedPorts.length > 0){
                    const [port ,type] = exposedPorts[0].split("/");
                    if(type == 'tcp'){
                        defaultPort = port;
                    }
                }

                console.log(`${containerName}.localhost ---->  http://${containerAddress}:${defaultPort}`);
                global.containerList.set(containerName , {containerName,containerAddress ,defaultPort});
            }
        })
    })

    //management server for docker
    const managementServer = express();

    managementServer.use(express.json({ limit: '100mb' }));
    managementServer.use(express.urlencoded({ extended: false }));
    managementServer.use(cors());

     //frontend
     managementServer.set('view engine', 'ejs');
     managementServer.set('views', path.join(__dirname, 'views'));
     managementServer.use(express.static(path.join(__dirname, 'public')));
     
     managementServer.get('/', (req: Request, res: Response) => {
         res.render('index', { title: 'proxydock' }); // Render index.ejs
     });
     
    managementServer.use("/api",router);

   

    //proxy server
    const proxy = httpProxy.createProxyServer({});
    const proxyServerApp = express();

    proxyServerApp.use("/", (req: Request, res: Response): any => {
        const hostName = req.hostname;
        const subDomain = hostName.split(".")[0];

        // Check if the subdomain exists in the list
        if (!global.containerList.has(subDomain)) {
            return res.status(404).json({ "message": "no container found" }).end(404);
        }

        // Get the container address and port from the list
        const { containerAddress, defaultPort } = global.containerList.get(subDomain)!;

        // Construct the target URL
        const target = `http://${containerAddress}:${defaultPort}`;

        console.log(`Forwarding ${hostName} to ${target}`);

        // Forward the request to the target
        proxy.web(req, res, { target, changeOrigin: true }, (error:any) => {
            if (error) {
                console.error('Proxy error:', error);
                res.status(500).json({ message: 'Proxy error occurred' });
            }
        });
    });

    const proxyServer = http.createServer(proxyServerApp);

    managementServer.listen(8080,()=>{
        console.log("management server is running on port : 8080");
    });

    proxyServer.listen(80, ()=>{
        console.log("proxy server running at port : 80");
    });