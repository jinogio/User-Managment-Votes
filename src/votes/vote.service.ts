import { User } from '../db/user-interface';
import { Vote } from 'src/db/vote-interface';

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { randomBytes, scrypt as _scrypt } from 'crypto';

import { SoftDeleteModel, softDeletePlugin } from 'soft-delete-plugin-mongoose';

@Injectable()
export class VotesService {
  constructor(
    @InjectModel('User') private readonly userModel: SoftDeleteModel<User>,
    @InjectModel('Vote') private readonly voteModel: SoftDeleteModel<Vote>,
  ) {}

  async addVote(fromNickname: string, toNickname: string, votes: number) {
    const fromUser = await this.userModel.findOne({ nickname: fromNickname });

    if (!fromUser) {
      return null;
    }

    const toUser = await this.userModel.findOne({
      nickname: toNickname,
    });
    if (!toUser) {
      return null;
    }
    const lastVote = await this.voteModel.findOne({ from: fromNickname }).sort({
      date: -1,
    });

    if (lastVote && Date.now() - lastVote.date <= 360000) {
      return null;
    }

    const vote = new this.voteModel({
      from: fromUser.nickname,
      to: toUser.nickname,
      votes,
    });
    return await vote.save();
  }

  async updateVotes(fromNickname: string, toNickname: string, votes: number) {
    const user = await this.voteModel.findOne(
      { fromNickname: fromNickname },
      { toNickname: toNickname },
    );
    if (!user) {
      return null;
    }
    user.votes = votes;
    return await user.save();
  }

  async voteExists(fromNickname: string, toNickname: string) {
    const vote = await this.voteModel.findOne({
      from: fromNickname,
      to: toNickname,
    });
    if (vote) {
      return true;
    }
    return false;
  }

  async totalUsersVotes(toNickname: string) {
    const user = await this.voteModel.find({ to: toNickname });

    if (!user) {
      return null;
    }
    const sum = user.reduce((total, cur) => {
      return (total += cur.votes);
    }, 0);
    return sum;
  }
}
