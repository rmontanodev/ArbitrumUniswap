/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ArbitrumUniswapService } from '../../src/blockchain/arbitrum.uniswap.service'; // Ruta correcta al archivo de servicio

describe('ArbitrumUniswapService', () => {
  let service: ArbitrumUniswapService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArbitrumUniswapService],
    }).compile();

    service = module.get<ArbitrumUniswapService>(ArbitrumUniswapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correctly call quoteExactInputSingle and return the pair rate', async () => {
    // Configura los parámetros de la prueba
    const tokenIn = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
    const tokenOut = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
    const amountIn = 100000;
    // Asegúrate de que el contrato y los tokens estén en la red especificada
    const rate = await service.getPairRate(tokenIn, tokenOut, amountIn);

    // Imprime el resultado para verificarlo
    console.log('Pair Rate:', rate);

    // Añade aquí tus expectativas y verificaciones
    expect(rate).toBeGreaterThan(0); // Ejemplo: espera que el rate sea mayor que 0
  });
  
  it('should correctly call getPoolFee and return the fee for the token"s pool', async () => {
    // Configura los parámetros de la prueba
    const tokenIn = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
    const tokenOut = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';
    // Asegúrate de que el contrato y los tokens estén en la red especificada
    const rate = await service.getPoolFee(tokenIn, tokenOut);

    // Imprime el resultado para verificarlo
    console.log('Fee Rate:', rate);

    // Añade aquí tus expectativas y verificaciones
    expect(rate).toBeGreaterThan(0); // Ejemplo: espera que el rate sea mayor que 0
  });
  
});