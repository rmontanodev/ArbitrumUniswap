/* eslint-disable prettier/prettier */
import { Controller, Get, Query, BadRequestException } from '@nestjs/common';
import { ArbitrumUniswapService } from '../arbitrum/arbitrum.uniswap.service';

@Controller('token-pairs')
export class TokenPairsController {
    constructor(private readonly arbitrumUniswapService: ArbitrumUniswapService) {}

  @Get('rate')
  async getPairRate(
    @Query('tokenIn') tokenIn: string,
    @Query('tokenOut') tokenOut: string
  ): Promise<number> {
    if (!tokenIn || !tokenOut) {
      throw new BadRequestException('Missing query parameters: tokenIn and tokenOut are required');
    }
    return await this.arbitrumUniswapService.getPairRate(tokenIn, tokenOut,1000);
  }
}
