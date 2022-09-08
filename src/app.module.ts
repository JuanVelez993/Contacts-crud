import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from './contacts/contacts.module';
import { UserModule } from './user/user.module';
import { PhoneModule } from './phone/phone.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      //este no se suele usar en produccion
      synchronize: true,
    }),
    ContactsModule,
    UserModule,
    PhoneModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
