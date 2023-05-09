import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateDaiTransactionTable1683629865829
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'dai_transaction',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'block_number',
            type: 'integer',
          },
          {
            name: 'timestamp',
            type: 'timestamp with time zone',
          },
          {
            name: 'sender',
            type: 'varchar',
          },
          {
            name: 'recipient',
            type: 'varchar',
          },
          {
            name: 'value',
            type: 'varchar',
          },
          {
            name: 'tx_hash',
            type: 'varchar',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('dai_transaction');
  }
}
