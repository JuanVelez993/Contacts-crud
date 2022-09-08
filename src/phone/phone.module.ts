import { Module } from '@nestjs/common';
import { PhoneService } from './phone.service';
import { PhoneController } from './phone.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Phone } from './entities/phone.entity';

@Module({
  controllers: [PhoneController],
  providers: [PhoneService],
  imports: [TypeOrmModule.forFeature([Phone])],
  exports: [PhoneService, TypeOrmModule],
})
export class PhoneModule {}
