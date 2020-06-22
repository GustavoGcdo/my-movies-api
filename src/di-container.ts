import { Container } from 'inversify';
import { IndexController } from './controllers/index.controller';
import { MoviesController } from './controllers/movies.controller';
import { ProfilesController } from './controllers/profiles.controller';
import { UsersController } from './controllers/users.controller';
import { SearchMovieHandler } from './handler/movies/searchMovie.handler';
import { AddToWatchlistHandler } from './handler/profiles/addToWatchlist.handler';
import { AddProfileHandler } from './handler/user/addProfile.handler';
import { GetProfilesHandler } from './handler/user/getProfiles.handler';
import { SignUpHandler } from './handler/user/signUp.handler';
import { MyMoviesRepository } from './repositories/myMovies.repository';
import { UserRepository } from './repositories/user.repository';
import { IndexRoutes } from './routes/index.route';
import { MovieRoutes } from './routes/movie.route';
import { ProfileRoutes } from './routes/profile.route';
import { UserRoutes } from './routes/user.route';
import { TheMovieDBService } from './services/theMovieDB.service';
import MovieTypes from './types/movie.types';
import ProfileTypes from './types/profile.types';
import UserTypes from './types/user.types';
import { GetWatchlistHandler } from './handler/profiles/getWatchlist.handler';
import { MarkAsWatchedHandler } from './handler/profiles/markAsWatched.handler';
import { GetRecommendedMoviesHandler } from './handler/movies/getRecommendedMoviesHandler';
import { AuthRoutes } from './routes/auth.route';
import { AuthController } from './controllers/auth.controller';
import AuthTypes from './types/auth.types';
import { LoginHandler } from './handler/auth/login.handler';
import { AuthenticationService } from './services/authentication.service';

const DIContainer = new Container();

DIContainer.bind<AuthRoutes>(AuthRoutes).toSelf();
DIContainer.bind<IndexRoutes>(IndexRoutes).toSelf();
DIContainer.bind<UserRoutes>(UserRoutes).toSelf();
DIContainer.bind<MovieRoutes>(MovieRoutes).toSelf();
DIContainer.bind<ProfileRoutes>(ProfileRoutes).toSelf();

DIContainer.bind<AuthController>(AuthController).toSelf();
DIContainer.bind<IndexController>(IndexController).toSelf();
DIContainer.bind<UsersController>(UsersController).toSelf();
DIContainer.bind<MoviesController>(MoviesController).toSelf();
DIContainer.bind<ProfilesController>(ProfilesController).toSelf();

DIContainer.bind<LoginHandler>(AuthTypes.LoginHandler).to(LoginHandler);

DIContainer.bind<SignUpHandler>(UserTypes.SignupHandler).to(SignUpHandler);
DIContainer.bind<AddProfileHandler>(UserTypes.AddProfileHandler).to(AddProfileHandler);
DIContainer.bind<GetProfilesHandler>(UserTypes.GetProfilesHandler).to(GetProfilesHandler);

DIContainer.bind<SearchMovieHandler>(MovieTypes.SearchMovieHandler).to(SearchMovieHandler);
DIContainer.bind<GetRecommendedMoviesHandler>(MovieTypes.GetRecommendedMoviesHandler).to(GetRecommendedMoviesHandler);

DIContainer.bind<AddToWatchlistHandler>(ProfileTypes.AddToWatchlistHandler).to(AddToWatchlistHandler);
DIContainer.bind<GetWatchlistHandler>(ProfileTypes.GetWatchlistHandler).to(GetWatchlistHandler);
DIContainer.bind<MarkAsWatchedHandler>(ProfileTypes.MarkAsWatchedHandler).to(MarkAsWatchedHandler);

DIContainer.bind<TheMovieDBService>(TheMovieDBService).toSelf();

DIContainer.bind<UserRepository>(UserTypes.UserRepository).to(UserRepository);
DIContainer.bind<MyMoviesRepository>(ProfileTypes.MyMoviesRepository).to(MyMoviesRepository);

export default DIContainer;