import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataResponse } from 'src/common/types/DataResponse';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, DataResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<DataResponse<T>> {
    return next.handle().pipe(
      map(data => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: 'Success', // Or a more dynamic message
        data: data,
      })),
    );
  }
}