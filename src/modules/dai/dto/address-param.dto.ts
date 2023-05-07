import { IsEthereumAddress } from 'class-validator';

export class AddressParamDto {
  @IsEthereumAddress()
  walletAddress: string;
}
