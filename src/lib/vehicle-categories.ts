export type VehicleCategory = {
  id: string;
  label: string;
  adminValue: string;
  href: string;
  queryValue: string;
  aliases: string[];
  legacyQueryValues?: string[];
  excludeAliases?: string[];
};

export const VEHICLE_CATEGORIES: readonly VehicleCategory[] = [
  {
    id: 'bikes',
    label: 'Bikes',
    adminValue: 'Bike',
    href: '/category/bikes',
    queryValue: 'bikes',
    aliases: ['bike', 'bikes'],
    excludeAliases: ['dirt'],
  },
  {
    id: 'scooty',
    label: 'Scooty',
    adminValue: 'Scooter',
    href: '/category/scooty',
    queryValue: 'scooty',
    aliases: ['scooty', 'scooter', 'scooters'],
    legacyQueryValues: ['scooters'],
  },
  {
    id: 'dirt-bike',
    label: 'Dirt Bike',
    adminValue: 'Dirt Bike',
    href: '/category/dirt-bike',
    queryValue: 'dirt-bike',
    aliases: ['dirt', 'dirt bike', 'dirt-bike'],
  },
  {
    id: 'electric-loader',
    label: 'Loader Scooter',
    adminValue: 'Loader',
    href: '/category/electric-loader',
    queryValue: 'electric-loader',
    aliases: ['loader', 'electric-loader', 'auto-bicycle-bike'],
  },
];

export const ADMIN_VEHICLE_CATEGORIES = VEHICLE_CATEGORIES.map(({ adminValue, label }) => ({
  value: adminValue,
  label,
}));

export function normalizeVehicleCategoryParam(typeParam: string) {
  const normalizedType = typeParam.toLowerCase();
  const category = VEHICLE_CATEGORIES.find((item) => (
    item.id === normalizedType ||
    item.queryValue === normalizedType ||
    item.legacyQueryValues?.includes(normalizedType)
  ));

  return category?.id ?? typeParam;
}

export function vehicleMatchesCategory(category: string | undefined, activeCategory: string | undefined) {
  if (!activeCategory || activeCategory === 'all') return true;

  const normalizedCategory = category?.toLowerCase() || '';
  const normalizedFilter = activeCategory.toLowerCase();
  const categoryConfig = VEHICLE_CATEGORIES.find((item) => item.id === normalizedFilter);

  if (!categoryConfig) {
    return normalizedCategory === normalizedFilter;
  }

  const hasExcludedAlias = categoryConfig.excludeAliases?.some((alias) => (
    normalizedCategory.includes(alias)
  ));

  if (hasExcludedAlias) return false;

  return categoryConfig.aliases.some((alias) => normalizedCategory.includes(alias));
}
