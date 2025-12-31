/**
 * Indonesia Region API (emsifa/api-wilayah-indonesia)
 * Free API for Indonesian provinces, regencies (kota/kabupaten), districts, and villages
 */

const BASE_URL = "https://www.emsifa.com/api-wilayah-indonesia/api";

export interface Province {
  id: string;
  name: string;
}

export interface Regency {
  id: string;
  province_id: string;
  name: string;
}

export interface District {
  id: string;
  regency_id: string;
  name: string;
}

export interface Village {
  id: string;
  district_id: string;
  name: string;
}

/**
 * Fetch all provinces in Indonesia
 */
export async function getProvinces(): Promise<Province[]> {
  const response = await fetch(`${BASE_URL}/provinces.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch provinces");
  }
  return response.json();
}

/**
 * Fetch all regencies (kota/kabupaten) in a province
 */
export async function getRegencies(provinceId: string): Promise<Regency[]> {
  const response = await fetch(`${BASE_URL}/regencies/${provinceId}.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch regencies");
  }
  return response.json();
}

/**
 * Fetch all districts (kecamatan) in a regency
 */
export async function getDistricts(regencyId: string): Promise<District[]> {
  const response = await fetch(`${BASE_URL}/districts/${regencyId}.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch districts");
  }
  return response.json();
}

/**
 * Fetch all villages (kelurahan/desa) in a district
 */
export async function getVillages(districtId: string): Promise<Village[]> {
  const response = await fetch(`${BASE_URL}/villages/${districtId}.json`);
  if (!response.ok) {
    throw new Error("Failed to fetch villages");
  }
  return response.json();
}
