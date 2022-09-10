import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Contact } from 'src/contacts/entities/contact.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
    private readonly dataSource: DataSource,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { contacts=[], ...userDetails } = createUserDto;
      const user = this.userRepository.create({
        ...userDetails,
        contacts:contacts.map(contact =>this.contactRepository.create(contact))
        
      });
      await this.userRepository.save(user);
      return user;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto:PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.userRepository.find({
      take:limit,
      skip:offset,
      relations:{
        contacts:true,
      }
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { contacts, ...toUpdate} = updateUserDto;
    const user= await this.userRepository.preload({
      id,
      ...toUpdate
    });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    //query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if(contacts){
         await queryRunner.manager.delete( Contact, { user: { id } });
         contacts:contacts.map(contact =>this.contactRepository.create(contact))
      }
      //await this.userRepository.save(user);
       await queryRunner.manager.save( user);
      await queryRunner.commitTransaction();
      await queryRunner.release();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleDBExceptions(error); 
    }
    
    return user;
  }

  async remove(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    await this.userRepository.remove(user);
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error,check server logs',
    );
  }
}
