import { Contact } from 'src/contacts/entities/contact.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text', { unique: true })
  user: string;
  @Column('text')
  password: string;
  @OneToMany(()=>Contact,contact => contact.user,{eager:true})
  contacts: Contact[];
}
  
