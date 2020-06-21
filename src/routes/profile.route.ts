import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { MoviesController } from '../controllers/movies.controller';
import { ProfilesController } from '../controllers/profiles.controller';

@injectable()
export class ProfileRoutes {
  private router: Router;
  private _controller: ProfilesController;

  constructor(@inject(ProfilesController) controller: ProfilesController) {
    this.router = Router();
    this._controller = controller;
  }

  getRoutes() {
    this.mapRoutes();
    return this.router;
  }

  private mapRoutes() {
    this.router.post('/profiles/:id/watchlist', (req, res) => this._controller.addToWatchlist(req, res));
  }
}
