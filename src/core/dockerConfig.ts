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

export const startContainers = async (containerIds: string[]): Promise<void> => {
    try {
      for (const containerId of containerIds) {
        const container = docker.getContainer(containerId);
        await container.start();
        console.log(`Container ${containerId} started`);
      }
    } catch (error) {
      console.error('Error starting containers: ', error);
    }
  };

  export const stopContainers = async (containerIds: string[]): Promise<void> => {
    try {
      for (const containerId of containerIds) {
        const container = docker.getContainer(containerId);
        await container.stop();
        console.log(`Container ${containerId} stopped`);
      }
    } catch (error) {
      console.error('Error stopping containers: ', error);
    }
  };

  export const listContainers = async (): Promise<void> => {
    try {
      const containers = await docker.listContainers({ all: true });
      containers.forEach((containerInfo:any) => {
        console.log(`Container ID: ${containerInfo.Id}, Status: ${containerInfo.Status}`);
      });
    } catch (error) {
      console.error('Error listing containers: ', error);
    }
  };
