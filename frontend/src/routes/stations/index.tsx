import { createFileRoute } from "@tanstack/react-router";
import { StationList } from "../../components/StationList";

export const Route = createFileRoute("/stations/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-2">
      <h3>Santiago Air Quality</h3>
      <StationList />
    </div>
  );
}
