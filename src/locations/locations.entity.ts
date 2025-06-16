import { Usuario } from 'src/Usuario/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Index } from 'typeorm';


@Index(['latitude', 'longitude'], { unique: true })
@Entity()
export class Locations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100 })
  descricao: string;

  @Column({ length: 255 })
  latitude: string;

  @Column({ length: 255 })
  longitude: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @Column({ length: 255 })
  foto_local: string;

  @Column({ length: 255, unique: true }) 
  endereco: string;

  @Column({nullable: true})
  status: number;

  @ManyToOne(() => Usuario, usuario => usuario.locations)
  usuario: Usuario;
}