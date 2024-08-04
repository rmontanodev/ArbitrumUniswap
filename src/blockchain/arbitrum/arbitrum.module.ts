/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ArbitrumUniswapService } from './arbitrum.uniswap.service';
import { TokenPairsController } from './arbitrum.token-pairs.controller';

@Module({
  providers: [ArbitrumUniswapService],
  controllers: [TokenPairsController],
  exports: [ArbitrumUniswapService]
})
export class ArbitrumUniswapModule {}
