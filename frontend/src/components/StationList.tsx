import { useQuery } from "@tanstack/react-query";
import { stationsQuery } from "../api/queries";
import { Link } from "@tanstack/react-router";

export const StationList = () => {
    const stations = useQuery(stationsQuery());

    if (stations.isLoading) {
        return <div>Loading...</div>;
    }

    if (stations.isError) {
        return <div>Error loading stations</div>;
    }

    return (
        <div className="p-2">
            <ul>
                {stations.data?.map((station) => (
                    <li key={station.code}>
                        <Link to={`/stations/$stationCode`} params={{ stationCode: station.code }}>
                            {station.name} ({station.code})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
