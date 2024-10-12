import Dockerode from "dockerode";
import os from 'os';

let dockerConfig: Dockerode.DockerOptions;


if (os.platform() === 'win32') {
    dockerConfig = {
        socketPath: 'npipe:////./pipe/docker_engine'
    };
} else {
    dockerConfig = {
        socketPath: '/var/run/docker.sock'
    };
}

export const docker = new Dockerode(dockerConfig);


docker.info((err:any, info:any) => {
    if (err) {
        console.error('Error connecting to Docker:', err);
    } else {
        console.log('Docker info:', info);
    }
});

export const startContainers = async (containerIds: string[]): Promise<any> => {
    try {
      for (const containerId of containerIds) {
        const container = docker.getContainer(containerId);
        await container.start();
        console.log(`Container ${containerId} started`);
        return 1;
      }
    } catch (error) {
      console.error('Error starting containers: ', error);
      return 0;
    }
  };

  export const stopContainers = async (containerIds: string[]): Promise<any> => {
    try {
      for (const containerId of containerIds) {
        const container = docker.getContainer(containerId);
        await container.stop();
        console.log(`Container ${containerId} stopped`);
        return 1;
      }
    } catch (error) {
      console.error('Error stopping containers: ', error);
      return;
    }
  };

  export const listContainers = async (): Promise<any> => {
    try {
      const containers = await docker.listContainers({ all: true });
      return containers;
    } catch (error) {
      console.error('Error listing containers: ', error);
      return null;
    }
  };

  export const listImages = async():Promise<any> =>{
    try{
      const images = await docker.listImages({all : true});
      return images;
    }catch (error) {
      console.error('Error listing containers: ', error);
      return null;
    }
  }
