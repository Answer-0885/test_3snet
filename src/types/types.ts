export interface MonthData {
  income: number;
  activePartners: number;
  plan: {
    income: number;
    activePartners: number;
  };
}

export interface Manager {
  id: number;
  adminName: string;
  months: (MonthData | null)[];
}

export interface ApiResponse {
  data: {
    total: {
      fact: { income: number; activePartners: number };
      plan: { income: number; activePartners: number };
    }[];
    table: Manager[];
  };
}

export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
