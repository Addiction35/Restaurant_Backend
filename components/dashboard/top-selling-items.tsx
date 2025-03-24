import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TopSellingItemsProps {
  items: Array<{ id: string; title: string; count: number }>
}

export function TopSellingItems({ items }: TopSellingItemsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Selling Items</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No sales data available</div>
          ) : (
            items.map((item, index) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-medium mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{item.title}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.count} sold</div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

