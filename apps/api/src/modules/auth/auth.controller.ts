import { Request, Response, Router } from 'express';
import { AuthService } from './auth.service';

export class AuthController {
  public router: Router;
  private authService: AuthService;

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/register', this.register.bind(this));
    this.router.post('/login', this.login.bind(this));
    this.router.post('/refresh', this.refresh.bind(this));
    this.router.post('/logout', this.logout.bind(this));
    
    // Auth strategies endpoints
    this.router.post('/magic-link', this.magicLink.bind(this));
    this.router.get('/google/callback', this.googleCallback.bind(this));
    this.router.get('/apple/callback', this.appleCallback.bind(this));
  }

  private async register(req: Request, res: Response) {
    try {
      const { email, password, name, tenantName } = req.body;
      const bcrypt = require('bcryptjs'); // Lazy load for speed
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await this.authService.register(email, passwordHash, name, tenantName);
      
      const { passwordHash: _, ...safeUser } = user as any;
      res.status(201).json(safeUser);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  }

  private async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const device = req.headers['user-agent'] as string;
      const ipAddress = req.ip || req.socket.remoteAddress;

      const tokens = await this.authService.login(email, password, device, ipAddress);
      res.status(200).json(tokens);
    } catch (error) {
      res.status(401).json({ error: String(error) });
    }
  }

  private async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      const device = req.headers['user-agent'] as string;
      const ipAddress = req.ip || req.socket.remoteAddress;

      const tokens = await this.authService.refreshSession(refreshToken, device, ipAddress);
      res.status(200).json(tokens);
    } catch (error) {
      res.status(401).json({ error: String(error) });
    }
  }

  private async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      await this.authService.logout(refreshToken);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  }

  private async magicLink(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = await this.authService.generateMagicLink(email);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  }

  private async googleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      const result = await this.authService.handleGoogleCallback(code as string);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  }

  private async appleCallback(req: Request, res: Response) {
    try {
      const { code } = req.query;
      const result = await this.authService.handleAppleCallback(code as string);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: String(error) });
    }
  }
}
