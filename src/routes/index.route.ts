import { Router } from 'express';
import { inject, injectable } from 'inversify';
import { IndexController } from '../controllers/index.controller';

@injectable()
export class IndexRoutes {
  private router: Router;
  private _controller: IndexController;

  constructor(@inject(IndexController) controller: IndexController) {
    this.router = Router();
    this._controller = controller;
  }

  getRoutes() {
    this.mapRoutes();
    return this.router;
  }

  private mapRoutes() {
    this.router.get('/', (req, res) => this._controller.getApiInfo(req, res));
  }
}
