import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { MoviesController } from '../controllers/movies.controller';
import { Auth } from '../infra/auth/auth.middleware';

@injectable()
export class MovieRoutes {
  private router: Router;
  private _controller: MoviesController;

  constructor(@inject(MoviesController) controller: MoviesController) {
    this.router = Router();
    this._controller = controller;
  }

  getRoutes() {
    this.mapRoutes();
    return this.router;
  }

  private mapRoutes() {
    this.router.get('/movies', Auth.authorize, (req, res) =>
      this._controller.searchMovie(req, res),
    );
    this.router.get('/movies/recommended/:profile', Auth.authorize, (req, res) =>
      this._controller.getRecommendedMovies(req, res),
    );
  }
}
