import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";
import { CreateReportDto } from "./dtos/create-report.dto";
import { User } from "../users/user.entity";

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

    create(body: CreateReportDto, user: User) {
        const report = this.repo.create(body)
        report.user = user;
        return this.repo.save(report)
    }

    async changeApproval(id: string, approved: boolean) {
        let report = await this.repo.findOneBy({ id: +id })
        if (!report) {
            throw new NotFoundException('report not found')
        }
        report.approved = approved
        return this.repo.save(report)
    }
}
