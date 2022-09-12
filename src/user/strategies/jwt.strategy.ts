import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {
    constructor(
        @InjectRepository( User )
        private readonly userRepository: Repository<User>,

        
    ) {

        super({
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }



     async validate( payload: JwtPayload ): Promise<User> {
        
        const { user } = payload;

        const userToValidate = await this.userRepository.findOneBy({ user });

        if ( !userToValidate  ) 
            throw new UnauthorizedException('Token not valid')
            
        return userToValidate;
    }
}