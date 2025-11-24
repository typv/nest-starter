import { EntityManager, RequestContext } from '@mikro-orm/core';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MikroOrmMicroserviceInterceptor implements NestInterceptor {
  constructor(private readonly em: EntityManager) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'rpc') {
      const emFork = this.em.fork();
      return new Observable((observer) => {
        RequestContext.create(emFork, () => {
          const stream$ = next.handle();

          stream$.subscribe({
            next: (value) => {
              let plain: any;
              try {
                plain = JSON.parse(JSON.stringify(value));
              } catch {
                // fallback: send original if stringify fails
                plain = value;
              }

              observer.next(plain);
            },
            error: (err) => observer.error(err),
            complete: async () => {
              try {
                await emFork.flush();
              } catch (e) {
                console.log('e: ', e);
              }
              observer.complete();
            },
          });
        });
      });
    }
    return next.handle();
  }
}
