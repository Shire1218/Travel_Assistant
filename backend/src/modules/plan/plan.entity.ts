import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/** 计划实体（SRS F2.2：计划元信息） */
@Entity('plan')
@Index('IDX_plan_user_id', ['userId'])
export class Plan {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint', comment: '所属用户' })
  userId: number;

  @Column({ type: 'varchar', length: 100, comment: '标题' })
  title: string;

  @Column({ name: 'start_date', type: 'date', comment: '出行日期-起' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date', comment: '出行日期-止' })
  endDate: string;

  @Column({
    name: 'companion_count',
    type: 'int',
    default: 1,
    comment: '同行人数',
  })
  companionCount: number;

  @Column({
    name: 'cover_image',
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '封面图 URL（M1 暂不支持上传）',
  })
  coverImage: null | string;

  @Column({
    name: 'budget_total',
    type: 'decimal',
    precision: 12,
    scale: 2,
    nullable: true,
    comment: '总预算上限',
  })
  budgetTotal: null | string;

  @Column({ type: 'varchar', length: 1000, nullable: true, comment: '备注' })
  remark: null | string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
