import type { User } from "@repo/db";
import { AppError } from "@/utils/appError";
import { BaseService } from "../service";

export class CustomerService extends BaseService<User, "user"> {
  constructor() {
    super("user");
  }

  findAll = async () => {
    const customers = await this.db[this.model].findMany({
      include: {
        orders: {
          select: {
            total_cents: true,
          },
        },
      },
    });

    return customers;
  };

  findById = async (id: string) => {
    const customer = await this.db[this.model].findUnique({
      where: {
        id,
      },
      include: {
        orders: true,
        addresses: true,
      },
    });

    if (!customer) {
      throw AppError.notFound("Customer not found");
    }

    return customer;
  };
}
