import { Request, Response, Router } from 'express';
import { HealthService } from './health.service';

export class HealthController {
  public router: Router;
  private healthService: HealthService;

  constructor() {
    this.router = Router();
    this.healthService = new HealthService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get('/health', this.checkHealth.bind(this));
  }

  private async checkHealth(req: Request, res: Response) {
    try {
      const status = await this.healthService.getHealthStatus();
      const statusCode = status.status === 'UP' ? 200 : 503;
      res.status(statusCode).json(status);
    } catch (error) {
      res.status(500).json({ status: 'DOWN', error: String(error) });
    }
  }
}
