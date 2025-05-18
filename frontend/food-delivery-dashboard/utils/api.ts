  // utils/api.ts
async function fetchHotelOwnerDetails(id: string) {
  const res = await fetch(`http://localhost:3000/users/hotelOwners/${id}`);
  if (!res.ok) throw new Error("Failed to fetch hotel owner details");
  return res.json();
}

async function fetchHotelsByOwnerId(id: string) {
  const res = await fetch(`http://localhost:3000/api/hotel/getByUserId/${id}`);
  if (!res.ok) throw new Error("Failed to fetch hotels");
  return res.json();
}