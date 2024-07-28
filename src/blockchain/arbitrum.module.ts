/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ArbitrumUniswapService } from './arbitrum.uniswap.service';

@Module({
  providers: [ArbitrumUniswapService],
  exports: [ArbitrumUniswapService]
})
export class ArbitrumUniswapModule {}
