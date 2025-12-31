import { db } from "@repo/db";
import { AppError } from "@/utils/appError";

export class UserService {
  private db = db;

  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }) {
    const { page = 1, limit = 10, search, role } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [total, users] = await Promise.all([
      this.db.user.count({ where }),
      this.db.user.findMany({
        where,
        take: limit,
        skip,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
        },
      }),
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateUserRole(id: string, role: string) {
    const user = await this.db.user.findUnique({ where: { id } });
    if (!user) {
      throw AppError.notFound("User not found");
    }

    const updatedUser = await this.db.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return updatedUser;
  }
}
