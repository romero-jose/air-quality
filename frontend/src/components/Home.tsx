import { StationsMap } from "./StationsMap"

export const Home = () => {
  return (
    <div className="p-2">
      <h2>Santiago Air Quality</h2>
      <div>
        <StationsMap />
      </div>
    </div>
  )
}
