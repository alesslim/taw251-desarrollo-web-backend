import { Body, Controller, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LogoutDto } from './dto/logout.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    login(@Body() loginDto: LoginDto, @Req() req: Request) {
        const ip =
            req.ip ||
            req.socket.remoteAddress ||
            'ip no detectada';

        const navegador =
            req.headers['user-agent']?.toString() ||
            'navegador no detectado';

        return this.authService.login(loginDto, ip, navegador);
    }

    @Post('logout')
    logout(@Body() logoutDto: LogoutDto, @Req() req: Request) {
        const ip = req.ip || req.socket.remoteAddress || 'ip no detectada';

        const navegador =
            req.headers['user-agent']?.toString() ||
            'navegador no detectado';

        return this.authService.logout(logoutDto, ip, navegador);
    }
}