import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** 系统设置实体（key-value 形式，当前存放高德两个 key） */
@Entity('system_setting')
export class SystemSetting {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({
    name: 'setting_key',
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '设置键',
  })
  settingKey: string;

  @Column({
    name: 'setting_value',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '设置值',
  })
  settingValue: null | string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
