import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { DataSource } from 'typeorm';
import { DaiTransaction } from './entities/dai-transaction.entity';
import { DaiService } from './dai.service';
import * as daiABI from '../../abi/Dai.json';

@Injectable()
export class DaiListenerService {
  private readonly logger = new Logger(DaiListenerService.name);
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly contract: ethers.Contract;
  private readonly daiContractAddress: string;

  constructor(
    private readonly dataSource: DataSource,
    private readonly daiService: DaiService,
  ) {
    const infuraApiKey = process.env.INFURA_API_KEY;
    const infuraNetwork = process.env.INFURA_NETWORK;
    this.daiContractAddress = process.env.DAI_CONTRACT_ADDRESS;
    this.provider = new ethers.providers.InfuraProvider(
      infuraNetwork,
      infuraApiKey,
    );
    this.contract = new ethers.Contract(
      this.daiContractAddress,
      daiABI,
      this.provider,
    );
    this.listen();
  }

  private async listen() {
    this.contract.on(
      'Transfer',
      async (
        from: string,
        to: string,
        value: ethers.BigNumber,
        event: ethers.Event,
      ) => {
        if (event.address !== this.daiContractAddress) {
          this.logger.warn(
            `[Transfer listener] transfer not within dai contract: ${event.address}, dai contract: ${this.daiContractAddress}`,
          );
          return;
        }

        const transaction = {
          blockNumber: event.blockNumber,
          timestamp: new Date(
            (await this.provider.getBlock(event.blockNumber)).timestamp * 1000,
          ),
          sender: from,
          recipient: to,
          value: ethers.utils.formatUnits(
            value,
            await this.daiService.getDecimals(),
          ),
          txHash: event.transactionHash,
        };
        this.logger.log(
          `[Transfer - transaction] ${JSON.stringify(transaction)}`,
        );
        await this.dataSource.getRepository(DaiTransaction).save(transaction);
      },
    );
  }
}
