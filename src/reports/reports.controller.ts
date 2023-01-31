import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { CreateReportDto } from "./dtos/create-report.dto";
import { ReportsService } from "./reports.service";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { User } from "../users/user.entity";
import { ReportDto } from "./dtos/report.dto";
import { Serialize } from "../interceptors/serialize.interceptor";

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {}

    @Post()
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user)
    }
}
