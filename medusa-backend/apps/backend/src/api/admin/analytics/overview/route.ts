import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { from, to } = req.query as { from?: string; to?: string };

    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    // Fetch Orders using valid Medusa v2 fields
    const { data: rawOrders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "currency_code",
        "created_at",
        "email",
        "summary.*",
        "items.*",
      ],
      pagination: {
        take: 5000,
      },
    });

    const orders = (rawOrders || []).sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Filter by date range if provided
    const filteredOrders = orders.filter((order: any) => {
      const orderDate = new Date(order.created_at);
      if (fromDate && orderDate < fromDate) return false;
      if (toDate && orderDate > toDate) return false;
      return true;
    });

    // Fetch Customers Count
    let rawCustomers: any[] = [];
    try {
      const { data: customers } = await query.graph({
        entity: "customer",
        fields: ["id", "created_at"],
        pagination: { take: 5000 },
      });
      rawCustomers = customers || [];
    } catch {
      rawCustomers = [];
    }

    const filteredCustomers = rawCustomers.filter((c: any) => {
      const cDate = new Date(c.created_at);
      if (fromDate && cDate < fromDate) return false;
      if (toDate && cDate > toDate) return false;
      return true;
    });

    // Fetch Products Count
    let rawProducts: any[] = [];
    try {
      const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "status"],
        pagination: { take: 5000 },
      });
      rawProducts = products || [];
    } catch {
      rawProducts = [];
    }

    // Helper to calculate total order value
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

    let totalSales = 0;
    const statusCounts: Record<string, number> = {
      pending: 0,
      completed: 0,
      canceled: 0,
      requires_action: 0,
      other: 0,
    };

    filteredOrders.forEach((order: any) => {
      const orderTotal = getOrderTotal(order);
      
      if (order.status !== "canceled") {
        totalSales += orderTotal;
      }

      const st = (order.status || "other").toLowerCase();
      if (statusCounts[st] !== undefined) {
        statusCounts[st]++;
      } else {
        statusCounts.other++;
      }
    });

    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    let prevTotalSales = 0;
    let prevTotalOrders = 0;

    if (fromDate && toDate) {
      const periodDurationMs = toDate.getTime() - fromDate.getTime();
      const prevFromDate = new Date(fromDate.getTime() - periodDurationMs);
      const prevToDate = fromDate;

      const prevOrders = orders.filter((order: any) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= prevFromDate && orderDate < prevToDate;
      });

      prevTotalOrders = prevOrders.length;
      prevOrders.forEach((order: any) => {
        if (order.status !== "canceled") {
          prevTotalSales += getOrderTotal(order);
        }
      });
    }

    const salesTrend = prevTotalSales > 0 
      ? Number((((totalSales - prevTotalSales) / prevTotalSales) * 100).toFixed(1))
      : 0;

    const ordersTrend = prevTotalOrders > 0
      ? Number((((totalOrders - prevTotalOrders) / prevTotalOrders) * 100).toFixed(1))
      : 0;

    res.json({
      metrics: {
        total_sales: totalSales,
        total_orders: totalOrders,
        total_customers: filteredCustomers.length,
        total_products: rawProducts.length,
        average_order_value: Number(averageOrderValue.toFixed(2)),
        status_counts: statusCounts,
        sales_trend_percentage: salesTrend,
        orders_trend_percentage: ordersTrend,
      },
    });
  } catch (error: any) {
    console.error("Error in GET /admin/analytics/overview:", error);
    res.status(500).json({
      message: "Failed to load dashboard overview data",
      error: error.message || String(error),
    });
  }
}
