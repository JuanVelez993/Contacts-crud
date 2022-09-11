import { Contact } from 'src/contacts/entities/contact.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Phone {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  phone: string;
  @ManyToOne(()=>Contact,(contact)=>contact.phones,{onDelete:"CASCADE"})
  contact: Contact;
}
