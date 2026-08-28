import { CareerRoadmap } from "../types";

export const generateCareerRoadmap = async (
  qualification: string,
  interests: string
): Promise<CareerRoadmap | null> => {
  try {
    const response = await fetch("/api/generate-roadmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ qualification, interests }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Roadmap API Error:", errorText);
      throw new Error(`Roadmap request failed with status ${response.status}`);
    }

    const roadmap = (await response.json()) as CareerRoadmap;
    return roadmap;
  } catch (error) {
    console.error("Error generating career roadmap:", error);
    return null;
  }
};
