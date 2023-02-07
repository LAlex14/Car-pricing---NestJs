import { Body, Controller, Post, UseGuards, Patch, Param, Query, Get } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guards';
import { CreateReportDto } from "./dtos/create-report.dto";
import { ReportsService } from "./reports.service";
import { CurrentUser } from "../users/decorators/current-user.decorator";
import { User } from "../users/user.entity";
import { ReportDto } from "./dtos/report.dto";
import { Serialize } from "../interceptors/serialize.interceptor";
import { ApproveReportDto } from "./dtos/approve-report.dto";
import { AdminGuard } from "../guards/admin.guards";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@UseGuards(AuthGuard)
@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) {
    }

    @Post()
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
        return this.reportsService.create(body, user)
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportsService.changeApproval(id, body.approved)
    }

    @Get()
    getEstimate(@Query() query: GetEstimateDto,) {
        console.log(query)
        return this.reportsService.createEstimate(query)
    }
}
