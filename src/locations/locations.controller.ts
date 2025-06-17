import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { locationsCadastrarDto } from './dto/locations.cadastrar.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { TokenService } from 'src/token/token.service';
import { Locations } from './locations.entity';
import { CustomRequest } from './custom-request.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { LocationsEditarDto } from './dto/LocationsEditarDto';
import cloudinary from 'cloudinary.config';
import * as streamifier from 'streamifier';
import { Readable } from 'stream';

@Controller('locations')
export class LocationsController {
  constructor(
    private readonly locationsService: LocationsService,
    private readonly usuarioservice: TokenService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('listar')
  async listar(): Promise<Locations[]> {
    return this.locationsService.listar();
  }

  @UseGuards(JwtAuthGuard)
  @Post('cadastrar')
  @UseInterceptors(FileInterceptor('foto'))
  async cadastrar(
    @Body() dados: locationsCadastrarDto,
    @UploadedFile() foto: Express.Multer.File,
    @Req() request: CustomRequest,
  ) {
    if (!foto) {
      throw new HttpException('Foto é obrigatória', HttpStatus.BAD_REQUEST);
    }

    const streamUpload = (buffer: Buffer): Promise<string> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'uploads' },
          (error, result) => {
            if (result) resolve(result.secure_url);
            else reject(error);
          },
        );
        Readable.from(buffer).pipe(stream);
      });
    };

    const fotoUrl = await streamUpload(foto.buffer);
    const usuario = request.user;
    const dadosComFoto = { ...dados, foto_local: fotoUrl };

    return this.locationsService.cadastrar(dadosComFoto, usuario);
  }

  @Get('status/:id')
  async verificarStatus(@Param('id') id: number) {
    return this.locationsService.verificarStatus(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('excluir/:id')
  async excluirLocation(@Req() req, @Param('id') id: number) {
    if (!req.user?.isAdmin) {
      throw new HttpException(
        'Apenas administradores podem excluir localizações.',
        HttpStatus.FORBIDDEN,
      );
    }
    return this.locationsService.excluirLocation(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('atualizar-status/:id')
  async atualizarStatus(
    @Req() req,
    @Param('id') id: number,
    @Body() body: { status: number },
  ) {
    if (!req.user?.isAdmin) {
      throw new HttpException(
        'Apenas administradores podem alterar o status.',
        HttpStatus.FORBIDDEN,
      );
    }

    const { status } = body;
    if (status !== 0 && status !== 1) {
      throw new HttpException('Status inválido. Use 0 ou 1.', HttpStatus.BAD_REQUEST);
    }

    return this.locationsService.atualizarStatus(id, status);
  }

  @UseGuards(JwtAuthGuard)
  @Get('minhas')
  async listarMinhasLocations(@Req() req: CustomRequest): Promise<Locations[]> {
    const usuarioId = req.user.id;
    return this.locationsService.listarPorUsuario(usuarioId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('editar/:id')
  @UseInterceptors(FileInterceptor('foto'))
  async editarLocation(
    @Param('id') id: number,
    @Body() dados: LocationsEditarDto,
    @UploadedFile() foto: Express.Multer.File,
    @Req() req: CustomRequest,
  ) {
    const usuarioId = req.user.id;

    if (foto) {
      const streamUpload = (buffer: Buffer): Promise<string> => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'uploads' },
            (error, result) => {
              if (result) resolve(result.secure_url);
              else reject(error);
            },
          );
          Readable.from(buffer).pipe(stream);
        });
      };

      const fotoUrl = await streamUpload(foto.buffer);
      dados.foto_local = fotoUrl;
    }

    return this.locationsService.editarLocation(id, usuarioId, dados);
  }

  @Delete('remover/:id')
  @UseGuards(JwtAuthGuard)
  async removerMinhaLocation(
    @Param('id') id: number,
    @Req() req: CustomRequest,
  ) {
    const usuarioId = req.user.id;
    return this.locationsService.removerMinhaLocation(id, usuarioId);
  }
}
