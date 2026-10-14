import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

/** 初始化：user 表、demo_item 表 + 内置管理员 admin/123456 */
export class InitTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`user\` (
        \`id\` BIGINT NOT NULL AUTO_INCREMENT,
        \`username\` VARCHAR(50) NOT NULL COMMENT '用户名',
        \`password_hash\` VARCHAR(100) NOT NULL COMMENT '密码哈希',
        \`nickname\` VARCHAR(50) NOT NULL COMMENT '昵称',
        \`role\` ENUM('user','admin') NOT NULL DEFAULT 'user' COMMENT '角色',
        \`status\` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态 1正常 0禁用',
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_user_username\` (\`username\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`demo_item\` (
        \`id\` BIGINT NOT NULL AUTO_INCREMENT,
        \`title\` VARCHAR(100) NOT NULL COMMENT '标题',
        \`content\` VARCHAR(500) NULL COMMENT '内容',
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='示例表（M0 验收用）';
    `);

    // 内置管理员账号 admin / 123456
    const hash = bcrypt.hashSync('123456', 10);
    await queryRunner.query(
      `INSERT IGNORE INTO \`user\` (\`username\`, \`password_hash\`, \`nickname\`, \`role\`)
       VALUES ('admin', '${hash}', '管理员', 'admin')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `demo_item`');
    await queryRunner.query('DROP TABLE IF EXISTS `user`');
  }
}
