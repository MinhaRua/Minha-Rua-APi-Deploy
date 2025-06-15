import { Request } from 'express';
import { Usuario } from 'src/Usuario/usuario.entity';


export interface CustomRequest extends Request {
  user: Usuario;  
}