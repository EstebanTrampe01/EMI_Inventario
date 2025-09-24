import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createAdmin() {
    const existingAdmin = await this.userRepository.findOne({ where: { username: 'admin' } });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin', 10);
      const admin = this.userRepository.create({
        username: 'admin',
        password: hashedPassword,
      });
      await this.userRepository.save(admin);
      console.log('Admin user created: username=admin, password=admin');
    }
  }
}
