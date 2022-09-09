import { Phone } from 'src/phone/entities/phone.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column('text')
  name: string;
  @Column('text')
  lastname: string;
  @Column('boolean')
  status: boolean;
  @OneToMany(() => Phone, (phone) => phone.contact,{cascade:true,eager:true})
  phones: Phone[];
  @ManyToOne(() => User,(user)=>user.contacts)
  user: User;
}

