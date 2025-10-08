// socialTypeMap.ts
export const socialTypes = [
  { label: "Celebrity", value: "celebrity" },
  { label: "Doctor", value: "doctor" },
  { label: "Lawyer", value: "lawyer" },
  { label: "Engineer", value: "engineer" },
  { label: "Teacher", value: "teacher" },
  { label: "Entrepreneur", value: "entrepreneur" },
  { label: "Artist", value: "artist" },
  { label: "Musician", value: "musician" },
  { label: "Influencer", value: "influencer" },
  { label: "YouTuber", value: "youtuber" },
  { label: "Athlete - Basketball", value: "athlete_basketball" },
  { label: "Athlete - Football", value: "athlete_football" },
  { label: "Athlete - Badminton", value: "athlete_badminton" },
  { label: "Athlete - Tennis", value: "athlete_tennis" },
  { label: "Athlete - Swimming", value: "athlete_swimming" },
  { label: "Athlete - Athletics", value: "athlete_athletics" },
  { label: "Athlete - Boxing", value: "athlete_boxing" },
  { label: "Athlete - Martial Arts", value: "athlete_martial_arts" },
  { label: "Athlete - Volleyball", value: "athlete_volleyball" },
  { label: "Athlete - Gymnastics", value: "athlete_gymnastics" },
];

// mapping cepat
export const socialTypeMap: Record<string, string> = socialTypes.reduce((acc, cur) => {
  acc[cur.value] = cur.label;
  return acc;
}, {} as Record<string, string>);

// optional helper function
export const getSocialTypeLabel = (value: string | undefined) =>
  value ? socialTypeMap[value] || value : "-";
