import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { StationsMap } from "./StationsMap"

export const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-heading text-xl font-semibold">Overview</h1>
      <Card>
        <CardHeader>
          <CardTitle>Station map</CardTitle>
        </CardHeader>
        <CardContent>
          <StationsMap />
        </CardContent>
      </Card>
    </div>
  )
}
