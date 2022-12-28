import { Controller, Post, Req, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
@Controller("auth")

export class AuthController {
    constructor(private authService: AuthService) {
        // authService.doSomething();
    }
    @Post("register")
    register(@Body() authDTO: AuthDto) {
        console.log(authDTO);
        return this.authService.register(authDTO)
    }
    @Post("login")
    login(@Body() authDTO: AuthDto) {
        return this.authService.login(authDTO)

    }
}