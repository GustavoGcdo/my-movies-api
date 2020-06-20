import { Container } from 'inversify';
import { IndexController } from './controllers/index.controller';
import { UsersController } from './controllers/users.controller';
import { SignUpHandler } from './handler/user/signUp.handler';
import { UserRepository } from './repositories/user.repository';
import { IndexRoutes } from './routes/index.route';
import { UserRoutes } from './routes/user.route';
import Types from './types/user.types';

const DIContainer = new Container();

DIContainer.bind<IndexRoutes>(IndexRoutes).toSelf();
DIContainer.bind<UserRoutes>(UserRoutes).toSelf();

DIContainer.bind<IndexController>(IndexController).toSelf();
DIContainer.bind<UsersController>(UsersController).toSelf();

DIContainer.bind<SignUpHandler>(Types.SignupHandler).to(SignUpHandler);

DIContainer.bind<UserRepository>(Types.SignupRepository).to(UserRepository);

export default DIContainer;