import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '@nestjs/passport';
import { SendNotificationDto } from './dto/send-notification.dto';

@Controller('notification')
@UseGuards(AuthGuard('jwt'))
export class NotificationController {
    constructor(private readonly service: NotificationService) { }

    @Get('me')
    getMyNotifications(@Req() req: any) {
        return this.service.getMyNotifications(req.user.id);
    }
    @Get('recipients')
    getRecipients(@Req() req: any) {
        return this.service.getRecipients(req.user.id);
    }

    @Get('search-users')
    searchUsers(@Req() req: any, @Query('q') q: string) {
        return this.service.searchUsers(req.user.id, q || '');
    }
    @Post('send')
    send(@Req() req: any, @Body() dto: SendNotificationDto) {
        return this.service.send(req.user.id, dto);
    }

    @Post(':id/read')
    markAsReadPost(@Req() req: any, @Param('id') id: string) {
        return this.service.markAsRead(req.user.id, id);
    }
}
