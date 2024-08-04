/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ArbitrumUniswapService } from '../arbitrum/arbitrum.uniswap.service';

@Injectable()
export class TokenPairsService {
    constructor(private readonly uniswapService: ArbitrumUniswapService) {}
  private pairs = [
    { tokenIn: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', tokenOut: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831' },
    { tokenIn: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831', tokenOut: '0x4D15a3A2286D883AF0AA1B3f21367843FAc63E07' },
    // Añadir más pares según sea necesario
  ];

  // Simular obtener el ratio desde el servicio
  async getPairRate(tokenIn: string, tokenOut: string): Promise<number> {
    return this.uniswapService.getPairRate(tokenIn, tokenOut, 100);
  }

  async getTokenPairs() {
    const pairsWithRates = [];
    for (const pair of this.pairs) {
      const rate = await this.getPairRate(pair.tokenIn, pair.tokenOut);
      pairsWithRates.push({ ...pair, rate });
    }
    return pairsWithRates;
  }
}
