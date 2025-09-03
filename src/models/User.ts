import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  declare id: string;

  @Column("text")
  declare name: string;

  @Column({ unique: true, type: "text" })
  declare email: string;

  @Column("text")
  declare role: string;

  @Column({ default: false, type: "boolean" })
  declare isOnboarded: boolean;

  @Column({ nullable: true, type: "text" })
  declare cognitoId: string;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  @DeleteDateColumn()
  declare deletedAt: Date;
}
