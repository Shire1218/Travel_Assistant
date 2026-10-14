import { MigrationInterface, QueryRunner } from 'typeorm';

/** M1：新增 plan（计划）表与 system_setting（系统设置）表，并预置高德 key 设置项 */
export class M1PlanSettings1700000001000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`plan\` (
        \`id\` BIGINT NOT NULL AUTO_INCREMENT,
        \`user_id\` BIGINT NOT NULL COMMENT '所属用户',
        \`title\` VARCHAR(100) NOT NULL COMMENT '标题',
        \`start_date\` DATE NOT NULL COMMENT '出行日期-起',
        \`end_date\` DATE NOT NULL COMMENT '出行日期-止',
        \`companion_count\` INT NOT NULL DEFAULT 1 COMMENT '同行人数',
        \`cover_image\` VARCHAR(500) NULL COMMENT '封面图 URL（M1 暂不支持上传，仅存地址）',
        \`budget_total\` DECIMAL(12,2) NULL COMMENT '总预算上限',
        \`remark\` VARCHAR(1000) NULL COMMENT '备注',
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`IDX_plan_user_id\` (\`user_id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='旅行计划表';
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`system_setting\` (
        \`id\` INT NOT NULL AUTO_INCREMENT,
        \`setting_key\` VARCHAR(50) NOT NULL COMMENT '设置键',
        \`setting_value\` VARCHAR(500) NULL COMMENT '设置值',
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        UNIQUE INDEX \`IDX_setting_key\` (\`setting_key\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统设置表';
    `);

    // 预置高德两个 key 的设置项（SRS：Web 端 JS API key + Web 服务 API key）
    await queryRunner.query(`
      INSERT IGNORE INTO \`system_setting\` (\`setting_key\`, \`setting_value\`) VALUES
        ('amap_js_key', ''),
        ('amap_web_service_key', '');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE IF EXISTS `plan`');
    await queryRunner.query('DROP TABLE IF EXISTS `system_setting`');
  }
}
