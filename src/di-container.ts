import { Container } from 'inversify';
import { IndexController } from './controllers/index.controller';
import { IndexRoutes } from './routes/index.route';

const DIContainer = new Container();

DIContainer.bind<IndexRoutes>(IndexRoutes).toSelf();
DIContainer.bind<IndexController>(IndexController).toSelf();


export default DIContainer;