import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createToken1611692980050 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'tokens',

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
                    name: 'token',
                    type: 'varchar'
                },
                {
                    name: "tokenDate",
                    type: "datetime",
                },  
                {
                    name: 'userName',
                    type: 'varchar'
                },
                // {
                //     name: "user_id",
                //     type: "integer",
                //     // default: false,
                // }, 
    
            ],       
            // foreignKeys: [
            //     {
            //         name: 'UserToken',
            //         columnNames: ['user_id'],
            //         referencedTableName: 'users',
            //         referencedColumnNames: ['id'],
            //         onUpdate: 'CASCADE',    //altera automaticamente os userIds dos tokens caso id usuário seja alterado
            //         onDelete: 'CASCADE',    //apaga automaticamente os tokens com mesmo userId caso usuário seja apagado
            //     }
            // ]     
 
        })
        )}

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('tokens');

    }

}
