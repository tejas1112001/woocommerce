import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const { limit = "10", low_stock_threshold = "10" } = req.query as {
      limit?: string;
      low_stock_threshold?: string;
    };

    const maxItems = parseInt(limit, 10) || 10;
    const stockThreshold = parseInt(low_stock_threshold, 10) || 10;

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
        take: 2000,
      },
    });

    const orders = (rawOrders || []).sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

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

    const productStatsMap = new Map<string, {
      id: string;
      title: string;
      thumbnail: string | null;
      units_sold: number;
      total_revenue: number;
    }>();

    orders.forEach((order: any) => {
      if (order.status === "canceled") return;

      const items = order.items || [];
      items.forEach((item: any) => {
        const prodId = item.product_id || item.product_title || item.title;
        if (!prodId) return;

        const current = productStatsMap.get(prodId) || {
          id: prodId,
          title: item.product_title || item.title || "Product",
          thumbnail: item.thumbnail || null,
          units_sold: 0,
          total_revenue: 0,
        };

        const qty = Number(item.quantity) || 1;
        const lineTotal = (Number(item.unit_price) || 0) * qty;

        current.units_sold += qty;
        current.total_revenue += lineTotal;

        productStatsMap.set(prodId, current);
      });
    });

    const topProducts = Array.from(productStatsMap.values())
      .sort((a, b) => b.units_sold - a.units_sold)
      .slice(0, maxItems)
      .map(p => ({
        ...p,
        total_revenue: Number(p.total_revenue.toFixed(2)),
      }));

    let lowStockItems: any[] = [];
    try {
      const { data: rawInventory } = await query.graph({
        entity: "inventory_item",
        fields: [
          "id",
          "sku",
          "title",
          "stocked_quantity",
          "reserved_quantity",
        ],
        pagination: { take: 500 },
      });

      if (rawInventory && rawInventory.length > 0) {
        lowStockItems = rawInventory
          .filter((inv: any) => (Number(inv.stocked_quantity) || 0) <= stockThreshold)
          .map((inv: any) => ({
            id: inv.id,
            sku: inv.sku || "N/A",
            title: inv.title || "Inventory Item",
            stocked_quantity: inv.stocked_quantity || 0,
            reserved_quantity: inv.reserved_quantity || 0,
          }))
          .slice(0, maxItems);
      }
    } catch {
      lowStockItems = [];
    }

    const recentOrders = orders.slice(0, maxItems).map((order: any) => ({
      id: order.id,
      display_id: order.display_id || order.id,
      email: order.email || "N/A",
      total: getOrderTotal(order),
      currency_code: order.currency_code || "INR",
      status: order.status || "pending",
      created_at: order.created_at,
    }));

    res.json({
      top_products: topProducts,
      low_stock_items: lowStockItems,
      recent_orders: recentOrders,
    });
  } catch (error: any) {
    console.error("Error in GET /admin/analytics/top-products:", error);
    res.status(500).json({
      message: "Failed to load top products & inventory analytics data",
      error: error.message || String(error),
    });
  }
}
