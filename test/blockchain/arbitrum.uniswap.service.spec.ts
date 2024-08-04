/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { ArbitrumUniswapService } from '../../src/blockchain/arbitrum/arbitrum.uniswap.service'; // Ruta correcta al archivo de servicio

describe('ArbitrumUniswapService', () => {
  let service: ArbitrumUniswapService;
  let app: INestApplication;
  const port = 3001; // Puerto para la aplicación en las pruebas
  const baseUrl = `http://localhost:${port}`;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppModule,ArbitrumUniswapService],
    }).compile();
    app = module.createNestApplication();
    // Configurar el puerto antes de iniciar la aplicación
    await app.listen(port);
    console.log(app)
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
  it('should return token decimals', async () => {
    const tokenAddress = '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1';
    const decimals = 18;
    const result = await service.getTokenDecimals(tokenAddress);
    expect(result).toBe(decimals);
  });
  it('/token-pairs/rate (GET) should return the rate of a token pair', async () => {
    const tokenIn = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9';
    const tokenOut = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

    const response = await axios.get(`${baseUrl}/token-pairs/rate`, {
      params: {
        tokenIn,
        tokenOut,
      },
    });
    console.log(response)

    expect(response.status).toBe(200);
  });

  it('/token-pairs/rate (GET) should throw BadRequestException if parameters are missing', async () => {
    try {
      await axios.get(`${baseUrl}/token-pairs/rate`);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(400);
        expect(error.response.data.message).toBe('Missing query parameters: tokenIn and tokenOut are required');
      }
    }
  });
  afterAll(async () => {
    await app.close();
  });
});