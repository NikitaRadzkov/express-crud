import express from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';

class App {
  app: express.Application;
  port: string | number;

  constructor(controllers: any, port: string | number) {
    this.app = express();
    this.port = port;
    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.app.use(express.json());
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the PORT = ${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeControllers(controllers: []) {
    controllers.forEach((controller: any) => {
      this.app.use('/', controller.router);
    });
  }

  private connectToTheDatabase() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    mongoose.connect(process.env.MONGO_DB!);
  }
}

export default App;
