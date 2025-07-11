import React, { useState, useEffect } from "react";

interface MonthData {
  income: number;
  activePartners: number;
  plan: {
    income: number;
    activePartners: number;
  };
}

 interface Manager {
  id: number;
  adminName: string;
  months: (MonthData | null)[];
}

 interface ApiResponse {
  data: {
    total: {
      fact: { income: number; activePartners: number };
      plan: { income: number; activePartners: number };
    }[];
    table: Manager[];
  };
}


const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const App: React.FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [startMonth, setStartMonth] = useState(new Date().getMonth());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://3snet.co/js_test/api.json");
        if (!response.ok) throw new Error("Failed to fetch data");
        setApiData(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrev = () => setStartMonth((prev) => (prev - 1 + 12) % 12);
  const handleNext = () => setStartMonth((prev) => (prev + 1) % 12);
  const displayedMonths = Array.from({ length: 6 }, (_, i) => (startMonth + i) % 12);

  const formatCurrency = (value: number | null | undefined) => 
    value === null || value === undefined ? "No data" : `$ ${value.toLocaleString("en-US").replace(/,/g, " ")}`;

  if (loading) return <div className="flex items-center justify-center w-full h-screen bg-gray-50">Loading data...</div>;
  if (error) return <div className="flex items-center justify-center w-full h-screen bg-gray-50">Error: {error}</div>;
  if (!apiData) return <div className="flex items-center justify-center w-full h-screen bg-gray-50">No data available</div>;

  return (
    <div className="w-full w-[1440px] h-screen p-8 font-sans flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Year {new Date().getFullYear()}</h1>
        <div className="flex space-x-4">
          <button onClick={handlePrev} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm hover:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="#1F2937">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button onClick={handleNext} className="w-10 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-full shadow-sm hover:bg-blue-50 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="#1F2937">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-hidden">
        <table className="min-w-full bg-white shadow-lg rounded-lg">
          <thead className="sticky top-0 z-10">
            <tr>
              <th rowSpan={2} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100 border-r border-gray-200" style={{ minWidth: "180px" }}></th>
              <th rowSpan={2} className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100 border-r border-gray-200" style={{ minWidth: "150px" }}></th>
              {displayedMonths.map((monthIndex) => (
                <th key={monthIndex} colSpan={2} className="px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-100 border-r border-gray-200 text-center" style={{ minWidth: "240px" }}>
                  {MONTH_NAMES[monthIndex]}
                </th>
              ))}
            </tr>
            <tr>
              {displayedMonths.flatMap((monthIndex) => [
                <th key={`${monthIndex}-plan`} className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-r border-gray-200" style={{ minWidth: "120px" }}>Plan:</th>,
                <th key={`${monthIndex}-fact`} className="px-6 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100 border-r border-gray-200" style={{ minWidth: "120px" }}>Fact:</th>
              ])}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            <tr className="bg-white hover:bg-blue-50">
              <td rowSpan={2} className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap border-r border-gray-200 align-top">Manager</td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap border-r border-gray-200">Total income:</td>
              {displayedMonths.flatMap((monthIndex) => [
                <td key={`${monthIndex}-total-plan`} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200 bg-gray-50">
                  {formatCurrency(apiData.data.total[monthIndex]?.plan?.income)}
                </td>,
                <td key={`${monthIndex}-total-fact`} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200 bg-white">
                  {formatCurrency(apiData.data.total[monthIndex]?.fact?.income)}
                </td>
              ])}
            </tr>
            <tr className="bg-white border-b-2 border-gray-300 hover:bg-blue-50">
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap border-r border-gray-200">Total active partners:</td>
              {displayedMonths.flatMap((monthIndex) => [
                <td key={`${monthIndex}-total-plan-partners`} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200 bg-gray-50">
                  {apiData.data.total[monthIndex]?.plan?.activePartners ?? "No data"}
                </td>,
                <td key={`${monthIndex}-total-fact-partners`} className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200 bg-white">
                  {apiData.data.total[monthIndex]?.fact?.activePartners ?? "No data"}
                </td>
              ])}
            </tr>

            {apiData.data.table.map((manager) => (
              <React.Fragment key={manager.id}>
                <tr className="hover:bg-blue-50">
                  <td rowSpan={2} className="px-6 py-4 text-sm font-bold text-gray-900 whitespace-nowrap border-r border-gray-200 align-top">{manager.adminName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap border-r border-gray-200">Income:</td>
                  {displayedMonths.map((monthIndex) => (
                    <React.Fragment key={monthIndex}>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200 bg-gray-50">
                        {formatCurrency(manager.months[monthIndex]?.plan?.income)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200 bg-white">
                        {formatCurrency(manager.months[monthIndex]?.income)}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
                <tr className="hover:bg-blue-50 border-b border-gray-200">
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap border-r border-gray-200">Active partners:</td>
                  {displayedMonths.map((monthIndex) => (
                    <React.Fragment key={monthIndex}>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200 bg-gray-50">
                        {manager.months[monthIndex]?.plan?.activePartners ?? "No data"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap border-r border-gray-200 bg-white">
                        {manager.months[monthIndex]?.activePartners ?? "No data"}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;