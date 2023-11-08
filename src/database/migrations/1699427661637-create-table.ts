import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1699427661637 implements MigrationInterface {
    name = 'CreateTable1699427661637'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" character varying(500) NOT NULL, "status" "public"."album_status_enum" NOT NULL DEFAULT '1', "deletedAt" TIMESTAMP, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "username" character varying(255), "status" "public"."user_status_enum" NOT NULL DEFAULT 'inactive', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_album" ("userId" uuid NOT NULL, "albumId" uuid NOT NULL, CONSTRAINT "PK_2ea2bd90ce00c7b0866232286e7" PRIMARY KEY ("userId", "albumId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_af6230c421601cc4f57887c8f6" ON "user_album" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_49afa031fe21b7272d7740fa92" ON "user_album" ("albumId") `);
        await queryRunner.query(`ALTER TABLE "user_album" ADD CONSTRAINT "FK_af6230c421601cc4f57887c8f63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_album" ADD CONSTRAINT "FK_49afa031fe21b7272d7740fa925" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_album" DROP CONSTRAINT "FK_49afa031fe21b7272d7740fa925"`);
        await queryRunner.query(`ALTER TABLE "user_album" DROP CONSTRAINT "FK_af6230c421601cc4f57887c8f63"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_49afa031fe21b7272d7740fa92"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af6230c421601cc4f57887c8f6"`);
        await queryRunner.query(`DROP TABLE "user_album"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "album"`);
    }

}
