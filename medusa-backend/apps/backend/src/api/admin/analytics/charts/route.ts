import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { from, to, interval = "day" } = req.query as {
      from?: string;
      to?: string;
      interval?: "day" | "week" | "month";
    };

    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const { data: rawOrders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "status",
        "created_at",
        "summary.*",
        "items.*",
      ],
      pagination: {
        take: 5000,
      },
    });

    const orders = (rawOrders || []).filter((order: any) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= fromDate && orderDate <= toDate;
    });

    const getOrderTotal = (order: any): number => {
      if (order.summary?.totals?.current_order_total !== undefined) {
        return Number(order.summary.totals.current_order_total) || 0;
      }
      if (order.items && Array.isArray(order.items)) {
        return order.items.reduce((sum: number, item: any) => {
          const price = Number(item.unit_price) || 0;
          const qty = Number(item.quantity) || 1;
          return sum + price * qty;
        }, 0);
      }
      return 0;
    };

    const getBucketKey = (dateStr: string, mode: "day" | "week" | "month") => {
      const d = new Date(dateStr);
      if (mode === "month") {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      } else if (mode === "week") {
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
      } else {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      }
    };

    const aggregatedMap = new Map<string, { sales: number; orders: number; label: string }>();

    orders.forEach((order: any) => {
      const bucketKey = getBucketKey(order.created_at, interval);
      const current = aggregatedMap.get(bucketKey) || { sales: 0, orders: 0, label: bucketKey };

      const orderTotal = order.status !== "canceled" ? getOrderTotal(order) : 0;
      current.sales += orderTotal;
      current.orders += 1;

      aggregatedMap.set(bucketKey, current);
    });

    const chartData = Array.from(aggregatedMap.entries())
      .map(([date, val]) => ({
        date,
        sales: Number(val.sales.toFixed(2)),
        orders: val.orders,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      chart_data: chartData,
      interval,
    });
  } catch (error: any) {
    console.error("Error in GET /admin/analytics/charts:", error);
    res.status(500).json({
      message: "Failed to load chart analytics data",
      error: error.message || String(error),
    });
  }
}
