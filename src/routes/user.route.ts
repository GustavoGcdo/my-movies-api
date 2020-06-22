import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { UsersController } from '../controllers/users.controller';
import { Auth } from '../infra/auth/auth.middleware';

@injectable()
export class UserRoutes {
  private router: Router;
  private _controller: UsersController;

  constructor(@inject(UsersController) controller: UsersController) {
    this.router = Router();
    this._controller = controller;
  }

  getRoutes() {
    this.mapRoutes();
    return this.router;
  }

  private mapRoutes() {
    this.router.post('/users/signup', (req, res) => this._controller.signUp(req, res));
    this.router.post('/users/:id/profiles', Auth.authorize, (req, res) =>
      this._controller.addProfile(req, res),
    );
    this.router.get('/users/:id/profiles', Auth.authorize, (req, res) =>
      this._controller.getProfiles(req, res),
    );
  }
}
