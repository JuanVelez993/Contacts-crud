import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Contact } from 'src/contacts/entities/contact.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [UserController],
  providers: [UserService,JwtStrategy ],
  imports: [TypeOrmModule.forFeature([User,Contact])],
  PassportModule.register({ defaultStrategy: 'jwt' }),
  //TODO: agregar JWT_SECRET alas variables de entorno

  JwtModule.registerAsync({
      imports: [ ],
      inject: [  ],
      useFactory: (  ) => {
        // console.log('JWT Secret', configService.get('JWT_SECRET') )
        // console.log('JWT SECRET', process.env.JWT_SECRET)
        return {
          secret: process.env.JWT_SECRET,
          signOptions: {
            expiresIn:'2h'
          }
        }
      }
    })

  //asi se maneja de manera sincrona
    // JwtModule.register({
      // secret: process.env.JWT_SECRET,
      // signOptions: {
      //   expiresIn:'2h'
      // }
    // })

})
export class UserModule {}
