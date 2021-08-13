import { timeStamp } from "console";
import {MigrationInterface, QueryRunner, Table, Timestamp} from "typeorm";

export class createUsers1608407318924 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    // generationStrategy:'increment'
                    
                },
                {
                    name: 'name',
                    type: 'varchar'
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
                {
                    name: 'role',
                    type: 'varchar',
                },     
                {
                    name: "date",
                    type: "datetime",
                },
                {
                    name: "isVerified",
                    type: "boolean",
                    default: false,
                },    
                {
                    name: "tokenId",
                    type: "integer",
                    // default: false,
                }, 
            ],
            foreignKeys: [
                {
                    name: 'TokenUser',
                    columnNames: ['tokenId'],
                    referencedTableName: 'tokens',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                }
            ]

            
 
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users');
    }

}
