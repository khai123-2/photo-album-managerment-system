import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTable1699810192835 implements MigrationInterface {
    name = 'CreateTable1699810192835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "content" character varying(500) NOT NULL, "deletedAt" TIMESTAMP, "userId" uuid, "photoId" uuid, CONSTRAINT "PK_0b0e4bbc8415ec426f87f3a88e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "username" character varying(255), "status" "public"."user_status_enum" NOT NULL DEFAULT '0', CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."photo_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "photo" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "link" character varying(255) NOT NULL, "status" "public"."photo_status_enum" NOT NULL DEFAULT '1', "deletedAt" TIMESTAMP, "ownerId" uuid, "albumId" uuid, CONSTRAINT "PK_723fa50bf70dcfd06fb5a44d4ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."album_status_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "album" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(255) NOT NULL, "description" character varying(500) NOT NULL, "status" "public"."album_status_enum" NOT NULL DEFAULT '1', "deletedAt" TIMESTAMP, CONSTRAINT "PK_58e0b4b8a31bb897e6959fe3206" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_album" ("userId" uuid NOT NULL, "albumId" uuid NOT NULL, CONSTRAINT "PK_2ea2bd90ce00c7b0866232286e7" PRIMARY KEY ("userId", "albumId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_af6230c421601cc4f57887c8f6" ON "user_album" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_49afa031fe21b7272d7740fa92" ON "user_album" ("albumId") `);
        await queryRunner.query(`CREATE TABLE "follow" ("userId" uuid NOT NULL, "followingId" uuid NOT NULL, CONSTRAINT "PK_fb7f37934cfb1fc8375d4a5cd44" PRIMARY KEY ("userId", "followingId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_af9f90ce5e8f66f845ebbcc6f1" ON "follow" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_e9f68503556c5d72a161ce3851" ON "follow" ("followingId") `);
        await queryRunner.query(`CREATE TABLE "photo_likes_user" ("photoId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_e9136b32740f2fc821cba41fc49" PRIMARY KEY ("photoId", "userId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5112a0f49c2af1af8a5c62c8aa" ON "photo_likes_user" ("photoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1bf66313f68f95c81b3f2e1c0f" ON "photo_likes_user" ("userId") `);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_16688e4a4f41cb008e4d7934a4c" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_f353bfecac9a367c89d293b4508" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photo" ADD CONSTRAINT "FK_464bcdec1590ef4d623166f1b54" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_album" ADD CONSTRAINT "FK_af6230c421601cc4f57887c8f63" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "user_album" ADD CONSTRAINT "FK_49afa031fe21b7272d7740fa925" FOREIGN KEY ("albumId") REFERENCES "album"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_af9f90ce5e8f66f845ebbcc6f15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_e9f68503556c5d72a161ce38513" FOREIGN KEY ("followingId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "photo_likes_user" ADD CONSTRAINT "FK_5112a0f49c2af1af8a5c62c8aae" FOREIGN KEY ("photoId") REFERENCES "photo"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "photo_likes_user" ADD CONSTRAINT "FK_1bf66313f68f95c81b3f2e1c0f9" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "photo_likes_user" DROP CONSTRAINT "FK_1bf66313f68f95c81b3f2e1c0f9"`);
        await queryRunner.query(`ALTER TABLE "photo_likes_user" DROP CONSTRAINT "FK_5112a0f49c2af1af8a5c62c8aae"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_e9f68503556c5d72a161ce38513"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_af9f90ce5e8f66f845ebbcc6f15"`);
        await queryRunner.query(`ALTER TABLE "user_album" DROP CONSTRAINT "FK_49afa031fe21b7272d7740fa925"`);
        await queryRunner.query(`ALTER TABLE "user_album" DROP CONSTRAINT "FK_af6230c421601cc4f57887c8f63"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_464bcdec1590ef4d623166f1b54"`);
        await queryRunner.query(`ALTER TABLE "photo" DROP CONSTRAINT "FK_f353bfecac9a367c89d293b4508"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_16688e4a4f41cb008e4d7934a4c"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_c0354a9a009d3bb45a08655ce3b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1bf66313f68f95c81b3f2e1c0f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5112a0f49c2af1af8a5c62c8aa"`);
        await queryRunner.query(`DROP TABLE "photo_likes_user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e9f68503556c5d72a161ce3851"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af9f90ce5e8f66f845ebbcc6f1"`);
        await queryRunner.query(`DROP TABLE "follow"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_49afa031fe21b7272d7740fa92"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_af6230c421601cc4f57887c8f6"`);
        await queryRunner.query(`DROP TABLE "user_album"`);
        await queryRunner.query(`DROP TABLE "album"`);
        await queryRunner.query(`DROP TYPE "public"."album_status_enum"`);
        await queryRunner.query(`DROP TABLE "photo"`);
        await queryRunner.query(`DROP TYPE "public"."photo_status_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
