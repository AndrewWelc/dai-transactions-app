import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { Connection } from 'typeorm';
import { DaiTransaction } from './entities/dai-transaction.entity';
import { DaiService } from './dai.service';
import * as daiABI from '../../abi/Dai.json';

@Injectable()
export class DaiListenerService {
  private readonly logger = new Logger(DaiListenerService.name);
  private readonly provider: ethers.providers.JsonRpcProvider;
  private readonly contract: ethers.Contract;

  constructor(
    private readonly connection: Connection,
    private readonly daiService: DaiService,
  ) {
    const infuraApiKey = '7d6453101f94465293482597a759a456';
    const infuraNetwork = 'mainnet';
    this.provider = new ethers.providers.InfuraProvider(
      infuraNetwork,
      infuraApiKey,
    );
    this.contract = new ethers.Contract(
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      daiABI,
      this.provider,
    );
    this.listen();
  }

  private async listen() {
    const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

    this.contract.on(
      'Transfer',
      async (
        from: string,
        to: string,
        value: ethers.BigNumber,
        event: ethers.Event,
      ) => {
        if (event.address !== daiAddress) {
          this.logger.warn(
            `[transfer listener] transfer not within dai contract: ${event.address}, dai contract: ${daiAddress}`,
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
        this.logger.log(`[transaction] ${JSON.stringify(transaction)}`);
        await this.connection.getRepository(DaiTransaction).save(transaction);
      },
    );
  }
}
