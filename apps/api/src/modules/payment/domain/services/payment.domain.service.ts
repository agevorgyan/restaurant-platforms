import { Injectable, NotImplementedException } from '@nestjs/common';
import { IPaymentRepository } from '../../domain/repositories/payment.repository.interface';
import { CreatePaymentDto, UpdatePaymentStatusDto } from '../../application/dto/payment.dto';

@Injectable()
export class PaymentDomainService {
  constructor(private readonly repository: IPaymentRepository) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async createPayment(_id: string, _dto: CreatePaymentDto): Promise<any> {
    throw new NotImplementedException('Refactored in EPIC 13. Application services to be implemented in subsequent EPICs.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async updateStatus(_id: string, _dto: UpdatePaymentStatusDto): Promise<any> {
    throw new NotImplementedException('Refactored in EPIC 13. State machine and transitions now handled by Payment Aggregate.');
  }
}
