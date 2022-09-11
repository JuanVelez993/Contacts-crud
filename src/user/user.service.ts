import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Contact } from 'src/contacts/entities/contact.entity';
import { DataSource, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto, LoginUserDto } from './dto';
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
      const { contacts = [], password, ...userDetails } = createUserDto;
      const user = this.userRepository.create({
        ...userDetails,
        password: bcrypt.hashSync(password, 10),
        contacts: contacts.map((contact) =>
          this.contactRepository.create(contact),
        ),
      });
      await this.userRepository.save(user);
      return user;
      //TODO: retornar el JWT de acceso
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
      relations: {
        contacts: true,
      },
    });
    return users.map((user) => ({
      ...user,
      contacts: user.contacts.map((contact) => contact),
    }));
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
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

  async login(loginUserDto: LoginUserDto) {
    const { user, password } = loginUserDto;
    const userTologin = await this.userRepository.findOne({
      where: { user },
      select: { user: true, password: true, id: true } //! OJO!
    });
    if (!userTologin)
      throw new UnauthorizedException('Credentials are not valid {email}');

    if (bcrypt.compareSync(password, userTologin.password))
      throw new UnauthorizedException('Credentials are not valid {password}');
    return userTologin;
    //TODO:retornar el JWT
  }

  private handleDBExceptions(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error,check server logs',
    );
  }
}
