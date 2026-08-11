import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "Harmoniq API",
    description: "API for managing user profiles, authors, and their publications.",
  },
  servers: [{ url: "/" }, { url: "http://localhost:3000" }],
};

const outputFile = "./swagger.json";
const routes = ["./server.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({ openapi: "3.0.0" })(outputFile, routes, doc);
