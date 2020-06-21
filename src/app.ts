import cors from 'cors';
import express, { Application } from 'express';
import mongoose from 'mongoose';
import 'reflect-metadata';
import config from './config';
import DIContainer from './di-container';
import { IndexRoutes } from './routes/index.route';
import { UserRoutes } from './routes/user.route';
import { MovieRoutes } from './routes/movie.route';

export class App {
  private app: Application;

  constructor() {
    this.app = express();
  }

  public async create() {
    this.configureMiddleWares();
    this.configureRoutes();
    await this.connectToDatabase();
    return this.app;
  }

  private configureMiddleWares() {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private configureRoutes() {
    const indexRoutes = DIContainer.resolve<IndexRoutes>(IndexRoutes);    
    const userRoutes = DIContainer.resolve<UserRoutes>(UserRoutes);
    const movieRoutes = DIContainer.resolve<MovieRoutes>(MovieRoutes);

    this.app.use(indexRoutes.getRoutes());    
    this.app.use(userRoutes.getRoutes());
    this.app.use(movieRoutes.getRoutes());
  }

  private async connectToDatabase() {
    return mongoose.connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }

  public start(port: number) {
    this.app.listen(port, () => {
      console.log(`listen on port ${3000}`);
    });
  }
}
