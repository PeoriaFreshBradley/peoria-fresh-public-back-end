import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';

// this pipe is used to validate the register request
@Injectable()
export class RegisterPipe implements PipeTransform {
  transform(value: RegisterDto, metadata: ArgumentMetadata) {
    const errors: string[] = [];
    // check password is atleast 8 characters and has a number and a special character
    if (value.password.length < 8) {
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

    // check email is valid
    if (!/^\S+@\S+\.\S+$/.test(value.email)) {
      errors.push('Email is invalid');
    }
    // check type is valid
    if (value.type !== 'gardener' && value.type !== 'food-bank') {
      errors.push('Type must be gardener or food-bank');
    }
    // check a profile is provided
    if (!value.profile) {
      errors.push('Profile is required');
    }

    // throw errors if any
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }

    return value;
  }
}
