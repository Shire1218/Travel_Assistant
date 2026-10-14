import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/** 用户实体（SRS：user 表） */
@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true, comment: '用户名' })
  username: string;

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 100,
    comment: '密码哈希',
  })
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, comment: '昵称' })
  nickname: string;

  @Column({
    type: 'enum',
    enum: ['user', 'admin'],
    default: 'user',
    comment: '角色',
  })
  role: 'user' | 'admin';

  @Column({ type: 'tinyint', default: 1, comment: '状态 1正常 0禁用' })
  status: number;

  @CreateDateColumn({ name: 'created_at', comment: '创建时间' })
  createdAt: Date;
}
