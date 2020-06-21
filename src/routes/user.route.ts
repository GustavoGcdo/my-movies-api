import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { inject, injectable } from 'inversify';

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
    this.router.post('/users/:id/profiles', (req, res) => this._controller.addProfile(req, res));
    this.router.get('/users/:id/profiles', (req, res) => this._controller.getProfiles(req, res));
  }
}
