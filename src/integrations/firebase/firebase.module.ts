import * as admin from 'firebase-admin';
import { firebaseConfiguration } from 'src/config';
import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { app as Firebase } from 'firebase-admin';
import { FIREBASE_APP } from './firebase.const';
import { FirebaseService } from './firebase.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ load: [firebaseConfiguration] })],
  providers: [
    {
      provide: FIREBASE_APP,
      useFactory: (configService: ConfigService): Firebase.App => {
        const serviceAccount = configService.get('firebase');
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      },
      inject: [ConfigService],
    },
    FirebaseService,
  ],
  exports: [FirebaseService, FIREBASE_APP],
})
export class FirebaseModule {}
