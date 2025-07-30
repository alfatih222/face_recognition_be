import { Field, InputType, PickType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { i18nValidationMessage } from 'nestjs-i18n';

@InputType()
export class RegisterInput {
  @Field()
  @IsEmail({}, { message: i18nValidationMessage('validation.INVALID_EMAIL') })
  @IsNotEmpty({ message: i18nValidationMessage('validation.NOT_EMPTY') })
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  fullname?: string;

  @Field()
  @MinLength(6, {
    message: i18nValidationMessage('validation.MIN_LENGTH'),
  })
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  username?: string;
}

@InputType()
export class LoginInput extends PickType(
  RegisterInput,
  ['email', 'password'],
  InputType
) { }

@InputType()
export class InputRefreshToken {
  @Field()
  token: string;
}
