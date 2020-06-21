import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { inject, injectable } from 'inversify';
import { MoviesController } from '../controllers/movies.controller';

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
    this.router.get('/movies', (req, res) => this._controller.searchMovie(req, res));    
  }
}
