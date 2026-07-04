import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { StationsMap } from "./StationsMap";

export const Home = () => {
  return (
    <div className="flex flex-col gap-4">
      <StationsMap />
    </div>
  );
};
