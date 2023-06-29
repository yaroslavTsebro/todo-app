export class TokenDto {
  id: number;
  email: string;
  isVerified: boolean = false;

  constructor(id: number, email: string, isVerified: boolean) {
    this.id = id;
    this.email = email;
    this.isVerified = isVerified;
  }
}