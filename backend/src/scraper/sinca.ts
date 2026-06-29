import * as cheerio from "cheerio";

export type ScrapedReading = {
  date: string;
  hour: string;
  pm25: number | null;
  pm10: number | null;
  so2: number | null;
  no2: number | null;
  co: number | null;
  o3: number | null;
  preliminary: boolean;
}

const SINCA_URL = "https://sinca.mma.gob.cl/cgi-bin/registrostable2k19.cgi";

function parseCell(raw: string | undefined | null): number | null {
  if (raw === undefined || raw === null) return null;
  const trimmed = raw.trim();
  if (trimmed === "") return null;
  const normalized = trimmed.replace(",", ".");
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

export async function fetchStationReadings(
  stationCode: string,
  domain: string = "CONAMA",
): Promise<ScrapedReading[]> {
  const url = `${SINCA_URL}?domain=${encodeURIComponent(domain)}&stn=${encodeURIComponent(stationCode)}`;

  const response = await fetch(url, {
    headers: {
      Accept: "*/*",
      "User-Agent":
        "Mozilla/5.0 (compatible; sinca-api/1.0; personal air-quality tracker)",
      Referer: "https://sinca.mma.gob.cl/mapainteractivo/index.html",
    },
  });

  if (!response.ok) {
    throw new Error(
      `SINCA request failed for station ${stationCode}: ${response.status} ${response.statusText}`,
    );
  }

  const html = await response.text();
  return parseReadingsHtml(html);
}

export function parseReadingsHtml(html: string): ScrapedReading[] {
  const $ = cheerio.load(html);

  const footerText = $("tfoot").text();
  const preliminary = /preliminar/i.test(footerText);

  const readings: ScrapedReading[] = [];

  $("tbody tr").each((_, row) => {
    const cells = $(row).find("td");
    if (cells.length < 8) return;

    const dateText = $(cells[0]).text().trim();
    const hourText = $(cells[1]).text().trim();

    if (!dateText || !hourText) return;

    readings.push({
      date: dateText,
      hour: `${hourText}:00`,
      pm25: parseCell($(cells[2]).text()),
      pm10: parseCell($(cells[3]).text()),
      so2: parseCell($(cells[4]).text()),
      no2: parseCell($(cells[5]).text()),
      co: parseCell($(cells[6]).text()),
      o3: parseCell($(cells[7]).text()),
      preliminary,
    });
  });

  return readings;
}
