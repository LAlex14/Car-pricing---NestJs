import { IsLatitude, IsLongitude, IsNumber, IsString, Max, Min } from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimateDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @Transform(({ value }) => +value)
    @IsNumber()
    @Min(1930)
    @Max(2023)
    year: number;

    @Transform(({ value }) => +value)
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @Transform(({ value }) => +value)
    @IsLatitude()
    lat: number;

    @Transform(({ value }) => +value)
    @IsLongitude()
    lng: number;
}
