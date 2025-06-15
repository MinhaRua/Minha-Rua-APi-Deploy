import { Body, Controller, Put } from "@nestjs/common";
import { RefreshTokenDto } from "./Dto/RefreshTokenDto";
import { TokenService } from "./token.service";

@Controller('token')

export class TokenController{
    constructor(
        private tokenservice: TokenService
    ){}

    @Put('refresh')
    async refreshtoken(@Body() data: RefreshTokenDto){
        return this.tokenservice.refreshtoken(data.oldToken)
    }
}