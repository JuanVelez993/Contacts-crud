import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { PhoneService } from 'src/phone/phone.service';
import { Phone } from '../phone/entities/phone.entity';

@Module({
  controllers: [ContactsController],
  providers: [ContactsService],
  imports: [TypeOrmModule.forFeature([Contact,Phone])],
  
})
export class ContactsModule {}
