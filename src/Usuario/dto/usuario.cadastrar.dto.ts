export interface UsuarioCadastrarDto{
    nome: string;
    email: string;
    password: string;
    cpf?: string;
    telefone?: string;
    foto: string;
}