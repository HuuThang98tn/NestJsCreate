import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { User, Note } from "@prisma/client";
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
@Injectable({})
export class AuthService {
    constructor(
        private PrismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {

    }
    async register(authDto: AuthDto) {
        const hashedPassword = await argon.hash(authDto.password)
        try {
            const user = await this.PrismaService.user.create({
                data: {
                    email: authDto.email,
                    hashedPassword: hashedPassword,
                    firstName: authDto.firstName,
                    lastName: authDto.lastName
                },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true,

                }
            })
            return {
                code: 200,
                message: "Successfully",
                user
            }
        } catch (err) {
            if (err.code === "P2002") {
                throw new ForbiddenException("Error")
            }
        }
    }
    async login(authDto: AuthDto) {
        const user = await this.PrismaService.user.findUnique({
            where: {
                email: authDto.email,
            },
        })
        if (!user) {
            throw new ForbiddenException(
                "User not found"
            )
        }
        const passwordMatched = await argon.verify(
            user.hashedPassword,
            authDto.password
        )
        if (!passwordMatched) {
            throw new ForbiddenException(
                "Incorrect password"
            )
        }
        delete user.hashedPassword
        // return {
        //     code: 200,
        //     message: "Successfully",
        //     user
        // }
        return await this.convertObjectToJwtString(user.id, user.email, user)
    }
    async convertObjectToJwtString(userID: number, email: string, users: any): Promise<{ user: any, accessToken: any, }> {
        const payLoad = {
            sub: userID,
            email: email,
        }
        const jwtString = await this.jwtService.signAsync(payLoad, {
            expiresIn: "10m",
            secret: this.configService.get("JWT_SECRET")
        })
        const user = [users]
        return {
            user,
            accessToken: jwtString,
        }

    }


}