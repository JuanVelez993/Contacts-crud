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
import { Repository } from 'typeorm';
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
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { contacts=[], ...userDetails } = createUserDto;
      const user = this.userRepository.create({
        ...userDetails,
        contacts:contacts.map(phone =>this.contactRepository.create(phone))
        
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
      skip:offset
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user= await this.userRepository.preload({
      id:id,
      ...updateUserDto
    });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    try {
      await this.userRepository.save(user);
    } catch (error) {
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
