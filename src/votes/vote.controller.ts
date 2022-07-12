import {
  Controller,
  Post,
  Get,
  Param,
  HttpException,
  HttpStatus,
  UseGuards,
  Request,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { VotesService } from './vote.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @UseGuards(JwtAuthGuard)
  @Post('likes/:toNickname')
  async addVote(
    @Request() req,
    @Param('toNickname') toNickname: string,
    @Query('vote') vote: number,
  ) {
    try {
      console.log(req.user.nickname, toNickname, vote);
      if (req.user.nickname !== toNickname) {
        const profile = await this.votesService.voteExists(
          req.user.nickname,
          toNickname,
        );
        if (!profile) {
          const addMyVote = await this.votesService.addVote(
            req.user.nickname,
            toNickname,
            vote,
          );
          if (addMyVote) {
            return addMyVote;
          } else {
            throw new NotFoundException('dont vote one houre didnot pass');
          }
        } else {
          throw new NotFoundException('you already voted this user');
        }
      } else {
        throw new NotFoundException('dont vote yourthelv');
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('canselvote/:toNickname')
  async updateVotes(
    @Request() req,
    @Param('toNickname') toNickname: string,
    @Query('vote') vote: number,
  ) {
    if (req.user.nickname === toNickname) {
      throw new NotFoundException('dont vote yourthelf');
    }
    if (req.user.nickname !== toNickname) {
      const profile = await this.votesService.updateVotes(
        req.user.nickname,
        toNickname,
        vote,
      );
      if (profile) {
        return profile;
      } else {
        throw new NotFoundException('incorect profile');
      }
    }
  }

  @Get('total/:toNickname')
  async totalUsersVotes(@Param('toNickname') toNickname: string) {
    if (!toNickname) {
      throw new NotFoundException('this user not found');
    }
    const totalVotes = this.votesService.totalUsersVotes(toNickname);
    console.log(totalVotes);
    if (totalVotes) {
      return totalVotes;
    } else {
      throw new NotFoundException('this user dont have votes');
    }
  }
}
