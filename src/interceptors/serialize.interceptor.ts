import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { map, Observable } from "rxjs";
import { plainToInstance } from "class-transformer";

interface ClassConstructor {
    new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: ClassConstructor) {}

    intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
        // Run something before a request is handled by the request handler
        // console.log('I\'m running before the handler', context)
        return handler.handle().pipe(
            map((data: any) => {
                // Run smth before the response is sent out
                return plainToInstance(this.dto, data, {
                    excludeExtraneousValues: true
                })
            })
        )
    }
}