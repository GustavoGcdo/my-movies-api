import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { ProfilesController } from '../controllers/profiles.controller';
import { Auth } from '../infra/auth/auth.middleware';

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
    this.router.get('/profiles/:id/watchlist', Auth.authorize, (req, res) =>
      this._controller.getWatchlist(req, res),
    );
    this.router.post('/profiles/:id/watchlist', Auth.authorize, (req, res) =>
      this._controller.addToWatchlist(req, res),
    );
    this.router.post('/profiles/:id/watchlist/:movie/watched', Auth.authorize, (req, res) =>
      this._controller.markAsWatched(req, res),
    );
  }
}
