/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArbitrumUniswapModule } from './blockchain/arbitrum.module';

@Module({
  imports: [ArbitrumUniswapModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
