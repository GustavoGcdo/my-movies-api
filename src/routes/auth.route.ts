import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { AuthController } from '../controllers/auth.controller';

@injectable()
export class AuthRoutes {
  private router: Router;
  private _controller: AuthController;

  constructor(@inject(AuthController) controller: AuthController) {
    this.router = Router();
    this._controller = controller;
  }

  getRoutes() {
    this.mapRoutes();
    return this.router;
  }

  private mapRoutes() {
    this.router.post('/auth/login', (req, res) => this._controller.login(req, res));
    this.router.post('/auth/social', (req, res) => this._controller.socialLogin(req, res));
  }
}
