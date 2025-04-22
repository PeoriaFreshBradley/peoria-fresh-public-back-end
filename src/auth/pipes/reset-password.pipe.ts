import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ResetPasswordDto } from '../dto/reset-password.dto';

// this pipe is used to validate the reset password request
@Injectable()
export class ResetPasswordPipe implements PipeTransform {
  transform(value: ResetPasswordDto, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }
    const errors: string[] = [];
    // check password is atleast 8 characters and has a number and a special character
    if (value.password?.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/\d/.test(value.password)) {
      errors.push('Password must contain a number');
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value.password)) {
      errors.push('Password must contain a special character');
    }
    // check password and confirm password match
    if (value.password !== value.confirmPassword) {
      errors.push('Passwords do not match');
    }

    // throw errors if any
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return value;
  }
}
