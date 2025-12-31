import { db, type Prisma } from "@repo/db";

interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  action?: string;
  userId?: string;
  type?: "user" | "system"; // user: user_id != null, system: user_id == null
  startDate?: Date;
  endDate?: Date;
}

export class AuditLogService {
  private db = db;

  async getAuditLogs(params: GetAuditLogsParams) {
    const {
      page = 1,
      limit = 10,
      search,
      action,
      userId,
      type,
      startDate,
      endDate,
    } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogsWhereInput = {
      ...(search && {
        OR: [
          { object_type: { contains: search, mode: "insensitive" } },
          { object_id: { contains: search, mode: "insensitive" } },
          { action: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(action && { action }),
      ...(userId && { user_id: userId }),
      ...(type === "user" && { user_id: { not: null } }),
      ...(type === "system" && { user_id: null }),
      ...(startDate &&
        endDate && {
          created_at: {
            gte: startDate,
            lte: endDate,
          },
        }),
    };

    const [total, logs] = await Promise.all([
      this.db.auditLogs.count({ where }),
      this.db.auditLogs.findMany({
        where,
        take: limit,
        skip,
        orderBy: { created_at: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
    ]);

    return {
      data: logs.map((log) => ({
        ...log,
        id: log.id.toString(), // Convert BigInt to string
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAuditLogById(id: string) {
    const log = await this.db.auditLogs.findUnique({
      where: { id: BigInt(id) },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!log) return null;

    return {
      ...log,
      id: log.id.toString(),
    };
  }

  async getDistinctActions() {
    const actions = await this.db.auditLogs.groupBy({
      by: ["action"],
    });
    return actions.map((a) => a.action).filter(Boolean);
  }
}
