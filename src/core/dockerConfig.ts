import Dockerode from "dockerode";

export const docker = new Dockerode({
    socketPath: '/var/run/docker.sock'
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
      containers.forEach((containerInfo) => {
        console.log(`Container ID: ${containerInfo.Id}, Status: ${containerInfo.Status}`);
      });
    } catch (error) {
      console.error('Error listing containers: ', error);
    }
  };
