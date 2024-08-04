/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';
import QuoterAbi from '../abi/uniswap-quoter.json';
import FactoryAbi from '../abi/uniswap-factory.json';
import PoolAbi from '../abi/uniswap-pool.json';
import ERC20Abi from '../abi/erc20.json';

@Injectable()
export class ArbitrumUniswapService {
  private provider: ethers.JsonRpcProvider;
  private quoter: ethers.Contract;
  private factory: ethers.Contract;

  constructor() {
    const providerUrl = 'https://arb1.arbitrum.io/rpc'; // O tu nodo
    this.provider = new ethers.JsonRpcProvider(providerUrl);
    this.quoter = new ethers.Contract('0x61fFE014bA17989E743c5F6cB21bF9697530B21e', QuoterAbi, this.provider);
    this.factory = new ethers.Contract('0x1F98431c8aD98523631AE4a59f267346ea31F984', FactoryAbi, this.provider);
  }

  async getPairRate(tokenIn: string, tokenOut: string, amountIn: number): Promise<number> {
    try {
      let tokenInDecimals = null;
      let tokenOutDecimals = null;
      try{
        tokenInDecimals = await this.getTokenDecimals(tokenIn);
        tokenOutDecimals = await this.getTokenDecimals(tokenOut);
      }catch(error){
        console.error('Error fetching decimals:', error);
        throw error;
      }
      if(tokenInDecimals === null){
        throw new Error(`No decimal found for ${tokenIn}`);
      }
      const amountInWei = ethers.parseUnits(amountIn.toString(), tokenInDecimals); // Ajusta el decimal según tu token
      let poolFee;
      
      try{
        poolFee = this.getPoolFee(tokenIn,tokenOut)
      }
      catch (error) {
        console.error('Error fetching pair rate:', error);
        throw error;
      }
      // Parámetros para quoteExactInputSingle
      const params = {
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountIn: amountInWei,
        fee: poolFee,
        sqrtPriceLimitX96: 0
      };
      // Llamada al método quoteExactInputSingle del contrato
      const result = await this.quoter.quoteExactInputSingle.staticCall(params)
      
      const amountOut = result[0]; // El primer valor retornado es amountOut
      return parseFloat(ethers.formatUnits(amountOut, tokenOutDecimals)); // Ajusta el decimal según tu token
    } catch (error) {
      console.error('Error fetching pair rate:', error);
      throw error;
    }
  }
  async getPoolFee(tokenIn: string, tokenOut: string): Promise<number> {
    const fees = [100,200,300,400,500,1000,1500,2000,2500,3000, 10000]; // Tarifas comunes: 0.05%, 0.3%, 1%
    for (const fee of fees) {
      const poolAddress = await this.factory.getPool(tokenIn, tokenOut, fee);
      if (poolAddress !== 0) {
        const poolContract = new ethers.Contract(poolAddress, PoolAbi, this.provider);
        const poolFee = await poolContract.fee();
        return poolFee;
      }
    }
    throw new Error(`No pool found for the pair ${tokenIn} and ${tokenOut}`);
  }
  async getTokenDecimals(tokenAddress: string): Promise<number> {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20Abi, this.provider);
    const decimals = await tokenContract.decimals();
    return Number(decimals);
  }
}