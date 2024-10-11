// declare namespace NodeJS {
//   interface Global {
//     containerList: string;
//   }
// }


declare global {
  var containerList: Map<any,any>;
}

// Ensure this is treated as a module
export {};
