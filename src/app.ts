import express from 'express';
import * as bodyParser from 'body-parser';

class App {
  app: express.Application;
  port: string | number;

  constructor(controllers: any, port: string | number) {
    this.app = express();
    this.port = port;
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: []) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router);
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the PORT = ${this.port}`);
    });
  }
}

export default App;
