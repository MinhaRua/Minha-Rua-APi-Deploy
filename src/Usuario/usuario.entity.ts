import { Locations } from 'src/locations/locations.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 20, unique: true,nullable: true })
  cpf: string;

  @Column({ length: 30, unique: true,nullable: true })
  telefone: string;

  @Column({nullable: true})
  isAdmin: number;

  @Column({nullable: true})
  avisos: number;

  @Column({ length: 255 })
  foto: string;
  
  @OneToMany(() => Locations, locations => locations.usuario)
  locations: Locations[];
}