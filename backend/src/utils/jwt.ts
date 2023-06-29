import jwt, {JwtPayload} from 'jsonwebtoken'
import {config} from "../config/config";
import {TokenDto} from "../model/dto/token/token.dto";

class Jwt {
  public generateTokens(token: TokenDto): {
    accessToken: string,
    refreshToken: string
  } {
    const accessToken: string = jwt.sign(
        {...token},
        config.jwt.accessSecret,
        {expiresIn: '20m'});
    const refreshToken: string = jwt.sign(
        {...token},
        config.jwt.refreshSecret,
        {expiresIn: '30d'});
    return {
      accessToken,
      refreshToken
    }
  }

  public validateAccessToken(token: string): JwtPayload | string | null {
    return this.validateToken(token, config.jwt.accessSecret);
  }

  public validateRefreshToken(token: string): JwtPayload | string | null {
    return this.validateToken(token, config.jwt.refreshSecret);
  }

  private validateToken(
      token: string, secret: string): JwtPayload | string | null {
    try {
      return jwt.verify(token, secret);
    } catch (e) {
      return null;
    }
  }
}

export default new Jwt();