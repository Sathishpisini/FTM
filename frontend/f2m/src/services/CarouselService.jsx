export const getCarouselData = async () => {
  const res = await fetch("http://localhost:8080/api/carousel");

  if (!res.ok) {
    throw new Error("Failed to fetch carousel data");
  }

  const data = await res.json();

  return data || []; // ✅ always return array
};