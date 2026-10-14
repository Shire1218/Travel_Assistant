import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** 示例实体：仅用于 M0 验收"示例 CRUD 走通前后端与数据库"，后续里程碑可移除 */
@Entity('demo_item')
export class DemoItem {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 100, comment: '标题' })
  title: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '内容' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
