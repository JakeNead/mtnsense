const useAvalancheData = async () => {
  try {
    const response = await fetch("https://api.avalanche.ca/forecasts/en/areas");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching avalanche data:", error);
  }
};

export default useAvalancheData;
