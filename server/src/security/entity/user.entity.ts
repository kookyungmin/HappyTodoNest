import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity({ name: "koo_users" })
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ name: "nickname", length: 64 })
    name: string;
    @Column({ length: 64, unique: true })
    email: string;
    @Column({ length: 512 })
    password: string;
    @Column({ type: "tinyint" })
    auth: number;
    @Column({ type: "tinyint" })
    status: number;
    @Column({ name: "google_id", length: 32, nullable: true })
    googleId: string;
    @Column({ name: "kakao_id", length: 32, nullable: true })
    kakaoId: string;
    @Column({ name: "naver_id", length: 32, nullable: true })
    naverId: string;
    @UpdateDateColumn({ name: "update_dt", type: "timestamp" })
    updateDt: Date;
    @CreateDateColumn({ name: "create_dt", type: "timestamp" })
    createDt: Date;
    @DeleteDateColumn({ name: "delete_dt", type: "timestamp" })
    deleteDt: Date;
}