import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UserRegisterDto } from './dto/user-register-dto';
import { UsersService } from './users.service';
import { UserNicknameDto } from './dto/user-nickname-dto';
import { UserUpdateDto } from './dto/user-update-dto';
import { UserPaginationDto } from './dto/pagination-dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/decorator/role.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async registerUser(@Body() user: UserRegisterDto) {
    try {
      const result = await this.usersService.registerUser(user);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Request() req) {
    try {
      return req.user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(Role.Admin || Role.Basic)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('update')
  async updateuser(
    @Body() user: UserUpdateDto,
    @Query('nickname') nickname: string,
  ) {
    const updated = await this.usersService.updateUser(nickname, user);
    return updated;
  }

  @Get('/myList')
  async listUser(@Query() userPagination: UserPaginationDto) {
    const list = await this.usersService.listUser({
      page: userPagination.page,
      size: userPagination.size,
    });
    return list;
  }

  @Get('list')
  async getUserList() {
    try {
      const profile = await this.usersService.getUserList();
      return profile;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':nickname')
  async getUser(@Param() userNickname: UserNicknameDto) {
    try {
      const profile = await this.usersService.getUser(userNickname);
      return profile;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':nickname')
  async deleteUser(@Param('nickname') userNickname: UserNicknameDto) {
    const profile = await this.usersService.deleteUser(userNickname);
    return profile;
  }
}
